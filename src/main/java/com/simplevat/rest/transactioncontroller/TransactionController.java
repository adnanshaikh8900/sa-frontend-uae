/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.ChartOfAccountCategoryIdEnumConstant;
import com.simplevat.constant.FileTypeEnum;
import com.simplevat.constant.TransactionCreationMode;
import com.simplevat.constant.TransactionExplinationStatusEnum;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.TransactionFilterEnum;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionStatus;
import com.simplevat.helper.TransactionHelper;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.ReconsileRequestLineItemModel;
import com.simplevat.rest.reconsilationcontroller.ReconsilationRestHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.ChartOfAccountCategoryService;
import com.simplevat.service.ContactService;
import com.simplevat.service.EmployeeService;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.utils.ChartUtil;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.FileHelper;

import io.swagger.annotations.ApiOperation;

/**
 *
 * @author sonu
 */
@RestController
@RequestMapping(value = "/rest/transaction")
public class TransactionController{
	 private final Logger logger = LoggerFactory.getLogger(TransactionController.class);
	@Autowired
	JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private ChartOfAccountService chartOfAccountService;

	@Autowired
	private TransactionHelper transactionHelper;

	@Autowired
	private ChartUtil chartUtil;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private ReconsilationRestHelper reconsilationRestHelper;

	@Autowired
	private JournalService journalService;

	@Autowired
	private BankAccountService bankService;

	@Autowired
	private ChartOfAccountCategoryService chartOfAccountCategoryService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private TransactionStatusService transactionStatusService;

	@Autowired
	private DateFormatUtil dateFormatUtil;

	@Autowired
	private FileHelper fileHelper;

	@ApiOperation(value = "Get Transaction List")
	@GetMapping(value = "/list")
	public ResponseEntity getAllTransaction(TransactionRequestFilterModel filterModel) {

		Map<TransactionFilterEnum, Object> dataMap = new EnumMap<>(TransactionFilterEnum.class);

		if (filterModel.getBankId() != null) {
			dataMap.put(TransactionFilterEnum.BANK_ID, bankAccountService.findByPK(filterModel.getBankId()));
		}
		if (filterModel.getTransactionDate() != null) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
			LocalDateTime dateTime = null;
			try {
				dateTime = Instant.ofEpochMilli(dateFormat.parse(filterModel.getTransactionDate()).getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
			} catch (ParseException e) {
				logger.error("Error", e);
			}
			dataMap.put(TransactionFilterEnum.TRANSACTION_DATE, dateTime);
		}
		if (filterModel.getTransactionStatusCode() != null) {
			dataMap.put(TransactionFilterEnum.TRANSACTION_STATUS,
					transactionStatusService.findByPK(filterModel.getTransactionStatusCode()));
		}
		if (filterModel.getChartOfAccountId() != null) {
			dataMap.put(TransactionFilterEnum.CHART_OF_ACCOUNT,
					chartOfAccountService.findByPK(filterModel.getChartOfAccountId()));
		}
		dataMap.put(TransactionFilterEnum.ORDER_BY, ORDERBYENUM.DESC);
		dataMap.put(TransactionFilterEnum.DELETE_FLAG, false);
		PaginationResponseModel response = transactionService.getAllTransactionList(dataMap, filterModel);
		if (response == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		response.setData(transactionHelper.getModelList(response.getData()));
		return new ResponseEntity(response, HttpStatus.OK);
	}

	@ApiOperation(value = "Add New Transaction", response = Transaction.class)
	@PostMapping(value = "/save")
	public ResponseEntity saveTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
			HttpServletRequest request) {

		try {

			if (transactionPresistModel != null) {
				List<Journal> journalList = null;

				Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
				Transaction trnx = new Transaction();
				trnx.setCreatedBy(userId);
				trnx.setCoaCategory(chartOfAccountCategoryService.findByPK(transactionPresistModel.getCoaCategoryId()));
				boolean isDebit = ChartOfAccountCategoryIdEnumConstant.isDebitedFromBank(
						trnx.getCoaCategory().getParentChartOfAccount().getChartOfAccountCategoryId());
				trnx.setDebitCreditFlag(isDebit ? 'D' : 'C');
				trnx.setTransactionAmount(transactionPresistModel.getAmount());
				trnx.setCreationMode(TransactionCreationMode.MANUAL);
				trnx.setTransactionExplinationStatusEnum(TransactionExplinationStatusEnum.FULL);
				trnx.setTransactionDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				trnx.setExplainedTransactionCategory(
						transactionCategoryService.findByPK(transactionPresistModel.getTransactionCategoryId()));

				if (transactionPresistModel.getDescription() != null) {
					trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
				}
				if (transactionPresistModel.getCustomerId() != null) {
					trnx.setExplinationCustomer(contactService.findByPK(transactionPresistModel.getCustomerId()));
				}
				if (transactionPresistModel.getVatId() != null) {
					trnx.setVatCategory(vatCategoryService.findByPK(transactionPresistModel.getVatId()));
				}
				if (transactionPresistModel.getVendorId() != null) {
					trnx.setExplinationVendor((contactService.findByPK(transactionPresistModel.getVendorId())));
				}
				if (transactionPresistModel.getEmployeeId() != null) {
					trnx.setExplinationEmployee(employeeService.findByPK(transactionPresistModel.getEmployeeId()));
				}
				if (transactionPresistModel.getBankId() != null) {
					trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
				}
				if (transactionPresistModel.getReconsileBankId() != null) {
					trnx.setExplinationBankAccount(bankService.findByPK(transactionPresistModel.getReconsileBankId()));
				}
				if (transactionPresistModel.getReference() != null
						&& !transactionPresistModel.getReference().isEmpty()) {
					trnx.setReferenceStr(transactionPresistModel.getReference());
				}
				if (transactionPresistModel.getAttachmentFile() != null
						&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
					String filePath = fileHelper.saveFile(transactionPresistModel.getAttachmentFile(),
							FileTypeEnum.TRANSATION);
					trnx.setExplainedTransactionAttachmentFileName(
							transactionPresistModel.getAttachmentFile().getOriginalFilename());
					trnx.setExplainedTransactionAttachmentPath(filePath);
				}
				transactionService.persist(trnx);
				
				List<ReconsileRequestLineItemModel> itemModels = new ArrayList<>();
				if (transactionPresistModel.getInvoiceIdListStr() != null && !transactionPresistModel.getInvoiceIdListStr().isEmpty()) {
					ObjectMapper mapper = new ObjectMapper();
					try {
						itemModels = mapper.readValue(transactionPresistModel.getInvoiceIdListStr(),
								new TypeReference<List<ReconsileRequestLineItemModel>>() {
								});
					} catch (IOException ex) {
						logger.error("Error", ex);
					}
				}
				
				journalList = reconsilationRestHelper.get(
						ChartOfAccountCategoryIdEnumConstant.get(transactionPresistModel.getCoaCategoryId()),
						transactionPresistModel.getTransactionCategoryId(), transactionPresistModel.getAmount(), userId,
						trnx,itemModels);

				Map<Integer, BigDecimal> invoiceIdAmtMap = new HashMap<>();
				if (transactionPresistModel.getInvoiceIdList() != null) {
					for (ReconsileRequestLineItemModel invoice : transactionPresistModel.getInvoiceIdList()) {
						invoiceIdAmtMap.put(invoice.getInvoiceId(), invoice.getRemainingInvoiceAmount());
					}
				}

				if (journalList != null && !journalList.isEmpty()) {
					List<TransactionStatus> transationStatusList = new ArrayList<>();
					for (Journal journal : journalList) {

						JournalLineItem item = journal.getJournalLineItems().iterator().next();

						journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(
								transactionPresistModel.getDate(), transactionPresistModel.getDATE_FORMAT()));
						journalService.persist(journal);
						TransactionStatus status = new TransactionStatus();
						status.setCreatedBy(userId);
						status.setExplinationStatus(TransactionExplinationStatusEnum.FULL);
						status.setTransaction(trnx);
						status.setRemainingToExplain(invoiceIdAmtMap.containsKey(item.getReferenceId())
								? invoiceIdAmtMap.get(item.getReferenceId())
								: BigDecimal.ZERO);
						status.setReconsileJournal(journal);
						transactionStatusService.persist(status);

						transationStatusList.add(status);
					}
				}

				return new ResponseEntity<>(HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error("Error", e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "update Transaction", response = Transaction.class)
	@PostMapping(value = "/update")
	public ResponseEntity updateTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
			HttpServletRequest request) {

		try {

			if (transactionPresistModel != null) {
				List<Journal> journalList = null;

				Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
				Transaction trnx = transactionService.findByPK(transactionPresistModel.getTransactionId());
				trnx.setCreatedBy(userId);
				trnx.setCoaCategory(chartOfAccountCategoryService.findByPK(transactionPresistModel.getCoaCategoryId()));
				boolean isDebit = ChartOfAccountCategoryIdEnumConstant.isDebitedFromBank(
						trnx.getCoaCategory().getParentChartOfAccount().getChartOfAccountCategoryId());
				trnx.setDebitCreditFlag(isDebit ? 'D' : 'C');
				trnx.setTransactionAmount(transactionPresistModel.getAmount());
				trnx.setTransactionExplinationStatusEnum(TransactionExplinationStatusEnum.FULL);
				trnx.setTransactionDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				trnx.setExplainedTransactionCategory(
						transactionCategoryService.findByPK(transactionPresistModel.getTransactionCategoryId()));

				if (transactionPresistModel.getDescription() != null) {
					trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
				}
				if (transactionPresistModel.getCustomerId() != null) {
					trnx.setExplinationCustomer(contactService.findByPK(transactionPresistModel.getCustomerId()));
				}
				if (transactionPresistModel.getVatId() != null) {
					trnx.setVatCategory(vatCategoryService.findByPK(transactionPresistModel.getVatId()));
				}
				if (transactionPresistModel.getVendorId() != null) {
					trnx.setExplinationVendor((contactService.findByPK(transactionPresistModel.getVendorId())));
				}
				if (transactionPresistModel.getEmployeeId() != null) {
					trnx.setExplinationEmployee(employeeService.findByPK(transactionPresistModel.getEmployeeId()));
				}
				if (transactionPresistModel.getBankId() != null) {
					trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
				}
				if (transactionPresistModel.getReconsileBankId() != null) {
					trnx.setExplinationBankAccount(bankService.findByPK(transactionPresistModel.getReconsileBankId()));
				}
				if (transactionPresistModel.getReference() != null
						&& !transactionPresistModel.getReference().isEmpty()) {
					trnx.setReferenceStr(transactionPresistModel.getReference());
				}
				if (transactionPresistModel.getAttachmentFile() != null
						&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
					String filePath = fileHelper.saveFile(transactionPresistModel.getAttachmentFile(),
							FileTypeEnum.TRANSATION);
					trnx.setExplainedTransactionAttachmentFileName(
							transactionPresistModel.getAttachmentFile().getOriginalFilename());
					trnx.setExplainedTransactionAttachmentPath(filePath);
				}
				transactionService.update(trnx);

				// remove old entries
				List<TransactionStatus> trnxStatusList = transactionStatusService
						.findAllTransactionStatuesByTrnxId(transactionPresistModel.getTransactionId());
				transactionStatusService.deleteList(trnxStatusList);

				journalList = reconsilationRestHelper.get(
						ChartOfAccountCategoryIdEnumConstant.get(transactionPresistModel.getCoaCategoryId()),
						transactionPresistModel.getTransactionCategoryId(), transactionPresistModel.getAmount(), userId,
						trnx, transactionPresistModel.getInvoiceIdList());

				Map<Integer, BigDecimal> invoiceIdAmtMap = new HashMap<>();
				if (transactionPresistModel.getInvoiceIdList() != null) {
					for (ReconsileRequestLineItemModel invoice : transactionPresistModel.getInvoiceIdList()) {
						invoiceIdAmtMap.put(invoice.getInvoiceId(), invoice.getRemainingInvoiceAmount());
					}
				}

				if (journalList != null && !journalList.isEmpty()) {
					List<TransactionStatus> transationStatusList = new ArrayList<>();
					for (Journal journal : journalList) {

						JournalLineItem item = journal.getJournalLineItems().iterator().next();

						journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(
								transactionPresistModel.getDate(), transactionPresistModel.getDATE_FORMAT()));
						journalService.persist(journal);
						TransactionStatus status = new TransactionStatus();
						status.setCreatedBy(userId);
						status.setExplinationStatus(TransactionExplinationStatusEnum.FULL);
						status.setTransaction(trnx);
						status.setRemainingToExplain(invoiceIdAmtMap.containsKey(item.getReferenceId())
								? invoiceIdAmtMap.get(item.getReferenceId())
								: BigDecimal.ZERO);
						status.setReconsileJournal(journal);
						transactionStatusService.persist(status);

						transationStatusList.add(status);
					}
				}

				return new ResponseEntity<>(HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error("Error", e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Delete Transaction By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deleteTransaction(@RequestParam(value = "id") Integer id) {
		Transaction trnx = transactionService.findByPK(id);
		if (trnx != null) {
			trnx.setDeleteFlag(Boolean.TRUE);
			transactionService.deleteTransaction(trnx);
		}
		return new ResponseEntity(HttpStatus.OK);

	}

	@ApiOperation(value = "Delete Transaction in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deleteTransactions(@RequestBody DeleteModel ids) {
		try {
			transactionService.deleteByIds(ids.getIds());
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Transaction By ID")
	@GetMapping(value = "/getById")
	public ResponseEntity getInvoiceById(@RequestParam(value = "id") Integer id) {
		Transaction trnx = transactionService.findByPK(id);
		if (trnx == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(transactionHelper.getModel(trnx), HttpStatus.OK);
		}
	}

	@GetMapping(value = "/getCashFlow")
	public ResponseEntity getCashFlow(@RequestParam int monthNo) {
		try {
			Object obj = chartUtil.getCashFlow(transactionService.getCashInData(monthNo, null),
					transactionService.getCashOutData(monthNo, null));
			return new ResponseEntity<>(obj, HttpStatus.OK);
		} catch (Exception e) {
			logger.error("Error", e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import com.simplevat.constant.*;

import static com.simplevat.constant.ErrorConstant.ERROR;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.simplevat.entity.*;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.*;
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
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.TransactionFilterEnum;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.helper.TransactionHelper;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.PostingRequestModel;
import com.simplevat.rest.ReconsileRequestLineItemModel;
import com.simplevat.rest.receiptcontroller.ReceiptRestHelper;
import com.simplevat.rest.reconsilationcontroller.ReconsilationRestHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.utils.ChartUtil;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.FileHelper;

import io.swagger.annotations.ApiOperation;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author sonu
 */
@RestController
@RequestMapping(value = "/rest/transaction")
public class TransactionRestController {
	private final Logger logger = LoggerFactory.getLogger(TransactionRestController.class);
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

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private ReceiptService receiptService;

	@Autowired
	private CustomerInvoiceReceiptService customerInvoiceReceiptService;

	@Autowired
	private ReceiptRestHelper receiptRestHelper;

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private TransactionExpensesService transactionExpensesService;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private SupplierInvoicePaymentService supplierInvoicePaymentService;

	@Autowired
	private UserService userService;

	@Autowired
	private CurrencyService currencyService;


	@ApiOperation(value = "Get Transaction List")
	@GetMapping(value = "/list")
	public ResponseEntity<PaginationResponseModel> getAllTransaction(TransactionRequestFilterModel filterModel) {

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
				logger.error(ERROR, e);
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
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		response.setData(transactionHelper.getModelList(response.getData()));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@ApiOperation(value = "Add New Transaction", response = Transaction.class)
	@PostMapping(value = "/save")
	public ResponseEntity<String> saveTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
												  HttpServletRequest request) {

		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
//dada ki ID
		int chartOfAccountCategory = transactionPresistModel.getCoaCategoryId();

		Transaction trnx = updateTransactionWithCommonFields(transactionPresistModel,userId,TransactionCreationMode.MANUAL);
		trnx.setCreatedBy(userId);
		switch(ChartOfAccountCategoryIdEnumConstant.get(chartOfAccountCategory))
		{
//---------------------------------------Expense Chart of Account Category----------------------------------
			case EXPENSE:
				if(transactionPresistModel.getExpenseCategory()!=null && transactionPresistModel.getExpenseCategory() !=0)
				{
					explainExpenses(transactionPresistModel, userId, trnx);
				}
				else
				{  // Supplier Invoices
					updateTransactionForSupplierInvoices(trnx,transactionPresistModel);
					// JOURNAL LINE ITEM FOR normal transaction
					Journal journal = reconsilationRestHelper.invoiceReconsile(userId,trnx,false);
					journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
							transactionPresistModel.getDATE_FORMAT()));
					journalService.persist(journal);
					List<ReconsileRequestLineItemModel> itemModels = getReconsileRequestLineItemModels(transactionPresistModel);
					reconsileSupplierInvoices(userId, trnx, itemModels);
				}
				break;
			case MONEY_PAID_TO_USER:
				updateTransactionMoneyPaidToUser(trnx,transactionPresistModel);
				Journal journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			case TRANSFERD_TO:
			case MONEY_SPENT:
			case MONEY_SPENT_OTHERS:
			case PURCHASE_OF_CAPITAL_ASSET:
				updateTransactionForMoneySpent(trnx,transactionPresistModel);
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
//-----------------------------------------------------Sales Chart of Account Category-----------------------------------------
			case SALES:
				// Customer Invoices
				updateTransactionForCustomerInvoices(trnx,transactionPresistModel);
				// JOURNAL LINE ITEM FOR normal transaction
				journal = reconsilationRestHelper.invoiceReconsile(userId,trnx,true);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				List<ReconsileRequestLineItemModel> itemModels = getReconsileRequestLineItemModels(transactionPresistModel);
				reconsileCustomerInvoices(userId, trnx, itemModels);
				break;
			case TRANSFER_FROM:
			case REFUND_RECEIVED:
			case INTEREST_RECEVIED:
			case DISPOSAL_OF_CAPITAL_ASSET:
			case MONEY_RECEIVED_FROM_USER:
			case MONEY_RECEIVED_OTHERS:
				updateTransactionForMoneyReceived(trnx,transactionPresistModel);
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			default:
				return new ResponseEntity<>("Chart of Category Id not sent correctly", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>("Saved successfull", HttpStatus.OK);

	}

	@ApiOperation(value = "update Transaction", response = Transaction.class)
	@PostMapping(value = "/update")
	public ResponseEntity<String> updateTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
													HttpServletRequest request) {

		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		int chartOfAccountCategory = transactionPresistModel.getCoaCategoryId();

		Transaction trnx = updateTransactionWithCommonFields(transactionPresistModel,userId,TransactionCreationMode.IMPORT);

		switch(ChartOfAccountCategoryIdEnumConstant.get(chartOfAccountCategory))
		{
//---------------------------------------Expense Chart of Account Category----------------------------------
			case EXPENSE:
				if(transactionPresistModel.getExpenseCategory()!=null && transactionPresistModel.getExpenseCategory() !=0)
				{
					explainExpenses(transactionPresistModel, userId, trnx);
				}
				else
				{  // Supplier Invoices
					updateTransactionForSupplierInvoices(trnx,transactionPresistModel);
					// JOURNAL LINE ITEM FOR normal transaction
					Journal journal = reconsilationRestHelper.invoiceReconsile(userId,trnx,false);
					journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
							transactionPresistModel.getDATE_FORMAT()));
					journalService.persist(journal);
					List<ReconsileRequestLineItemModel> itemModels = getReconsileRequestLineItemModels(transactionPresistModel);
					reconsileSupplierInvoices(userId, trnx, itemModels);
				}
				break;
			case MONEY_PAID_TO_USER:
				updateTransactionMoneyPaidToUser(trnx,transactionPresistModel);
				Journal journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			case TRANSFERD_TO:
			case MONEY_SPENT:
			case MONEY_SPENT_OTHERS:
			case PURCHASE_OF_CAPITAL_ASSET:
				updateTransactionForMoneySpent(trnx,transactionPresistModel);
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
//-----------------------------------------------------Sales Chart of Account Category-----------------------------------------
			case SALES:
				// Customer Invoices
				updateTransactionForCustomerInvoices(trnx,transactionPresistModel);
				// JOURNAL LINE ITEM FOR normal transaction
				journal = reconsilationRestHelper.invoiceReconsile(userId,trnx,true);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				List<ReconsileRequestLineItemModel> itemModels = getReconsileRequestLineItemModels(transactionPresistModel);
				reconsileCustomerInvoices(userId, trnx, itemModels);
				break;
			case TRANSFER_FROM:
			case REFUND_RECEIVED:
			case INTEREST_RECEVIED:
			case DISPOSAL_OF_CAPITAL_ASSET:
			case MONEY_RECEIVED_FROM_USER:
			case MONEY_RECEIVED_OTHERS:
				updateTransactionForMoneyReceived(trnx,transactionPresistModel);
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			default:
				return new ResponseEntity<>("Chart of Category Id not sent correctly", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>("Saved successfull", HttpStatus.OK);
	}

	/**
	 *
	 * @param userId
	 * @param trnx
	 * @param itemModels
	 */
	private void reconsileCustomerInvoices(Integer userId, Transaction trnx, List<ReconsileRequestLineItemModel> itemModels) {
		BigDecimal totalAmt = BigDecimal.ZERO;
		for (ReconsileRequestLineItemModel explainParam : itemModels) {
			// Update invoice Payment status
			Invoice invoiceEntity = invoiceService.findByPK(explainParam.getId());
			Contact contact =  invoiceEntity.getContact();
			totalAmt = totalAmt.add(invoiceEntity.getTotalAmount());
			if (invoiceEntity.getStatus() < InvoiceStatusEnum.PAID.getValue()) {
				invoiceEntity.setStatus(
						explainParam.getRemainingInvoiceAmount().compareTo(BigDecimal.ZERO) == 0
								? InvoiceStatusEnum.PAID.getValue()
								: InvoiceStatusEnum.PARTIALLY_PAID.getValue());
				invoiceEntity.setDueAmount(BigDecimal.ZERO);
				invoiceService.update(invoiceEntity);
				// CREATE MAPPNG BETWEEN RECEIPT AND INVOICE
				CustomerInvoiceReceipt customerInvoiceReceipt = new CustomerInvoiceReceipt();
				customerInvoiceReceipt.setCustomerInvoice(invoiceEntity);
				customerInvoiceReceipt.setPaidAmount(invoiceEntity.getTotalAmount());
				customerInvoiceReceipt.setDeleteFlag(Boolean.FALSE);
				customerInvoiceReceipt.setDueAmount(BigDecimal.ZERO);

				// CREATE RECEIPT
				Receipt receipt = transactionHelper.getReceiptEntity(contact, totalAmt,
						trnx.getBankAccount().getTransactionCategory());
				receipt.setCreatedBy(userId);
				receiptService.persist(receipt);

				// POST JOURNAL FOR RECCEPT
				Journal journalForReceipt = receiptRestHelper.receiptPosting(
						new PostingRequestModel(receipt.getId(), receipt.getAmount()), userId,
						receipt.getDepositeToTransactionCategory());
				journalService.persist(journalForReceipt);

				// SAVE DATE OF RECEIPT AND INVOICE MAPPING IN MIDDLE TABLE
				customerInvoiceReceipt.setReceipt(receipt);
				customerInvoiceReceipt.setCreatedBy(userId);
				customerInvoiceReceiptService.persist(customerInvoiceReceipt);
			}
			// CREATE MAPPING BETWEEN TRANSACTION AND JOURNAL
			TransactionStatus status = new TransactionStatus();
			status.setCreatedBy(userId);
			status.setExplinationStatus(TransactionExplinationStatusEnum.FULL);
			status.setTransaction(trnx);
			status.setRemainingToExplain(explainParam.getRemainingInvoiceAmount());
			status.setInvoice(invoiceEntity);
			transactionStatusService.persist(status);
		}
	}

	/**
	 *
	 * @param userId
	 * @param trnx
	 * @param itemModels
	 */
	private void reconsileSupplierInvoices(Integer userId, Transaction trnx, List<ReconsileRequestLineItemModel> itemModels) {
		BigDecimal totalAmt = BigDecimal.ZERO;
		for (ReconsileRequestLineItemModel explainParam : itemModels) {
			// Update invoice Payment status
			Invoice invoiceEntity = invoiceService.findByPK(explainParam.getId());
			Contact contact =  invoiceEntity.getContact();
			totalAmt = totalAmt.add(invoiceEntity.getTotalAmount());
			if (invoiceEntity.getStatus() < InvoiceStatusEnum.PAID.getValue()) {
				invoiceEntity.setStatus(
						explainParam.getRemainingInvoiceAmount().compareTo(BigDecimal.ZERO) == 0
								? InvoiceStatusEnum.PAID.getValue()
								: InvoiceStatusEnum.PARTIALLY_PAID.getValue());
				invoiceEntity.setDueAmount(BigDecimal.ZERO);
				invoiceService.update(invoiceEntity);

				// CREATE MAPPNG BETWEEN PAYMENT AND INVOICE
				SupplierInvoicePayment supplierInvoicePayment = new SupplierInvoicePayment();
				supplierInvoicePayment.setSupplierInvoice(invoiceEntity);
				supplierInvoicePayment.setPaidAmount(invoiceEntity.getTotalAmount());
				supplierInvoicePayment.setDeleteFlag(Boolean.FALSE);
				supplierInvoicePayment.setDueAmount(BigDecimal.ZERO);
				// CREATE PAYMENT
				Payment payment = transactionHelper.getPaymentEntity(contact, totalAmt,
						trnx.getBankAccount().getTransactionCategory(), invoiceEntity);
				payment.setCreatedBy(userId);
				paymentService.persist(payment);

				// POST JOURNAL FOR PAYMENT
				Journal journalForReceipt = receiptRestHelper.paymentPosting(
						new PostingRequestModel(payment.getPaymentId(), payment.getInvoiceAmount()),
						userId, payment.getDepositeToTransactionCategory());
				journalService.persist(journalForReceipt);

				// SAVE DATE OF RECEIPT AND INVOICE MAPPING IN MIDDLE TABLE
				supplierInvoicePayment.setPayment(payment);
				supplierInvoicePayment.setCreatedBy(userId);
				supplierInvoicePaymentService.persist(supplierInvoicePayment);
			}
			// CREATE MAPPING BETWEEN TRANSACTION AND JOURNAL
			TransactionStatus status = new TransactionStatus();
			status.setCreatedBy(userId);
			status.setExplinationStatus(TransactionExplinationStatusEnum.FULL);
			status.setTransaction(trnx);
			status.setRemainingToExplain(explainParam.getRemainingInvoiceAmount());
			status.setInvoice(invoiceEntity);
			transactionStatusService.persist(status);
		}
	}

	/**
	 * This method with retrieve the invoice list from the TransactionPresistModel to List of ReconsileRequestLineItemModel
	 * @param transactionPresistModel
	 * @return list<ReconsileRequestLineItemModel>
	 */
	private List<ReconsileRequestLineItemModel> getReconsileRequestLineItemModels(@ModelAttribute TransactionPresistModel transactionPresistModel) {
		List<ReconsileRequestLineItemModel> itemModels = new ArrayList<>();
		if (transactionPresistModel.getExplainParamListStr() != null
				&& !transactionPresistModel.getExplainParamListStr().isEmpty()) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				itemModels = mapper.readValue(transactionPresistModel.getExplainParamListStr(),
						new TypeReference<List<ReconsileRequestLineItemModel>>() {
						});
			} catch (IOException ex) {
				logger.error(ERROR, ex);
			}
		}
		return itemModels;
	}

	/**
	 *
	 * @param transactionPresistModel
	 * @param userId
	 * @param trnx
	 */
	private void explainExpenses(@ModelAttribute TransactionPresistModel transactionPresistModel, Integer userId, Transaction trnx) {
		//create new expenses
		Expense expense =  createNewExpense(transactionPresistModel,userId);
		// create Journal entry for Expense
		//Chart of account in expense and user
		Journal journal = getJournalEntryForExpense(transactionPresistModel,expense,userId);
		journalService.persist(journal);
		int transactionCategoryId = 0;
		if(transactionPresistModel.getTransactionCategoryId()==null) {
			transactionCategoryId = TransactionCategoryConsatant.TRANSACTION_EMPLOYEE_REIMBURSEMENTS;
			TransactionCategory transactionCategory = transactionCategoryService.findByPK(transactionCategoryId);
			trnx.setExplainedTransactionCategory(transactionCategory);
		}
		else
		{
			transactionCategoryId = transactionPresistModel.getTransactionCategoryId();
		}
		// explain transaction
		updateTransactionMoneyPaidToUser(trnx,transactionPresistModel);
		// create Journal entry for Transaction explanation
		//Employee reimbursement and bank
		journal = reconsilationRestHelper.getByTransactionType(transactionCategoryId,
				transactionPresistModel.getAmount(), userId, trnx);
		journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
				transactionPresistModel.getDATE_FORMAT()));
		journalService.persist(journal);
	}

	private Journal getJournalEntryForExpense(TransactionPresistModel postingRequestModel, Expense expense,Integer userId) {
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory	transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);

		journalLineItem1.setCreditAmount(postingRequestModel.getAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journalLineItem1.setReferenceId(expense.getExpenseId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		TransactionCategory saleTransactionCategory = transactionCategoryService
				.findByPK(expense.getTransactionCategory().getTransactionCategoryId());
		journalLineItem2.setTransactionCategory(saleTransactionCategory);
		journalLineItem2.setDebitAmount(postingRequestModel.getAmount());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journalLineItem2.setReferenceId(expense.getExpenseId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

	private Expense createNewExpense(TransactionPresistModel model, Integer userId) {
		Expense expense = new Expense();
		expense.setStatus(ExpenseStatusEnum.PAID.getValue());
		Expense.ExpenseBuilder expenseBuilder = expense.toBuilder();
		expenseBuilder.expenseAmount(model.getAmount()).userId(userService.findByPK(model.getUserId()));
		if (model.getDate() != null) {
			expenseBuilder.expenseDate(dateFormatUtil.getDateStrAsLocalDateTime(model.getDate(),
					model.getDATE_FORMAT()));
		}
		expenseBuilder.expenseDescription(model.getDescription());
		if (model.getCurrencyCode() != null) {
			expenseBuilder.currency(currencyService.findByPK(model.getCurrencyCode()));
		}
		if (model.getExpenseCategory() != null) {
			expenseBuilder.transactionCategory(transactionCategoryService.findByPK(model.getExpenseCategory()));
		}
		if (model.getVatId() != null) {
			expenseBuilder.vatCategory(vatCategoryService.findByPK(model.getVatId()));
		}
		if (model.getBankId() != null) {
			expenseBuilder.bankAccount(bankAccountService.findByPK(model.getBankId()));
		}
		expenseBuilder.createdBy(userId).createdDate(LocalDateTime.now());
		if (model.getAttachmentFile() != null && !model.getAttachmentFile().isEmpty()) {
			String fileName = null;
			try {
				fileName = fileHelper.saveFile(model.getAttachmentFile(), FileTypeEnum.EXPENSE);
			} catch (IOException e) {
				logger.error("Error saving file attachment ");
			}
			expenseBuilder.receiptAttachmentFileName(model.getAttachmentFile().getOriginalFilename())
					.receiptAttachmentPath(fileName);

		}
		expense =expenseBuilder.build();
		expenseService.persist(expense);
		return expense;
	}

	private void updateTransactionForMoneySpent(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		trnx.setDebitCreditFlag('D');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment(transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}
	private void updateTransactionForMoneyReceived(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		trnx.setDebitCreditFlag('C');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment(transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}

	private void updateTransactionForSupplierInvoices(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		trnx.setDebitCreditFlag('D');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
		if (transactionPresistModel.getVatId() != null) {
			trnx.setVatCategory(vatCategoryService.findByPK(transactionPresistModel.getVatId()));
		}
		if (transactionPresistModel.getVendorId() != null) {
			trnx.setExplinationVendor((contactService.findByPK(transactionPresistModel.getVendorId())));
		}

		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment( transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}
	private void updateTransactionForCustomerInvoices(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		trnx.setDebitCreditFlag('C');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
		if (transactionPresistModel.getVatId() != null) {
			trnx.setVatCategory(vatCategoryService.findByPK(transactionPresistModel.getVatId()));
		}
		if (transactionPresistModel.getCustomerId() != null) {
			trnx.setExplinationVendor((contactService.findByPK(transactionPresistModel.getCustomerId())));
		}

		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment( transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}
	private Transaction updateTransactionWithCommonFields(TransactionPresistModel transactionPresistModel,int userId,TransactionCreationMode mode) {
		Transaction trnx = null;
		if(transactionPresistModel.getTransactionId()!=null) {
			trnx = transactionService.findByPK(transactionPresistModel.getTransactionId());
		}
		else{
			trnx = new Transaction();
		}

		trnx.setLastUpdateBy(userId);
		//GrandFather daddu dadaji
		trnx.setCoaCategory(chartOfAccountCategoryService.findByPK(transactionPresistModel.getCoaCategoryId()));
		trnx.setTransactionAmount(transactionPresistModel.getAmount());
		trnx.setCreationMode(mode);
		trnx.setTransactionExplinationStatusEnum(TransactionExplinationStatusEnum.FULL);
		trnx.setTransactionDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
				transactionPresistModel.getDATE_FORMAT()));

		if(transactionPresistModel.getTransactionCategoryId()!=null) {
			//Pota Grandchild
			TransactionCategory transactionCategory = transactionCategoryService.findByPK(transactionPresistModel.getTransactionCategoryId());
			trnx.setExplainedTransactionCategory(transactionCategory);
		}
		return trnx;
	}
	/*
	 * This method will update the transaction for Money paid to user.
	 * Fields to update
	 * 1. Desc
	 * 2.
	 */
	private void updateTransactionMoneyPaidToUser(Transaction trnx, TransactionPresistModel transactionPresistModel)
	{
		trnx.setDebitCreditFlag('D');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getEmployeeId() != null) {
			trnx.setExplainationUser(userService.findByPK(transactionPresistModel.getEmployeeId()));
		}
		if (transactionPresistModel.getUserId() != null) {
			trnx.setExplainationUser(userService.findByPK(transactionPresistModel.getUserId()));
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment(transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}

	private String saveFileAttachment( MultipartFile attachmentFile, FileTypeEnum fileTypeEnum) {
		try{
			return fileHelper.saveFile(attachmentFile,
					fileTypeEnum);
		}catch (IOException e){
			logger.error("Error saving file attachment");
		}
		return null;
	}

	@ApiOperation(value = "Delete Transaction By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity<String> deleteTransaction(@RequestParam(value = "id") Integer id) {
		Transaction trnx = transactionService.findByPK(id);
		if (trnx != null) {
			trnx.setDeleteFlag(Boolean.TRUE);
			transactionService.deleteTransaction(trnx);
		}
		return new ResponseEntity<>("Deleted successful", HttpStatus.OK);

	}

	@ApiOperation(value = "Delete Transaction in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity<String> deleteTransactions(@RequestBody DeleteModel ids) {
		try {
			transactionService.deleteByIds(ids.getIds());
			return new ResponseEntity<>("Deleted successfull", HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Transaction By ID")
	@GetMapping(value = "/getById")
	public ResponseEntity<TransactionPresistModel> getInvoiceById(@RequestParam(value = "id") Integer id) {
		Transaction trnx = transactionService.findByPK(id);
		if (trnx == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(transactionHelper.getModel(trnx), HttpStatus.OK);
		}
	}

	@GetMapping(value = "/getCashFlow")
	public ResponseEntity<Object> getCashFlow(@RequestParam int monthNo) {
		try {
			Object obj = chartUtil.getCashFlow(transactionService.getCashInData(monthNo, null),
					transactionService.getCashOutData(monthNo, null));
			return new ResponseEntity<>(obj, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

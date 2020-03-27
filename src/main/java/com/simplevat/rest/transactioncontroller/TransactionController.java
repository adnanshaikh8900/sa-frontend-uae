/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.FileTypeEnum;
import com.simplevat.constant.ReconsileCategoriesEnumConstant;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.TransactionFilterEnum;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Journal;
import com.simplevat.entity.bankaccount.ReconcileCategory;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.helper.TransactionHelper;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.JournalService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.util.ChartUtil;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.FileHelper;

import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
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

/**
 *
 * @author sonu
 */
@RestController
@RequestMapping(value = "/rest/transaction")
public class TransactionController implements Serializable {

	@Autowired
	JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private TransactionStatusService transactionStatusService;

	@Autowired
	private ChartOfAccountService chartOfAccountService;

	@Autowired
	private TransactionHelper transactionHelper;

	@Autowired
	private JournalService journalService;

	@Autowired
	private FileHelper fileHelper;

	@Autowired
	private ChartUtil chartUtil;

	@ApiOperation(value = "Get Transaction List")
	@GetMapping(value = "/list")
	public ResponseEntity getAllTransaction(TransactionRequestFilterModel filterModel) {

		Map<TransactionFilterEnum, Object> dataMap = new HashMap<TransactionFilterEnum, Object>();

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
				e.printStackTrace();
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
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Transaction transaction = transactionHelper.getEntity(transactionPresistModel);
			if (transactionPresistModel.getAttachment() != null && !transactionPresistModel.getAttachment().isEmpty()) {
				String fileName = fileHelper.saveFile(transactionPresistModel.getAttachment(), FileTypeEnum.TRANSATION);
				transaction.setExplainedTransactionAttachmentFileName(
						transactionPresistModel.getAttachment().getOriginalFilename());
				transaction.setExplainedTransactionAttachmentPath(fileName);
			}
			transaction.setCreatedBy(userId);
			transaction.setCreatedDate(LocalDateTime.now());
			transactionService.persist(transaction);
			if (transaction.getTransactionId() == null) {

				return new ResponseEntity<>("Unable To Save", HttpStatus.OK);
			} else {
				// save journal
				Journal journal = transactionHelper.getByTransaction(transaction);
				journalService.persist(journal);
			}
			return new ResponseEntity<>(transaction.getTransactionId(), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "update Transaction", response = Transaction.class)
	@PostMapping(value = "/update")
	public ResponseEntity updateTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Transaction transaction = transactionHelper.getEntity(transactionPresistModel);
			if (transactionPresistModel.getAttachment() != null && !transactionPresistModel.getAttachment().isEmpty()) {
				String fileName = fileHelper.saveFile(transactionPresistModel.getAttachment(), FileTypeEnum.TRANSATION);
				transaction.setExplainedTransactionAttachmentFileName(
						transactionPresistModel.getAttachment().getOriginalFilename());
				transaction.setExplainedTransactionAttachmentPath(fileName);
			}
			transaction.setLastUpdateBy(userId);
			transaction.setLastUpdateDate(LocalDateTime.now());
			transactionService.persist(transaction);
			if (transaction.getTransactionId() == null) {
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
			return new ResponseEntity<>(transaction.getTransactionId(), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Delete Transaction By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deleteTransaction(@RequestParam(value = "id") Integer id) {
		Transaction trnx = transactionService.findByPK(id);
		if (trnx != null) {
			trnx.setDeleteFlag(Boolean.TRUE);
			transactionService.update(trnx, trnx.getTransactionId());
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
			e.printStackTrace();
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

//    @ApiOperation(value = "Update Bank Account", response = BankAccount.class)
//    @PutMapping("/{bankAccountId}")
//    public ResponseEntity updateBankAccount(@PathVariable("bankAccountId") Integer bankAccountId, BankModel bankModel, HttpServletRequest request) {
//        try {
//            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
//            bankModel.setBankAccountId(bankAccountId);
//            BankAccount bankAccount = BankHelper.getBankAccountByBankAccountModel(bankModel, bankAccountService, bankAccountStatusService, currencyService, bankAccountTypeService, countryService);
//            User user = userServiceNew.findByPK(userId);
//            bankAccount.setBankAccountId(bankModel.getBankAccountId());
//            bankAccount.setLastUpdateDate(LocalDateTime.now());
//            bankAccount.setLastUpdatedBy(user.getUserId());
//            bankAccountService.update(bankAccount);
//            return new ResponseEntity<>(HttpStatus.OK);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//    }

	@GetMapping(value = "/getCashFlow")
	public ResponseEntity getCashFlow(@RequestParam int monthNo) {
		try {
			Object obj = chartUtil.getCashFlow(transactionService.getCashInData(monthNo, null),
					transactionService.getCashOutData(monthNo, null));
			return new ResponseEntity<>(obj, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

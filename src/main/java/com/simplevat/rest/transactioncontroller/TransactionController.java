/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.constant.dbfilter.TransactionFilterEnum;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.helper.TransactionHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.service.bankaccount.TransactionTypeService;
import com.simplevat.utils.DateFormatUtil;

import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
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
	private TransactionTypeService transactionTypeService;

	@Autowired
	private TransactionHelper transactionHelper;

	@ApiOperation(value = "Get Transaction List")
	@GetMapping(value = "/list")
	public ResponseEntity getAllTransaction(TransactionRequestFilterModel filterModel) {

		Map<TransactionFilterEnum, Object> dataMap = new HashMap<TransactionFilterEnum, Object>();

		if (filterModel.getBankId() != null) {
			dataMap.put(TransactionFilterEnum.BANK_ID, bankAccountService.findByPK(filterModel.getBankId()));
		}
		if (filterModel.getTransactionDate() != null) {
			LocalDateTime date = Instant.ofEpochMilli(filterModel.getTransactionDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			dataMap.put(TransactionFilterEnum.TRANSACTION_DATE, date);
		}
		if (filterModel.getTransactionStatusCode() != null) {
			dataMap.put(TransactionFilterEnum.TRANSACTION_STATUS,
					transactionStatusService.findByPK(filterModel.getTransactionStatusCode()));
		}
		if (filterModel.getTransactionTypeCode() != null) {
			dataMap.put(TransactionFilterEnum.TRANSACTION_TYPE,
					transactionTypeService.findByPK(filterModel.getTransactionTypeCode()));
		}
		
		List<Transaction> trasactionList = transactionService.getAllTransactionList(dataMap);
		if (trasactionList == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity(transactionHelper.getModelList(trasactionList), HttpStatus.OK);
	}

	@ApiOperation(value = "Add New Transaction", response = Transaction.class)
	@PostMapping(value = "/save")
	public ResponseEntity saveTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Transaction transaction = transactionHelper.getEntity(transactionPresistModel);
			transaction.setCreatedBy(userId);
			transaction.setCreatedDate(LocalDateTime.now());
			transactionService.persist(transaction);
			if (transaction.getTransactionId() == null) {
				return new ResponseEntity<>("Unable To Save", HttpStatus.OK);
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
			transaction.setLastUpdateBy(userId);
			transaction.setLastUpdateDate(LocalDateTime.now());
			transactionService.persist(transaction);
			if (transaction.getTransactionId() == null) {
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//				return new ResponseEntity<>("Unable To Update", HttpStatus.OK);
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
}

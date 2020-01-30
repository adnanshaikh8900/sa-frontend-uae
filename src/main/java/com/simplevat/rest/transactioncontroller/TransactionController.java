/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.helper.TransactionHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.utils.DateFormatUtil;

import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	private TransactionHelper transactionHelper;

	@ApiOperation(value = "Get Transaction List")
	@GetMapping(value = "/gettransactions")
	public ResponseEntity getAllTransaction() {
		List<Transaction> trasactionList = transactionService.getAllTransactions();

		if (trasactionList != null && trasactionList.size() > 0) {
			return new ResponseEntity(transactionHelper.getModelList(trasactionList), HttpStatus.OK);
		}

		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

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

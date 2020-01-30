/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.entity.Project;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.rest.transactioncontroller.TransactionPresistModel;
import com.simplevat.rest.transactioncontroller.TransactionViewModel;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.bankaccount.TransactionTypeService;
import com.simplevat.utils.DateFormatUtil;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Uday
 */
@Service
public class TransactionHelper {

	@Autowired
	private TransactionTypeService transactionTypeService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private ProjectService projectService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private DateFormatUtil dateUtil;

	public Transaction getEntity(TransactionPresistModel transactionModel) {
		Transaction transaction = new Transaction();
		if (transactionModel.getBankAccountId() != null) {
			BankAccount bankAccount = bankAccountService.getBankAccountById(transactionModel.getBankAccountId());
			bankAccount.setBankAccountId(transactionModel.getBankAccountId());
			transaction.setBankAccount(bankAccount);
		}
		if (transactionModel.getTransactionTypeCode() != null) {
			TransactionType transactionType = transactionTypeService
					.getTransactionType(transactionModel.getTransactionTypeCode());
			transactionType.setTransactionTypeCode(transactionModel.getTransactionTypeCode());
			transaction.setTransactionType(transactionType);
			transaction.setDebitCreditFlag(transactionType.getDebitCreditFlag());
		}

		if (transactionModel.getTransactionDate() != null) {
			LocalDateTime trnxDate = Instant.ofEpochMilli(transactionModel.getTransactionDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			transaction.setTransactionDate(trnxDate);
		}
		if (transactionModel.getTransactionCategoryId() != null) {
			TransactionCategory transactionCategory = transactionCategoryService
					.findByPK(transactionModel.getTransactionCategoryId());
			transaction.setExplainedTransactionCategory(transactionCategory);
		}
		transaction.setTransactionDescription(transactionModel.getTransactionDescription());
		if (transactionModel.getProjectId() != null) {
			Project project = projectService.findByPK(transactionModel.getProjectId());
			transaction.setProject(project);
		}
		transaction.setTransactionAmount(transactionModel.getTransactionAmount());
		transaction.setReceiptNumber(transactionModel.getReceiptNumber());
		transaction.setExplainedTransactionAttachementDescription(transactionModel.getAttachementDescription());
		if (transactionModel.getAttachment() != null) {
			try {
				transaction.setExplainedTransactionAttachement(transactionModel.getAttachment().getBytes());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return transaction;
	}

	public List<TransactionViewModel> getModelList(List<Transaction> trasactionList) {

		List<TransactionViewModel> transactionModelList = new ArrayList<TransactionViewModel>();
		if (trasactionList != null) {
			for (Transaction transaction : trasactionList) {
				TransactionViewModel transactionModel = new TransactionViewModel();

				transactionModel.setId(transaction.getTransactionId());
				transactionModel.setTransactionDate(transaction.getTransactionDate() != null
						? dateUtil.getDateAsString(transaction.getTransactionDate(), "dd-MM-yyyy")
						: "-");
				transactionModel.setReferenceNo(transaction.getReceiptNumber());
				transactionModel.setRunningAmount(
						transaction.getCurrentBalance() != null ? transaction.getCurrentBalance().doubleValue() : 0.0);

				if (transaction.getDebitCreditFlag().equals('D')) {
					transactionModel.setWithdrawalAmount(transaction.getTransactionAmount() != null
							? transaction.getTransactionAmount().doubleValue()
							: 0.0);
					transactionModel.setDepositeAmount(0.0);
				} else {
					transactionModel.setDepositeAmount(transaction.getTransactionAmount() != null
							? transaction.getTransactionAmount().doubleValue()
							: 0.0);
					transactionModel.setWithdrawalAmount(0.0);
				}
				transactionModelList.add(transactionModel);
			}
		}
		return transactionModelList;
	}

}

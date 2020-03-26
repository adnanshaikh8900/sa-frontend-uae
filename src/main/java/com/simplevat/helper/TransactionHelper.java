/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.constant.ChartOfAccountConstant;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.Project;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.rest.transactioncontroller.TransactionPresistModel;
import com.simplevat.rest.transactioncontroller.TransactionViewModel;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.FileHelper;

import java.math.BigDecimal;
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
	private ChartOfAccountService chartOfAccountService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private ProjectService projectService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private DateFormatUtil dateUtil;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	private FileHelper fileHelper;

	public Transaction getEntity(TransactionPresistModel transactionModel) {
		Transaction transaction = new Transaction();

		if (transactionModel.getId() != null) {
			transaction = transactionService.findByPK(transactionModel.getId());
		}

		BigDecimal currentBal = BigDecimal.valueOf(0);

		if (transactionModel.getBankAccountId() != null) {
			BankAccount bankAccount = bankAccountService.getBankAccountById(transactionModel.getBankAccountId());
			bankAccount.setBankAccountId(transactionModel.getBankAccountId());
			transaction.setBankAccount(bankAccount);
			currentBal = bankAccount.getCurrentBalance();
		}

		if (transactionModel.getChartOfAccountId() != null) {
			ChartOfAccount chartOfAccount = chartOfAccountService
					.getChartOfAccount(transactionModel.getChartOfAccountId());
			chartOfAccount.setChartOfAccountId(transactionModel.getChartOfAccountId());
			transaction.setChartOfAccount(chartOfAccount);
			transaction.setDebitCreditFlag(chartOfAccount.getDebitCreditFlag());

			boolean isdebitFromBank = chartOfAccount.getChartOfAccountId().equals(ChartOfAccountConstant.MONEY_IN)
					|| (chartOfAccount.getParentChartOfAccount() != null
							&& chartOfAccount.getParentChartOfAccount().getChartOfAccountId() != null
							&& chartOfAccount.getParentChartOfAccount().getChartOfAccountId()
									.equals(ChartOfAccountConstant.MONEY_IN)) ? true : false;

			transaction.setCurrentBalance(isdebitFromBank ? currentBal.subtract(transactionModel.getTransactionAmount())
					: currentBal.add(transactionModel.getTransactionAmount()));
			transaction.getBankAccount().setCurrentBalance(currentBal);
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

		return transaction;
	}

	public List<TransactionViewModel> getModelList(Object trasactionList) {

		List<TransactionViewModel> transactionModelList = new ArrayList<TransactionViewModel>();
		if (trasactionList != null) {
			for (Transaction transaction : (List<Transaction>) trasactionList) {
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
				transactionModel.setTransactionTypeName(transaction.getChartOfAccount() != null
						? transaction.getChartOfAccount().getChartOfAccountName()
						: "-");
				transactionModel.setDebitCreditFlag(transaction.getDebitCreditFlag());
				transactionModelList.add(transactionModel);
			}
		}
		return transactionModelList;
	}

	public TransactionPresistModel getModel(Transaction transaction) {
		TransactionPresistModel transactionModel = new TransactionPresistModel();
		if (transaction.getBankAccount() != null) {
			transactionModel.setBankAccountId(transaction.getBankAccount().getBankAccountId());
		}
		if (transaction.getChartOfAccount() != null) {
			transactionModel.setChartOfAccountId(transaction.getChartOfAccount().getChartOfAccountId());
			// transactionModel.set(transaction.getTransactionType().getDebitCreditFlag());
		}

		if (transaction.getTransactionDate() != null) {
			Date trnxDate = Date.from(transaction.getTransactionDate().atZone(ZoneId.systemDefault()).toInstant());
			transactionModel.setTransactionDate(trnxDate);
		}

		if (transaction.getExplainedTransactionCategory() != null) {
			transactionModel
					.setTransactionCategoryId(transaction.getExplainedTransactionCategory().getTransactionCategoryId());
		}

		transactionModel.setTransactionDescription(transaction.getTransactionDescription());

		if (transaction.getProject() != null) {
			transactionModel.setProjectId(transaction.getProject().getProjectId());
		}
		transactionModel.setTransactionAmount(transaction.getTransactionAmount());
		transactionModel.setReceiptNumber(transaction.getReceiptNumber());
		transactionModel.setAttachementDescription(transaction.getExplainedTransactionAttachementDescription());
		if (transaction.getExplainedTransactionAttachmentPath() != null) {
			transactionModel.setReceiptAttachmentPath(
					"/file/" + fileHelper.convertFilePthToUrl(transaction.getExplainedTransactionAttachmentPath()));
		}
		transactionModel.setReceiptAttachmentFileName(transaction.getExplainedTransactionAttachmentFileName());

		return transactionModel;
	}

	public Journal getByTransaction(Transaction transaction) {
		List<JournalLineItem> journalLineItemList = new ArrayList();

		ChartOfAccount transactionType = transaction.getChartOfAccount();

		boolean isdebitFromBank = transactionType.getChartOfAccountId().equals(ChartOfAccountConstant.MONEY_IN)
				|| (transactionType.getParentChartOfAccount() != null
						&& transactionType.getParentChartOfAccount().getChartOfAccountId() != null
						&& transactionType.getParentChartOfAccount().getChartOfAccountId()
								.equals(ChartOfAccountConstant.MONEY_IN)) ? true : false;

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		journalLineItem1.setTransactionCategory(transaction.getExplainedTransactionCategory());
		if (!isdebitFromBank) {
			journalLineItem1.setDebitAmount(transaction.getTransactionAmount());
		} else {
			journalLineItem1.setCreditAmount(transaction.getTransactionAmount());
		}
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
		journalLineItem1.setReferenceId(transaction.getTransactionId());
		journalLineItem1.setCreatedBy(transaction.getCreatedBy());
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(transaction.getBankAccount().getTransactionCategory());
		if (isdebitFromBank) {
			journalLineItem2.setDebitAmount(transaction.getTransactionAmount());
		} else {
			journalLineItem2.setCreditAmount(transaction.getTransactionAmount());
		}
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
		journalLineItem2.setReferenceId(transaction.getTransactionId());
		journalLineItem2.setCreatedBy(transaction.getCreatedBy());
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(transaction.getCreatedBy());
		journal.setPostingReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
		journal.setJournalDate(LocalDateTime.now());
		return journal;

	}
}

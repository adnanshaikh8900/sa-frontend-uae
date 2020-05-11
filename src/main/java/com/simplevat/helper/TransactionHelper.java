/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.constant.ChartOfAccountCategoryIdEnumConstant;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionStatus;
import com.simplevat.rest.ReconsileRequestLineItemModel;
import com.simplevat.rest.transactioncontroller.TransactionPresistModel;
import com.simplevat.rest.transactioncontroller.TransactionViewModel;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.FileHelper;

import java.util.ArrayList;
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

	@Autowired
	private TransactionStatusService transactionStatusService;

//	public Transaction getEntity(TransactionPresistModel transactionModel) {
//		Transaction transaction = new Transaction();
//
//		if (transactionModel.getId() != null) {
//			transaction = transactionService.findByPK(transactionModel.getId());
//		}
//
//		BigDecimal currentBal = BigDecimal.valueOf(0);
//
//		if (transactionModel.getBankAccountId() != null) {
//			BankAccount bankAccount = bankAccountService.getBankAccountById(transactionModel.getBankAccountId());
//			bankAccount.setBankAccountId(transactionModel.getBankAccountId());
//			transaction.setBankAccount(bankAccount);
//			currentBal = bankAccount.getCurrentBalance();
//		}
//
//		if (transactionModel.getChartOfAccountId() != null) {
//			ChartOfAccount chartOfAccount = chartOfAccountService
//					.getChartOfAccount(transactionModel.getChartOfAccountId());
//			chartOfAccount.setChartOfAccountId(transactionModel.getChartOfAccountId());
//			transaction.setChartOfAccount(chartOfAccount);
//			transaction.setDebitCreditFlag(chartOfAccount.getDebitCreditFlag());
//
//			boolean isdebitFromBank = chartOfAccount.getChartOfAccountId().equals(ChartOfAccountConstant.MONEY_IN)
//					|| (chartOfAccount.getParentChartOfAccount() != null
//							&& chartOfAccount.getParentChartOfAccount().getChartOfAccountId() != null
//							&& chartOfAccount.getParentChartOfAccount().getChartOfAccountId()
//									.equals(ChartOfAccountConstant.MONEY_IN)) ? Boolean.TRUE : Boolean.FALSE;
//
//			transaction.setCurrentBalance(isdebitFromBank ? currentBal.subtract(transactionModel.getTransactionAmount())
//					: currentBal.add(transactionModel.getTransactionAmount()));
//			transaction.getBankAccount().setCurrentBalance(currentBal);
//		}
//
//		if (transactionModel.getTransactionDate() != null) {
//			LocalDateTime trnxDate = Instant.ofEpochMilli(transactionModel.getTransactionDate().getTime())
//					.atZone(ZoneId.systemDefault()).toLocalDateTime();
//			transaction.setTransactionDate(trnxDate);
//		}
//		if (transactionModel.getTransactionCategoryId() != null) {
//			TransactionCategory transactionCategory = transactionCategoryService
//					.findByPK(transactionModel.getTransactionCategoryId());
//			transaction.setExplainedTransactionCategory(transactionCategory);
//		}
//		transaction.setTransactionDescription(transactionModel.getTransactionDescription());
//		if (transactionModel.getProjectId() != null) {
//			Project project = projectService.findByPK(transactionModel.getProjectId());
//			transaction.setProject(project);
//		}
//		transaction.setTransactionAmount(transactionModel.getTransactionAmount());
//		transaction.setReceiptNumber(transactionModel.getReceiptNumber());
//		transaction.setExplainedTransactionAttachementDescription(transactionModel.getAttachementDescription());
//		transaction.setCreationMode(TransactionCreationMode.MANUAL);
//		return transaction;
//	}


	public List<TransactionViewModel> getModelList(Object trasactionList) {

		List<TransactionViewModel> transactionModelList = new ArrayList<>();
		for (Transaction transaction : (List<Transaction>) trasactionList) {
			TransactionViewModel transactionModel = new TransactionViewModel();

			transactionModel.setId(transaction.getTransactionId());
			transactionModel.setTransactionDate(transaction.getTransactionDate() != null
					? dateUtil.getLocalDateTimeAsString(transaction.getTransactionDate(), "dd-MM-yyyy")
					: "-");
			transactionModel.setReferenceNo(transaction.getReceiptNumber());
			transactionModel.setRunningAmount(
					transaction.getCurrentBalance() != null ? transaction.getCurrentBalance().doubleValue() : 0.0);

			if (transaction.getDebitCreditFlag().equals('D')) {
				transactionModel.setWithdrawalAmount(
						transaction.getTransactionAmount() != null ? transaction.getTransactionAmount().doubleValue()
								: 0.0);
				transactionModel.setDepositeAmount(0.0);
			} else {
				transactionModel.setDepositeAmount(
						transaction.getTransactionAmount() != null ? transaction.getTransactionAmount().doubleValue()
								: 0.0);
				transactionModel.setWithdrawalAmount(0.0);
			}
			transactionModel.setTransactionTypeName(
					transaction.getChartOfAccount() != null ? transaction.getChartOfAccount().getChartOfAccountName()
							: "-");
			transactionModel.setDebitCreditFlag(transaction.getDebitCreditFlag());
			transactionModel.setDescription(transaction.getExplainedTransactionDescription());
			transactionModel.setExplinationStatusEnum(transaction.getTransactionExplinationStatusEnum());
			transactionModelList.add(transactionModel);
		}

		return transactionModelList;
	}

	public TransactionPresistModel getModel(Transaction transaction) {

		TransactionPresistModel model = new TransactionPresistModel();
		model.setTransactionId(transaction.getTransactionId());
		if (transaction.getCoaCategory() != null)
			model.setCoaCategoryId(transaction.getCoaCategory().getChartOfAccountCategoryId());
		if (transaction.getExplainedTransactionCategory() != null)
			model.setTransactionCategoryId(transaction.getExplainedTransactionCategory().getTransactionCategoryId());
		model.setAmount(transaction.getTransactionAmount());
		if (transaction.getTransactionDate() != null)
			model.setDate(dateUtil.getLocalDateTimeAsString(transaction.getTransactionDate(), model.getDATE_FORMAT()));
		model.setDescription(transaction.getExplainedTransactionDescription());
		// TODO : work on attachement
		model.setReference(transaction.getReferenceStr());

		// EXPENSE
		if (transaction.getVatCategory() != null)
			model.setVatId(transaction.getVatCategory().getId());
		if (transaction.getExplinationVendor() != null)
			model.setVendorId(transaction.getExplinationVendor().getContactId());
		if (transaction.getExplinationCustomer() != null)
			model.setVendorId(transaction.getExplinationCustomer().getContactId());

		// MONEY PAID TO USER
		// MONEY RECEIVED FROM OTHER
		if (transaction.getExplinationEmployee() != null)
			model.setVendorId(transaction.getExplinationEmployee().getId());

		// Transafer To
		if (transaction.getExplinationEmployee() != null)
			model.setVendorId(transaction.getBankAccount().getBankAccountId());
		if (transaction.getCoaCategory() != null && transaction.getCoaCategory().getChartOfAccountCategoryId()
				.equals(ChartOfAccountCategoryIdEnumConstant.SALES.id)) {
			// SALES
			List<ReconsileRequestLineItemModel> invoiceIdList = new ArrayList<>();
			List<TransactionStatus> trnxStatusList = transactionStatusService
					.findAllTransactionStatuesByTrnxId(transaction.getTransactionId());

			for (TransactionStatus status : trnxStatusList) {
				invoiceIdList.add(new ReconsileRequestLineItemModel(
						status.getReconsileJournal().getJournalLineItems().stream().findFirst().get().getReferenceId(),
						status.getRemainingToExplain()));
			}
			model.setInvoiceIdList(invoiceIdList);
		}
		model.setExplinationStatusEnum(transaction.getTransactionExplinationStatusEnum());

		return model;
	}
}

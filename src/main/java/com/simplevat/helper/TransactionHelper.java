/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.constant.ChartOfAccountCategoryIdEnumConstant;
import com.simplevat.constant.PayMode;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.entity.*;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.ReconsileRequestLineItemModel;
import com.simplevat.rest.transactioncontroller.TransactionPresistModel;
import com.simplevat.rest.transactioncontroller.TransactionViewModel;
import com.simplevat.service.ContactService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.TransactionExpensesService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.utils.DateFormatUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Uday
 */
@Service
public class TransactionHelper {

	@Autowired
	private DateFormatUtil dateUtil;

	@Autowired
	private TransactionStatusService transactionStatusService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private TransactionExpensesService transactionExpensesService;

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

			debitcreditflag(transaction, transactionModel);
			transactionModel.setTransactionTypeName(
					transaction.getChartOfAccount() != null ? transaction.getChartOfAccount().getChartOfAccountName()
							: "-");
			transactionModel.setDebitCreditFlag(transaction.getDebitCreditFlag());
			transactionModel.setDescription(transaction.getTransactionDescription());
			transactionModel.setExplinationStatusEnum(transaction.getTransactionExplinationStatusEnum());
			transactionModel.setCreationMode(transaction.getCreationMode());
			transactionModelList.add(transactionModel);
		}

		return transactionModelList;
	}

	private void debitcreditflag(Transaction transaction, TransactionViewModel transactionModel) {
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
	}

	public TransactionPresistModel getModel(Transaction transaction) {

		TransactionPresistModel model = new TransactionPresistModel();
		model.setBankId(transaction.getBankAccount().getBankAccountId());
		model.setTransactionId(transaction.getTransactionId());
		model.setDescription(transaction.getExplainedTransactionDescription());
		if (transaction.getExplainedTransactionCategory() != null)
			model.setExpenseCategory(transaction.getExplainedTransactionCategory().getTransactionCategoryId());
        if(transaction.getExplainationUser()!=null)
        	model.setEmployeeId(transaction.getExplainationUser().getUserId());
		if (transaction.getCoaCategory() != null)
			model.setCoaCategoryId(transaction.getCoaCategory().getChartOfAccountCategoryId());
		if (transaction.getExplainedTransactionCategory() != null) {
			if(transaction.getExplainedTransactionCategory().getChartOfAccount()
					.getChartOfAccountCode().equalsIgnoreCase(ChartOfAccountCategoryCodeEnum.BANK.getCode()))
			{
				model.setTransactionCategoryLabel(
						transaction.getExplainedTransactionCategory().getChartOfAccount().getChartOfAccountName());
				String description = transaction.getExplainedTransactionDescription();
				model.setTransactionCategoryId(Integer.parseInt(description.substring(description.indexOf("=")+1,description.length())));
				description = description.substring(0,description.indexOf(":"));
				model.setDescription(description);
				model.setExpenseCategory(null);
			}
			else {
				model.setTransactionCategoryLabel(
						transaction.getExplainedTransactionCategory().getChartOfAccount().getChartOfAccountName());
				model.setTransactionCategoryId(transaction.getExplainedTransactionCategory().getTransactionCategoryId());
			}
		}
		model.setAmount(transaction.getTransactionAmount());
		if (transaction.getTransactionDate() != null)
			model.setDate(dateUtil.getLocalDateTimeAsString(transaction.getTransactionDate(), model.getDATE_FORMAT()));
		model.setCurrencyCode(transaction.getBankAccount().getBankAccountCurrency().getCurrencyCode());
		model.setReference(transaction.getReferenceStr());


		// EXPENSE
		if (transaction.getVatCategory() != null)
			model.setVatId(transaction.getVatCategory().getId());
		if (transaction.getExplinationVendor() != null)
			model.setVendorId(transaction.getExplinationVendor().getContactId());
		if (transaction.getExplinationCustomer() != null)
			model.setCustomerId(transaction.getExplinationCustomer().getContactId());



		// MONEY PAID TO USER
		// MONEY RECEIVED FROM OTHER
		if (transaction.getExplinationEmployee() != null)
			model.setVendorId(transaction.getExplinationEmployee().getId());

		// Transafer To
		if (transaction.getExplinationEmployee() != null)
			model.setEmployeeId(transaction.getExplinationEmployee().getId());
		if (transaction.getCoaCategory() != null) {
			List<ReconsileRequestLineItemModel> explainParamList = new ArrayList<>();
			if (transaction.getCoaCategory().getChartOfAccountCategoryId()
					.equals(ChartOfAccountCategoryIdEnumConstant.SALES.getId())) {
				// CUTOMER INVOICES
				List<TransactionStatus> trnxStatusList = transactionStatusService
						.findAllTransactionStatuesByTrnxId(transaction.getTransactionId());

				for (TransactionStatus status : trnxStatusList) {
					explainParamList.add(new ReconsileRequestLineItemModel(status.getInvoice().getId(),
							status.getRemainingToExplain(), PostingReferenceTypeEnum.INVOICE));
				}
			} else {
				// VENDOR INVOICES
				List<TransactionStatus> trnxStatusList = transactionStatusService
						.findAllTransactionStatuesByTrnxId(transaction.getTransactionId());

				for (TransactionStatus status : trnxStatusList) {
					explainParamList.add(new ReconsileRequestLineItemModel(status.getInvoice().getId(),
							status.getRemainingToExplain(), PostingReferenceTypeEnum.INVOICE));
				}

//				List<TransactionExpenses> mappedExpenseList = transactionExpensesService
//						.findAllForTransactionExpenses(transaction.getTransactionId());
//				for (TransactionExpenses expense : mappedExpenseList) {
//					explainParamList.add(new ReconsileRequestLineItemModel(expense.getExpense().getExpenseId(),
//							expense.getRemainingToExplain(), PostingReferenceTypeEnum.EXPENSE));
//				}
			}

			model.setExplainParamList(explainParamList);
		}
		model.setExplinationStatusEnum(transaction.getTransactionExplinationStatusEnum());

		return model;
	}

	public Receipt getReceiptEntity(Contact contact, BigDecimal totalAmt,
			TransactionCategory depositeToTransationCategory) {
		Receipt receipt = new Receipt();
		receipt.setContact(contact);
		receipt.setAmount(totalAmt);
		// receipt.setNotes(receiptRequestModel.getNotes());
		receipt.setReceiptNo("1");
		// receipt.setReferenceCode(receiptRequestModel.getReferenceCode());
		receipt.setReceiptDate(LocalDateTime.now());
		receipt.setPayMode(PayMode.BANK);
		receipt.setDepositeToTransactionCategory(
				// bank transacton category id
				depositeToTransationCategory);
		return receipt;
	}

	public Payment getPaymentEntity(Contact contact, BigDecimal totalAmt, TransactionCategory transactionCategory,
			Invoice invoice) {
		Payment payment = new Payment();
		payment.setSupplier(contact);
		payment.setInvoiceAmount(totalAmt);
		payment.setCurrency(invoice.getCurrency());
		payment.setDepositeToTransactionCategory(transactionCategory);
		payment.setPaymentDate(LocalDateTime.now());
		return payment;
	}

}

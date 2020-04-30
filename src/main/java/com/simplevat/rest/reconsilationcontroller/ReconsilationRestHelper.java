package com.simplevat.rest.reconsilationcontroller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.ChartOfAccountConstant;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.ReconsileCategoriesEnumConstant;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.Expense;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.TransactionCategoryService;

@Component
public class ReconsilationRestHelper {

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	public List<ReconsilationListModel> getList(ReconsileCategoriesEnumConstant constant) {
		Map<String, Object> attribute = new HashMap<String, Object>();

		attribute.put("deleteFlag", Boolean.FALSE);

		List<ReconsilationListModel> modelList = new ArrayList<ReconsilationListModel>();
		switch (constant) {
		case EXPENSE:
			List<Expense> expenseList = expenseService.findByAttributes(attribute);
			for (Expense expense : expenseList) {
				modelList.add(new ReconsilationListModel(expense.getExpenseId(), expense.getExpenseDate().toString(),
						expense.getPayee(), expense.getExpenseAmount(),
						expense.getCurrency() != null ? expense.getCurrency().getCurrencySymbol() : ""));
			}
			break;

		case SUPPLIER_INVOICE:

			attribute.put("type", 1);
			List<Invoice> invoices = invoiceService.findByAttributes(attribute);
			for (Invoice invoice : invoices) {
				modelList.add(new ReconsilationListModel(invoice.getId(), invoice.getInvoiceDate().toString(),
						invoice.getReferenceNumber(), invoice.getTotalAmount(), invoice.getInvoiceDueDate().toString(),
						invoice.getCurrency() != null ? invoice.getCurrency().getCurrencySymbol() : ""));
			}
			break;

		default:
			break;
		}
		return modelList;
	}

	private Journal getByTransactionType(Integer transactionCategoryCode, BigDecimal amount, int userId,
			Transaction transaction) {
		List<JournalLineItem> journalLineItemList = new ArrayList();

		TransactionCategory transactionCategory = transactionCategoryService.findByPK(transactionCategoryCode);

		ChartOfAccount transactionType = transactionCategory.getChartOfAccount();

		boolean isdebitFromBank = transactionType.getChartOfAccountId().equals(ChartOfAccountConstant.MONEY_IN)
				|| (transactionType.getParentChartOfAccount() != null
						&& transactionType.getParentChartOfAccount().getChartOfAccountId() != null
						&& transactionType.getParentChartOfAccount().getChartOfAccountId()
								.equals(ChartOfAccountConstant.MONEY_IN)) ? Boolean.TRUE : Boolean.FALSE;

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		journalLineItem1.setTransactionCategory(transaction.getExplainedTransactionCategory());
		if (!isdebitFromBank) {
			journalLineItem1.setDebitAmount(amount);
		} else {
			journalLineItem1.setCreditAmount(amount);
		}
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_REMAIN);
		journalLineItem1.setReferenceId(transaction.getTransactionId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(transaction.getBankAccount().getTransactionCategory());
		if (isdebitFromBank) {
			journalLineItem2.setDebitAmount(transaction.getTransactionAmount());
		} else {
			journalLineItem2.setCreditAmount(transaction.getTransactionAmount());
		}
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_REMAIN);
		journalLineItem2.setReferenceId(transaction.getTransactionId());
		journalLineItem2.setCreatedBy(transaction.getCreatedBy());
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(transaction.getCreatedBy());
		journal.setPostingReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_REMAIN);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

//	private Journal invoiceReconsile(ReconsileLineItemModel reconsileLineItemModel, Integer userId) {
//		List<JournalLineItem> journalLineItemList = new ArrayList<>();
//
//		Invoice invoice = invoiceService.findByPK(reconsileLineItemModel.getReconcileRrefId());
//
//		Journal journal = new Journal();
//		JournalLineItem journalLineItem1 = new JournalLineItem();
//		TransactionCategory transactionCategory = transactionCategoryService
//				.findTransactionCategoryByTransactionCategoryCode(
//						TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
//		journalLineItem1.setTransactionCategory(transactionCategory);
//		journalLineItem1.setCreditAmount(invoice.getTotalAmount());
//		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.INVOICE);
//		journalLineItem1.setReferenceId(invoice.getId());
//		journalLineItem1.setCreatedBy(userId);
//		journalLineItem1.setJournal(journal);
//		journalLineItemList.add(journalLineItem1);
//
//		JournalLineItem journalLineItem2 = new JournalLineItem();
//		TransactionCategory saleTransactionCategory = transactionCategoryService
//				.findTransactionCategoryByTransactionCategoryCode(TransactionCategoryCodeEnum.SALE.getCode());
//		journalLineItem2.setTransactionCategory(saleTransactionCategory);
//		journalLineItem2.setDebitAmount(invoice.getTotalAmount());
//		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_EXPENSE);
//		journalLineItem2.setReferenceId(invoice.getId());
//		journalLineItem2.setCreatedBy(userId);
//		journalLineItem2.setJournal(journal);
//		journalLineItemList.add(journalLineItem2);
//		journal.setJournalLineItems(journalLineItemList);
//
//		journal.setCreatedBy(userId);
//		journal.setPostingReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_EXPENSE);
//		journal.setJournalDate(LocalDateTime.now());
//		return journal;
//	}
//
//	private Journal expenseReconsile(ReconsileLineItemModel reconsileLineItemModel, Integer userId) {
//		List<JournalLineItem> journalLineItemList = new ArrayList();
//
//		Expense expence = expenseService.findByPK(reconsileLineItemModel.getReconcileRrefId());
//
//		Journal journal = new Journal();
//		JournalLineItem journalLineItem1 = new JournalLineItem();
//		TransactionCategory transactionCategory = transactionCategoryService
//				.findTransactionCategoryByTransactionCategoryCode(
//						TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode());
//		journalLineItem1.setTransactionCategory(transactionCategory);
//		journalLineItem1.setCreditAmount(expence.getExpenseAmount());
//		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
//		journalLineItem1.setReferenceId(reconsileLineItemModel.getReconcileRrefId());
//		journalLineItem1.setCreatedBy(userId);
//		journalLineItem1.setJournal(journal);
//		journalLineItemList.add(journalLineItem1);
//
//		JournalLineItem journalLineItem2 = new JournalLineItem();
//		journalLineItem2.setTransactionCategory(expence.getTransactionCategory());
//		journalLineItem2.setDebitAmount(expence.getExpenseAmount());
//		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
//		journalLineItem2.setReferenceId(reconsileLineItemModel.getReconcileRrefId());
//		journalLineItem2.setCreatedBy(userId);
//		journalLineItem2.setJournal(journal);
//		journalLineItemList.add(journalLineItem2);
//
//		journal.setJournalLineItems(journalLineItemList);
//		journal.setCreatedBy(userId);
//		journal.setPostingReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
//		journal.setJournalDate(LocalDateTime.now());
//		return journal;
//	}

}

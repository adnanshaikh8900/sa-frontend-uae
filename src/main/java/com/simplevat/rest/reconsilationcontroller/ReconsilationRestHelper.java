package com.simplevat.rest.reconsilationcontroller;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.simplevat.entity.*;
import com.simplevat.entity.bankaccount.ReconcileStatus;
import com.simplevat.rest.transactioncontroller.TransactionPresistModel;
import com.simplevat.service.*;
import com.simplevat.service.bankaccount.ReconcileStatusService;
import com.simplevat.utils.DateFormatUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.ChartOfAccountCategoryIdEnumConstant;
import com.simplevat.constant.ChartOfAccountConstant;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.ReconsileCategoriesEnumConstant;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import org.springframework.web.bind.annotation.ModelAttribute;

import static com.simplevat.constant.ErrorConstant.ERROR;

@Component
public class ReconsilationRestHelper {

	private final Logger logger = LoggerFactory.getLogger(ReconsilationController.class);

	@Autowired
	private ReconcileStatusService reconcileStatusService;

	@Autowired
	private DateFormatUtil dateUtil;


	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private CurrencyExchangeService currencyExchangeService;

	public List<ReconsilationListModel> getList(ReconsileCategoriesEnumConstant constant) {
		Map<String, Object> attribute = new HashMap<String, Object>();

		attribute.put("deleteFlag", Boolean.FALSE);

		List<ReconsilationListModel> modelList = new ArrayList<>();
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

	public Journal get(ChartOfAccountCategoryIdEnumConstant chartOfAccountCategoryIdEnumConstant,
			Integer transactionCategoryCode, BigDecimal amount, int userId, Transaction transaction) {

		Journal journal = null;
		switch (chartOfAccountCategoryIdEnumConstant) {
		default:
			journal = getByTransactionType(transactionCategoryCode, amount, userId, transaction, false);
			break;

		case SALES:
			journal = invoiceReconsile(chartOfAccountCategoryIdEnumConstant, userId, transaction,
					transaction.getBankAccount().getTransactionCategory());
			break;
		case EXPENSE:
			journal = invoiceReconsile(chartOfAccountCategoryIdEnumConstant, userId, transaction,
					transaction.getBankAccount().getTransactionCategory());
			break;
		}
		return journal;

	}
//Todo
	public Journal getByTransactionType(Integer transactionCategoryCode, BigDecimal amount, int userId,
										Transaction transaction, boolean isdebitFromBank) {
		CurrencyConversion exchangeRate =  currencyExchangeService.getExchangeRate(transaction.getBankAccount()
				.getBankAccountCurrency().getCurrencyCode());
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		TransactionCategory transactionCategory = transactionCategoryService.findByPK(transactionCategoryCode);

		ChartOfAccount transactionType = transactionCategory.getChartOfAccount();

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		journalLineItem1.setTransactionCategory(transaction.getExplainedTransactionCategory());
		if (!isdebitFromBank) {
			journalLineItem1.setDebitAmount(amount.multiply(exchangeRate.getExchangeRate()));
		} else {
			journalLineItem1.setCreditAmount(amount.multiply(exchangeRate.getExchangeRate()));
		}
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE);
		journalLineItem1.setReferenceId(transaction.getTransactionId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(transaction.getBankAccount().getTransactionCategory());
		if (isdebitFromBank) {
			journalLineItem2.setDebitAmount(transaction.getTransactionAmount().multiply(exchangeRate.getExchangeRate()));
		} else {
			journalLineItem2.setCreditAmount(transaction.getTransactionAmount().multiply(exchangeRate.getExchangeRate()));
		}
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE);
		journalLineItem2.setReferenceId(transaction.getTransactionId());
		journalLineItem2.setCreatedBy(transaction.getCreatedBy());
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(transaction.getCreatedBy());
		journal.setPostingReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}
//Todo
	public Journal getByTransactionType(@ModelAttribute TransactionPresistModel transactionPresistModel,
										Integer transactionCategoryCode, int userId,
										Transaction transaction, Expense expense) {
		CurrencyConversion exchangeRate =  currencyExchangeService.getExchangeRate(transactionPresistModel.getCurrencyCode());
		List<JournalLineItem> journalLineItemList = new ArrayList<>();
		BigDecimal amount = transactionPresistModel.getAmount();
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
			journalLineItem1.setDebitAmount(amount.multiply(transactionPresistModel.getExchangeRate()));
		} else {
			journalLineItem1.setCreditAmount(amount.multiply(transactionPresistModel.getExchangeRate()));
		}
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journalLineItem1.setReferenceId(expense.getExpenseId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(transaction.getBankAccount().getTransactionCategory());
		if (isdebitFromBank) {
			journalLineItem2.setDebitAmount(transaction.getTransactionAmount().multiply(transactionPresistModel.getExchangeRate()));
		} else {
			journalLineItem2.setCreditAmount(transaction.getTransactionAmount().multiply(transactionPresistModel.getExchangeRate()));
		}
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journalLineItem2.setReferenceId(expense.getExpenseId());
		journalLineItem2.setCreatedBy(transaction.getCreatedBy());
		journalLineItem2.setJournal(journal);

		if (transactionPresistModel.getVatId()!=null) {
			VatCategory vatCategory = vatCategoryService.findByPK(transactionPresistModel.getVatId());
			BigDecimal vatPercent =  vatCategory.getVat();
			BigDecimal vatAmount = calculateActualVatAmount(vatPercent,amount);
			BigDecimal actualDebitAmount = BigDecimal.valueOf(amount.floatValue()-vatAmount.floatValue());
			journalLineItem1.setDebitAmount(actualDebitAmount.multiply(transaction.getExchangeRate()));
			JournalLineItem journalLineItem = new JournalLineItem();
			TransactionCategory inputVatCategory = transactionCategoryService
					.findTransactionCategoryByTransactionCategoryCode(TransactionCategoryCodeEnum.INPUT_VAT.getCode());
			journalLineItem.setTransactionCategory(inputVatCategory);
			journalLineItem.setDebitAmount(vatAmount);
			journalLineItem.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
			journalLineItem.setReferenceId(expense.getExpenseId());
			journalLineItem.setCreatedBy(userId);
			journalLineItem.setJournal(journal);
			journalLineItemList.add(journalLineItem);
		}
		journalLineItemList.add(journalLineItem2);
		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(transaction.getCreatedBy());
		journal.setPostingReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

	private BigDecimal calculateActualVatAmount(BigDecimal vatPercent, BigDecimal expenseAmount) {
		float vatPercentFloat = vatPercent.floatValue()+100;
		float expenseAmountFloat = expenseAmount.floatValue()/vatPercentFloat * 100;
		return BigDecimal.valueOf(expenseAmount.floatValue()-expenseAmountFloat);
	}
	public Journal invoiceReconsile(ChartOfAccountCategoryIdEnumConstant ChartOfAccountCategoryIdEnumConstant,
			Integer userId, Transaction transaction,TransactionCategory bankTransactionCategory ) {
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Journal journal = new Journal();
		BigDecimal totalAmount = transaction.getTransactionAmount();
		// Considered invoice belongs to single type
		boolean isCustomerInvoice = false;

		isCustomerInvoice = ChartOfAccountCategoryIdEnumConstant.equals(ChartOfAccountCategoryIdEnumConstant.SALES);

		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						isCustomerInvoice ? TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode()
								: TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		// Reverse flow as invoice creation
		if (!isCustomerInvoice)
			journalLineItem1.setDebitAmount(transaction.getTransactionAmount());
		else
			journalLineItem1.setCreditAmount(transaction.getTransactionAmount());

		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE_INVOICE);
		journalLineItem1.setReferenceId(transaction.getTransactionId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(bankTransactionCategory);
		if (isCustomerInvoice)
			journalLineItem2.setDebitAmount(totalAmount);
		else
			journalLineItem2.setCreditAmount(totalAmount);
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE_INVOICE);
		journalLineItem2.setReferenceId(transaction.getTransactionId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);
		journal.setJournalLineItems(journalLineItemList);

		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE_INVOICE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}
	//Todo
	public Journal invoiceReconsile(Integer userId, Transaction transaction,boolean isCustomerInvoice ) {
		CurrencyConversion exchangeRate =  currencyExchangeService.getExchangeRate(transaction.getBankAccount()
				.getBankAccountCurrency().getCurrencyCode());
		List<JournalLineItem> journalLineItemList = new ArrayList<>();
		Journal journal = new Journal();
		BigDecimal totalAmount = transaction.getTransactionAmount();

		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						isCustomerInvoice ? TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode()
								: TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		// Reverse flow as invoice creation
		if (!isCustomerInvoice)
			journalLineItem1.setDebitAmount(transaction.getTransactionAmount().multiply(transaction.getExchangeRate()));
		else
			journalLineItem1.setCreditAmount(transaction.getTransactionAmount().multiply(transaction.getExchangeRate()));

		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE_INVOICE);
		journalLineItem1.setReferenceId(transaction.getTransactionId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(transaction.getBankAccount().getTransactionCategory());
		if (isCustomerInvoice)
			journalLineItem2.setDebitAmount(totalAmount.multiply(transaction.getExchangeRate()));
		else
			journalLineItem2.setCreditAmount(totalAmount.multiply(transaction.getExchangeRate()));
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE_INVOICE);
		journalLineItem2.setReferenceId(transaction.getTransactionId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);
		journal.setJournalLineItems(journalLineItemList);

		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.TRANSACTION_RECONSILE_INVOICE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

	public List<ReconcileStatusListModel> getModelList(Object reconcileStatusList) {

		List<ReconcileStatusListModel> reconcileStatusModelList = new ArrayList<>();
		for (ReconcileStatus reconcileStatus : (List<ReconcileStatus>) reconcileStatusList) {
			ReconcileStatusListModel reconcileStatusListModel = new ReconcileStatusListModel();
			reconcileStatusListModel.setReconcileId(reconcileStatus.getReconcileId());
			reconcileStatusListModel.setReconciledDate(reconcileStatus.getReconciledDate() != null
					? dateUtil.getLocalDateTimeAsString(reconcileStatus.getReconciledDate(), "dd-MM-yyyy")
					: "-");
		    reconcileStatusListModel.setClosingBalance(reconcileStatus.getClosingBalance());
			reconcileStatusListModel.setReconciledDuration(reconcileStatus.getReconciledDuration());
			reconcileStatusModelList.add(reconcileStatusListModel);
		}
		return reconcileStatusModelList;
}

	public LocalDateTime getDateFromRequest(ReconcilationPersistModel reconcilationPersistModel) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		LocalDateTime dateTime = null;
		try {
			dateTime = Instant.ofEpochMilli(dateFormat.parse(reconcilationPersistModel.getDate()).getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			return dateTime;
		} catch (ParseException e) {
			logger.error(ERROR, e);
		}
		return null;
	}

	public ReconcileStatus getReconcileStatus(@ModelAttribute ReconcilationPersistModel reconcilationPersistModel) {
		ReconcileStatus status = null;
		if (reconcilationPersistModel.getDate() != null && reconcilationPersistModel.getBankId()!=null) {

			SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
			LocalDateTime dateTime = null;
			try {
				dateTime = Instant.ofEpochMilli(dateFormat.parse(reconcilationPersistModel.getDate()).getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
			} catch (ParseException e) {
				logger.error(ERROR, e);
			}
			status = reconcileStatusService.getAllReconcileStatusByBankAccountId(reconcilationPersistModel.getBankId(),dateTime);
		}
		return status;
	}

}

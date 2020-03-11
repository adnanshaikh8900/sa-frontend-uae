package com.simplevat.rest.detailedgeneralledgerreport;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.entity.Expense;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.JournalLineItemService;
import com.simplevat.service.JournalService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.DateUtils;

import lombok.Data;

@Component
public class DetailedGeneralLedgerRestHelper {

	@Autowired
	private JournalService journalService;

	@Autowired
	private JournalLineItemService journalLineItemService;

	@Autowired
	private TransactionService transactionalService;

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private DateFormatUtil dateUtil;

	public List<Object> getDetailedGeneralLedgerReport(ReportRequestModel reportRequestModel) {

		List<Object> resposneList = new ArrayList<Object>();
		Map<JournalFilterEnum, Object> filterDataMap = new HashMap();

		filterDataMap.put(JournalFilterEnum.DELETE_FLAG, false);

		PaginationResponseModel response = journalService.getJornalList(filterDataMap, null);

		if (response != null && response.getData() != null) {
			List<Journal> journalList = (List<Journal>) response.getData();

			Map<Integer, List<JournalLineItem>> map = new HashMap<Integer, List<JournalLineItem>>();
			Map<Integer, Expense> expenseMap = new HashMap<Integer, Expense>();
			Map<Integer, Transaction> transactionMap = new HashMap<Integer, Transaction>();
			Map<Integer, Invoice> invoiceMap = new HashMap<Integer, Invoice>();

			for (Journal journal : journalList) {
				for (JournalLineItem item : journal.getJournalLineItems()) {
					if (item.getTransactionCategory() != null) {
						if (map.containsKey(item.getTransactionCategory().getTransactionCategoryId())) {
							map.get(item.getTransactionCategory().getTransactionCategoryId()).add(item);
						} else {
							List<JournalLineItem> jlList = new ArrayList<JournalLineItem>();
							jlList.add(item);
							map.put(item.getTransactionCategory().getTransactionCategoryId(), jlList);
						}
					}
				}
			}

			for (Integer item : map.keySet()) {
				List<DetailedGeneralLedgerReportListModel> dataList = new LinkedList<DetailedGeneralLedgerReportListModel>();
				for (JournalLineItem data : (List<JournalLineItem>) map.get(item)) {

					DetailedGeneralLedgerReportListModel model = new DetailedGeneralLedgerReportListModel();

					Journal journal = data.getJournal();
					LocalDateTime date = journal.getJournalDate();
					if (data == null)
						date = LocalDateTime.now();
					model.setDate(dateUtil.getDateAsString(date, "dd/mm/yyyy"));
					model.setTransactionTypeName(data.getTransactionCategory().getTransactionCategoryName());

					PostingReferenceTypeEnum postingType = data.getReferenceType();
					model.setPostingReferenceTypeEnum(postingType.getDisplayName());
					boolean isDebit = data.getDebitAmount() != null
							|| (data.getDebitAmount() != null && new BigDecimal(0).equals(data.getDebitAmount())) ? true
									: false;

					switch (postingType) {
					case BANK_ACCOUNT:

						transactionMap = findOrGetFromDbTr(transactionMap, data.getReferenceId());
						Transaction tr = transactionMap.get(data.getReferenceId());

						model.setAmount(tr.getTransactionAmount());
						model.setDebitAmount(isDebit ? tr.getTransactionAmount() : new BigDecimal(0));
						model.setCreditAmount(isDebit ? new BigDecimal(0) : tr.getTransactionAmount());
						model.setName(tr.getBankAccount() != null ? tr.getBankAccount().getBankAccountName() : "");
						break;

					case EXPENSE:

						expenseMap = findOrGetFromDbEx(expenseMap, data.getReferenceId());
						Expense expense = expenseMap.get(data.getReferenceId());
						model.setAmount(expense.getExpenseAmount());
						model.setDebitAmount(expense.getExpenseAmount());
						model.setCreditAmount(new BigDecimal(0));
						model.setName(expense.getPayee() != null && !expense.getPayee().equals(" ") ? expense.getPayee()
								: "");
						break;

					case INVOICE:

						invoiceMap = findOrGetFromDbIn(invoiceMap, data.getReferenceId());
						Invoice invoice = invoiceMap.get(data.getReferenceId());

						model.setReferenceNo(journal.getJournlReferencenNo());
						model.setAmount(invoice.getTotalAmount());
						model.setCreditAmount(invoice.getTotalAmount());
						model.setDebitAmount(new BigDecimal(0));
						model.setName(data.getContact() != null
								? data.getContact().getFirstName() + " " + data.getContact().getLastName()
								: "");
						model.setTransactonRefNo(invoice.getReferenceNumber());
						break;

					case MANUAL:
						model.setReferenceNo(journal.getJournlReferencenNo());
						model.setAmount(isDebit ? data.getDebitAmount() : data.getCreditAmount());
						model.setCreditAmount(data.getCreditAmount());
						model.setDebitAmount(data.getDebitAmount());
						model.setName(data.getContact() != null
								? data.getContact().getFirstName() + " " + data.getContact().getLastName()
								: "");
						break;

					case PURCHASE:
						break;
					}

					dataList.add(model);
				}
				resposneList.add(dataList);
			}

		}

		return resposneList;
	}

	public Map<Integer, Expense> findOrGetFromDbEx(Map<Integer, Expense> expenseMap, Integer id) {

		if (!expenseMap.containsKey(id)) {
			Expense expense = expenseService.findByPK(id);
			expenseMap.put(expense.getExpenseId(), expense);
		}
		return expenseMap;
	}

	public Map<Integer, Invoice> findOrGetFromDbIn(Map<Integer, Invoice> invoiceMap, Integer id) {

		if (!invoiceMap.containsKey(id)) {
			Invoice invoice = invoiceService.findByPK(id);
			invoiceMap.put(invoice.getId(), invoice);
		}
		return invoiceMap;
	}

	public Map<Integer, Transaction> findOrGetFromDbTr(Map<Integer, Transaction> transactionMap, Integer id) {

		if (!transactionMap.containsKey(id)) {
			Transaction transaction = transactionalService.findByPK(id);
			transactionMap.put(transaction.getTransactionId(), transaction);
		}
		return transactionMap;
	}

	public List<Object> getDetailedGeneralLedgerReport1(ReportRequestModel reportRequestModel) {

		List<Object> resposneList = new ArrayList<Object>();
		Map<JournalFilterEnum, Object> filterDataMap = new HashMap();

		filterDataMap.put(JournalFilterEnum.DELETE_FLAG, false);

		// PaginationResponseModel response =
		// journalService.getJornalList(filterDataMap, null);

		LocalDateTime fromDate = null;
		LocalDateTime toDate = null;
		try {
			fromDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getStartDate(), "dd/MM/yyyy");
		} catch (Exception e) {

		}
		try {
			toDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getEndDate(), "dd/MM/yyyy");
		} catch (Exception e) {

		}
		List<JournalLineItem> itemList = journalLineItemService.getList(fromDate, toDate, reportRequestModel);

		if (itemList != null && itemList.size() > 0) {

			Map<Integer, List<JournalLineItem>> map = new HashMap<Integer, List<JournalLineItem>>();
			Map<Integer, Expense> expenseMap = new HashMap<Integer, Expense>();
			Map<Integer, Transaction> transactionMap = new HashMap<Integer, Transaction>();
			Map<Integer, Invoice> invoiceMap = new HashMap<Integer, Invoice>();

			// for (Journal journal : journalList) {
			for (JournalLineItem item : itemList) {
				if (item.getTransactionCategory() != null) {
					if (map.containsKey(item.getTransactionCategory().getTransactionCategoryId())) {
						map.get(item.getTransactionCategory().getTransactionCategoryId()).add(item);
					} else {
						List<JournalLineItem> jlList = new ArrayList<JournalLineItem>();
						jlList.add(item);
						map.put(item.getTransactionCategory().getTransactionCategoryId(), jlList);
					}
				}
			}
			// }

			for (Integer item : map.keySet()) {
				List<DetailedGeneralLedgerReportListModel> dataList = new LinkedList<DetailedGeneralLedgerReportListModel>();
				List<JournalLineItem> journalLineItemList = (List<JournalLineItem>) map.get(item);

				Comparator<JournalLineItem> dateComparator = new Comparator<JournalLineItem>() {
					@Override
					public int compare(JournalLineItem j1, JournalLineItem j2) {
						return j1.getJournal().getJournalDate().compareTo(j2.getJournal().getJournalDate());
					}
				};

				Collections.sort(journalLineItemList, dateComparator);

				for (JournalLineItem data : journalLineItemList) {

					DetailedGeneralLedgerReportListModel model = new DetailedGeneralLedgerReportListModel();

					Journal journal = data.getJournal();
					LocalDateTime date = journal.getJournalDate();
					if (data == null)
						date = LocalDateTime.now();
					model.setDate(dateUtil.getDateAsString(date, "dd/MM/yyyy"));
					model.setTransactionTypeName(data.getTransactionCategory().getTransactionCategoryName());

					PostingReferenceTypeEnum postingType = data.getReferenceType();
					model.setPostingReferenceTypeEnum(postingType.getDisplayName());
					model.setPostingReferenceType(postingType);
					model.setReferenceId(data.getReferenceId());
					boolean isDebit = data.getDebitAmount() != null
							|| (data.getDebitAmount() != null && new BigDecimal(0).equals(data.getDebitAmount())) ? true
									: false;

					switch (postingType) {
					case BANK_ACCOUNT:

						transactionMap = findOrGetFromDbTr(transactionMap, data.getReferenceId());
						Transaction tr = transactionMap.get(data.getReferenceId());

						model.setAmount(tr.getTransactionAmount());
						model.setDebitAmount(isDebit ? tr.getTransactionAmount() : new BigDecimal(0));
						model.setCreditAmount(isDebit ? new BigDecimal(0) : tr.getTransactionAmount());
						model.setName(tr.getBankAccount() != null ? tr.getBankAccount().getBankAccountName() : "");
						break;

					case EXPENSE:

						expenseMap = findOrGetFromDbEx(expenseMap, data.getReferenceId());
						Expense expense = expenseMap.get(data.getReferenceId());
						model.setAmount(expense.getExpenseAmount());
						model.setDebitAmount(expense.getExpenseAmount());
						model.setCreditAmount(new BigDecimal(0));
						model.setName(expense.getPayee() != null && !expense.getPayee().equals(" ") ? expense.getPayee()
								: "");
						break;

					case INVOICE:

						invoiceMap = findOrGetFromDbIn(invoiceMap, data.getReferenceId());
						Invoice invoice = invoiceMap.get(data.getReferenceId());

						model.setReferenceNo(journal.getJournlReferencenNo());
						model.setAmount(invoice.getTotalAmount());
						model.setCreditAmount(invoice.getTotalAmount());
						model.setDebitAmount(new BigDecimal(0));
						model.setName(data.getContact() != null
								? data.getContact().getFirstName() + " " + data.getContact().getLastName()
								: "");
						model.setTransactonRefNo(invoice.getReferenceNumber());
						model.setInvoiceType(invoice.getType());
						break;

					case MANUAL:
						model.setReferenceNo(journal.getJournlReferencenNo());
						model.setAmount(isDebit ? data.getDebitAmount() : data.getCreditAmount());
						model.setCreditAmount(data.getCreditAmount());
						model.setDebitAmount(data.getDebitAmount());
						model.setName(data.getContact() != null
								? data.getContact().getFirstName() + " " + data.getContact().getLastName()
								: "");
						break;

					case PURCHASE:
						break;
					}

//					model.setAmount(model.getAmount().setScale(2, RoundingMode.HALF_UP));
//					model.setCreditAmount(model.getCreditAmount().setScale(2, RoundingMode.HALF_UP));
//					model.setDebitAmount(model.getDebitAmount().setScale(2, RoundingMode.HALF_UP));

					dataList.add(model);
				}
				resposneList.add(dataList);
			}

		}

		return resposneList;
	}

}

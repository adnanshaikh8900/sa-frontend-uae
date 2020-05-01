package com.simplevat.rest.detailedgeneralledgerreport;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.BeanProperty.Bogus;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.entity.Expense;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.invoicecontroller.InvoiceRestController;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.JournalLineItemService;
import com.simplevat.service.JournalService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.utils.DateFormatUtil;

@Component
public class DetailedGeneralLedgerRestHelper {

	private final Logger logger = LoggerFactory.getLogger(InvoiceRestController.class);

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

		List<Object> resposneList = new ArrayList<>();
		Map<JournalFilterEnum, Object> filterDataMap = new EnumMap<>(JournalFilterEnum.class);

		filterDataMap.put(JournalFilterEnum.DELETE_FLAG, false);

		List<JournalLineItem> itemList = journalLineItemService.getList(reportRequestModel);

		if (itemList != null && !itemList.isEmpty()) {

			Map<Integer, List<JournalLineItem>> map = new HashMap<>();
			Map<Integer, Expense> expenseMap = new HashMap<>();
			Map<Integer, Transaction> transactionMap = new HashMap<>();
			Map<Integer, Invoice> invoiceMap = new HashMap<>();

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

			for (Integer item : map.keySet()) {
				List<DetailedGeneralLedgerReportListModel> dataList = new LinkedList<>();
				List<JournalLineItem> journalLineItemList = (List<JournalLineItem>) map.get(item);

				Comparator<JournalLineItem> dateComparator = new Comparator<JournalLineItem>() {
					@Override
					public int compare(JournalLineItem j1, JournalLineItem j2) {
						return j1.getJournal().getJournalDate().compareTo(j2.getJournal().getJournalDate());
					}
				};

				Collections.sort(journalLineItemList, dateComparator);

				for (JournalLineItem lineItem : journalLineItemList) {

					DetailedGeneralLedgerReportListModel model = new DetailedGeneralLedgerReportListModel();

					Journal journal = lineItem.getJournal();
					LocalDateTime date = journal.getJournalDate();
					if (lineItem == null)
						date = LocalDateTime.now();
					model.setDate(dateUtil.getLocalDateTimeAsString(date, "dd/MM/yyyy"));
					model.setTransactionTypeName(lineItem.getTransactionCategory().getTransactionCategoryName());

					PostingReferenceTypeEnum postingType = lineItem.getReferenceType();
					model.setPostingReferenceTypeEnum(postingType.getDisplayName());
					model.setPostingReferenceType(postingType);
					model.setReferenceId(lineItem.getReferenceId());
					boolean isDebit = lineItem.getDebitAmount() != null || (lineItem.getDebitAmount() != null
							&& new BigDecimal(0).equals(lineItem.getDebitAmount())) ? Boolean.TRUE : Boolean.FALSE;

					switch (postingType) {
					case BANK_ACCOUNT:
					case TRANSACTION_RECONSILE:
					case TRANSACTION_RECONSILE_INVOICE:
						transactionMap = findOrGetFromDbTr(transactionMap, lineItem.getReferenceId());
						Transaction tr = transactionMap.get(lineItem.getReferenceId());

						model.setAmount(tr.getTransactionAmount());
						model.setDebitAmount(isDebit ? tr.getTransactionAmount() : new BigDecimal(0));
						model.setCreditAmount(isDebit ? new BigDecimal(0) : tr.getTransactionAmount());
						model.setName(tr.getBankAccount() != null ? tr.getBankAccount().getBankAccountName() : "");
						break;

					case EXPENSE:

						expenseMap = findOrGetFromDbEx(expenseMap, lineItem.getReferenceId());
						Expense expense = expenseMap.get(lineItem.getReferenceId());
						model.setAmount(expense.getExpenseAmount());
						model.setDebitAmount(expense.getExpenseAmount());
						model.setCreditAmount(new BigDecimal(0));
						model.setName(expense.getPayee() != null && !expense.getPayee().equals(" ") ? expense.getPayee()
								: "");
						break;

					case INVOICE:

						invoiceMap = findOrGetFromDbIn(invoiceMap, lineItem.getReferenceId());
						Invoice invoice = invoiceMap.get(lineItem.getReferenceId());

						model.setReferenceNo(journal.getJournlReferencenNo());
						model.setAmount(invoice.getTotalAmount());
						model.setCreditAmount(!isDebit ? invoice.getTotalAmount() : BigDecimal.ZERO);
						model.setDebitAmount(isDebit ? invoice.getTotalAmount() : BigDecimal.ZERO);
						model.setName(lineItem.getContact() != null
								? lineItem.getContact().getFirstName() + " " + lineItem.getContact().getLastName()
								: "");
						model.setTransactonRefNo(invoice.getReferenceNumber());
						model.setInvoiceType(invoice.getType());
						break;

					case MANUAL:
						model.setReferenceNo(journal.getJournlReferencenNo());
						model.setAmount(isDebit ? lineItem.getDebitAmount() : lineItem.getCreditAmount());
						model.setCreditAmount(lineItem.getCreditAmount());
						model.setDebitAmount(lineItem.getDebitAmount());
						model.setName(lineItem.getContact() != null
								? lineItem.getContact().getFirstName() + " " + lineItem.getContact().getLastName()
								: "");
						break;

					case PURCHASE:
						break;
					}

					model.setAmount(lineItem.getCurrentBalance() != null
							&& lineItem.getCurrentBalance().compareTo(BigDecimal.ZERO) == 0 ? model.getAmount()
									: lineItem.getCurrentBalance());

					dataList.add(model);
				}
				resposneList.add(dataList);
			}

		}

		return resposneList;
	}

}

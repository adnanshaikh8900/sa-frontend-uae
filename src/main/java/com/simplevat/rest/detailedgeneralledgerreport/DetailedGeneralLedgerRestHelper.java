package com.simplevat.rest.detailedgeneralledgerreport;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

import com.simplevat.entity.*;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.utils.DateFormatUtil;

@Component
public class DetailedGeneralLedgerRestHelper {

	@Autowired
	private JournalLineItemService journalLineItemService;

	@Autowired
	private TransactionService transactionalService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private ReceiptService receiptService;

	@Autowired
	private DateFormatUtil dateUtil;

	@Autowired
	TransactionCategoryClosingBalanceService transactionCategoryClosingBalanceService;

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

	public Map<Integer, BankAccount> findOrGetFromDbBn(Map<Integer, BankAccount> bankAccountMap, Integer id) {

		if (!bankAccountMap.containsKey(id)) {
			BankAccount bankAccount = bankAccountService.findByPK(id);
			bankAccountMap.put(bankAccount.getBankAccountId(), bankAccount);
		}
		return bankAccountMap;
	}

	public Map<Integer, Payment> findOrGetFromDbPaymnt(Map<Integer, Payment> paymentMap, Integer id) {

		if (!paymentMap.containsKey(id)) {
			Payment payment = paymentService.findByPK(id);
			paymentMap.put(payment.getPaymentId(), payment);
		}
		return paymentMap;
	}

	public Map<Integer, Receipt> findOrGetFromDbReceipt(Map<Integer, Receipt> receiptMap, Integer id) {

		if (!receiptMap.containsKey(id)) {
			Receipt receipt = receiptService.findByPK(id);
			receiptMap.put(receipt.getId(), receipt);
		}
		return receiptMap;
	}

	public List<Object> getDetailedGeneralLedgerReport(ReportRequestModel reportRequestModel) {

		List<Object> resposneList = new ArrayList<>();

		List<JournalLineItem> itemList = journalLineItemService.getList(reportRequestModel);
		List<TransactionCategoryClosingBalance> closingBalanceList = transactionCategoryClosingBalanceService.getList(reportRequestModel);
	    if (itemList != null && !itemList.isEmpty()) {
			Map<Integer,TransactionCategoryClosingBalance> transactionCategoryClosingBalanceMap = processTransactionCategoryClosingBalance(closingBalanceList);
			Map<Integer, List<JournalLineItem>> map = new HashMap<>();
			Map<Integer, Expense> expenseMap = new HashMap<>();
			Map<Integer, Transaction> transactionMap = new HashMap<>();
			Map<Integer, BankAccount> bankAccountMap = new HashMap<>();
			Map<Integer, Invoice> invoiceMap = new HashMap<>();
			Map<Integer, Receipt> receiptMap = new HashMap<>();
			Map<Integer, Payment> paymentMap = new HashMap<>();
			for (JournalLineItem item : itemList) {
				if (item.getTransactionCategory() != null) {
					if (map.containsKey(item.getTransactionCategory().getTransactionCategoryId())) {
						map.get(item.getTransactionCategory().getTransactionCategoryId()).add(item);
					} else {
						List<JournalLineItem> jlList = new ArrayList<>();
						jlList.add(item);
						map.put(item.getTransactionCategory().getTransactionCategoryId(), jlList);
					}
				}
			}

			for (Integer item : map.keySet()) {
				List<DetailedGeneralLedgerReportListModel> dataList = new LinkedList<>();
				List<JournalLineItem> journalLineItemList = map.get(item);

				Comparator<JournalLineItem> dateComparator = Comparator.comparing(j -> j.getJournal().getJournalDate());

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
							bankAccountMap = findOrGetFromDbBn(bankAccountMap, lineItem.getReferenceId());
							BankAccount bn = bankAccountMap.get(lineItem.getReferenceId());
							model.setAmount(lineItem.getDebitAmount()!=null?lineItem.getDebitAmount():lineItem.getCreditAmount());
							model.setDebitAmount(lineItem.getDebitAmount());
							model.setCreditAmount( lineItem.getCreditAmount());
							model.setName( bn.getBankName()+"-"+bn.getBankAccountName());
							break;

						case TRANSACTION_RECONSILE:
						case TRANSACTION_RECONSILE_INVOICE:
							transactionMap = findOrGetFromDbTr(transactionMap, lineItem.getReferenceId());
							Transaction tr = transactionMap.get(lineItem.getReferenceId());
							model.setAmount(lineItem.getDebitAmount()!=null?lineItem.getDebitAmount():lineItem.getCreditAmount());
							model.setDebitAmount(lineItem.getDebitAmount());
							model.setCreditAmount( lineItem.getCreditAmount());
							model.setName(tr.getBankAccount() != null ? tr.getBankAccount().getBankName()+"-"+tr.getBankAccount().getBankAccountName() : "-");
							break;

						case EXPENSE:
							expenseMap = findOrGetFromDbEx(expenseMap, lineItem.getReferenceId());
							Expense expense = expenseMap.get(lineItem.getReferenceId());
							model.setPostingReferenceTypeEnum(PostingReferenceTypeEnum.EXPENSE.getDisplayName());
							model.setAmount(isDebit ? lineItem.getDebitAmount(): lineItem.getCreditAmount());
							model.setDebitAmount(isDebit ? lineItem.getDebitAmount(): new BigDecimal(0));
							model.setCreditAmount(isDebit ? new BigDecimal(0):lineItem.getCreditAmount());
							if(expense.getUserId()!=null)
							{
								model.setName(expense.getUserId().getFirstName()+" "+expense.getUserId().getLastName());
							}
							else {
								model.setName(expense.getPayee());
							}
							break;

						case INVOICE:

							invoiceMap = findOrGetFromDbIn(invoiceMap, lineItem.getReferenceId());
							Invoice invoice = invoiceMap.get(lineItem.getReferenceId());

							model.setReferenceNo(journal.getJournlReferencenNo());
							//model.setAmount(invoice.getTotalAmount());
							BigDecimal amount = BigDecimal.ZERO;
							if(isDebit){
								model.setCreditAmount(BigDecimal.ZERO);
								model.setDebitAmount(lineItem.getDebitAmount());
								amount=lineItem.getDebitAmount();
							}
							else{
								model.setCreditAmount(lineItem.getCreditAmount());
								model.setDebitAmount(BigDecimal.ZERO);
								amount=lineItem.getCreditAmount();
							}
							model.setAmount(amount);
						/*BigDecimal amountCredit = !isDebit ? lineItem.getCreditAmount() : BigDecimal.ZERO;
						BigDecimal amountDebit = isDebit ? lineItem.getDebitAmount() : BigDecimal.ZERO;
						model.setCreditAmount(amountCredit);
						model.setDebitAmount(amountDebit);
						model.setAmount(amountDebit.intValue()!=0?amountDebit:amountCredit);*/
							//model.setCreditAmount(!isDebit ? lineItem.getCreditAmount() : BigDecimal.ZERO);
							//model.setDebitAmount(isDebit ? lineItem.getDebitAmount() : BigDecimal.ZERO);
							model.setName(invoice.getContact() != null
									? invoice.getContact().getFirstName() + " " + invoice.getContact().getLastName()
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

						case RECEIPT:
						case PAYMENT:

							model.setReferenceNo(journal.getJournlReferencenNo());
							model.setAmount(isDebit ? lineItem.getDebitAmount() : lineItem.getCreditAmount());
							model.setCreditAmount(lineItem.getCreditAmount());
							model.setDebitAmount(lineItem.getDebitAmount());
							Contact contact = null;
							if (postingType.equals(PostingReferenceTypeEnum.RECEIPT)) {
								receiptMap = findOrGetFromDbReceipt(receiptMap, lineItem.getReferenceId());
								Receipt receipt = receiptMap.get(lineItem.getReferenceId());
								contact = receipt.getContact();
							} else {
								paymentMap = findOrGetFromDbPaymnt(paymentMap, lineItem.getReferenceId());
								Payment payment = paymentMap.get(lineItem.getReferenceId());
								contact = payment.getSupplier();
							}
							model.setName(contact != null ? contact.getFirstName() + " " + contact.getLastName() : "");
							break;

						case PURCHASE:
							break;
					}

					model.setAmount(
//							lineItem.getCurrentBalance() != null
//							&& lineItem.getCurrentBalance().compareTo(BigDecimal.ZERO) == 0
//							? lineItem.getCurrentBalance():
							model.getAmount());

					dataList.add(model);
				}

				if(transactionCategoryClosingBalanceMap.get(item)!=null)
				{
					TransactionCategoryClosingBalance transactionCategoryClosingBalance = transactionCategoryClosingBalanceMap.get(item);
					updateOpeningClosingBalance(dataList,reportRequestModel,transactionCategoryClosingBalance);
//					DetailedGeneralLedgerReportListModel tempopeningBalanceModel = dataList.get(0);
//					DetailedGeneralLedgerReportListModel openingBalanceModel = new DetailedGeneralLedgerReportListModel();
//					openingBalanceModel.setDate("As on "+reportRequestModel.getStartDate());
//					openingBalanceModel.setCreditAmount(transactionCategoryClosingBalance.getOpeningBalance());
//					openingBalanceModel.setAmount(transactionCategoryClosingBalance.getOpeningBalance());
//					openingBalanceModel.setTransactionTypeName(tempopeningBalanceModel.getTransactionTypeName());
//					openingBalanceModel.setPostingReferenceTypeEnum("Opening Balance");
//					dataList.add(0,openingBalanceModel);
//					DetailedGeneralLedgerReportListModel closingBalanceModel = new DetailedGeneralLedgerReportListModel();
//					closingBalanceModel.setDate("As on "+reportRequestModel.getEndDate());
//					closingBalanceModel.setCreditAmount(transactionCategoryClosingBalance.getClosingBalance());
//					closingBalanceModel.setAmount(transactionCategoryClosingBalance.getClosingBalance());
//					closingBalanceModel.setPostingReferenceTypeEnum("Closing Balance");
//					dataList.add(closingBalanceModel);
				}
				resposneList.add(dataList);
			}

		}

		return resposneList;
	}

	private void updateOpeningClosingBalance(List<DetailedGeneralLedgerReportListModel> dataList, ReportRequestModel reportRequestModel,
											 TransactionCategoryClosingBalance transactionCategoryClosingBalance) {
		BigDecimal creditAmount = BigDecimal.ZERO;
		BigDecimal debitAmount = BigDecimal.ZERO;
		String transactionTypeName = dataList.get(0).getTransactionTypeName();
		for(DetailedGeneralLedgerReportListModel model : dataList )
		{
			creditAmount = creditAmount.add(model.getCreditAmount()!=null?model.getCreditAmount():BigDecimal.ZERO);
			debitAmount = debitAmount.add(model.getDebitAmount()!=null?model.getDebitAmount():BigDecimal.ZERO);
		}
		boolean isCredit = creditAmount.longValue() >= debitAmount.longValue() ;
		DetailedGeneralLedgerReportListModel openingBalanceModel = new DetailedGeneralLedgerReportListModel();
		DetailedGeneralLedgerReportListModel closingBalanceModel = new DetailedGeneralLedgerReportListModel();
		DetailedGeneralLedgerReportListModel tempopeningBalanceModel = dataList.get(0);
		openingBalanceModel.setDate("As on "+reportRequestModel.getStartDate());
		BigDecimal openingBalance = transactionCategoryClosingBalance.getOpeningBalance();
		if(transactionCategoryClosingBalance.getOpeningBalance().longValue()<=0) {
			openingBalanceModel.setCreditAmount(transactionCategoryClosingBalance.getOpeningBalance().negate());
			//openingBalanceModel.setDebitAmount(BigDecimal.ZERO);
		}else {
			//openingBalanceModel.setCreditAmount(BigDecimal.ZERO);
			openingBalanceModel.setDebitAmount(transactionCategoryClosingBalance.getOpeningBalance());
		}openingBalanceModel.setAmount(transactionCategoryClosingBalance.getOpeningBalance());
		openingBalanceModel.setTransactionTypeName(transactionTypeName);
		openingBalanceModel.setPostingReferenceTypeEnum("Opening Balance");
		dataList.add(0,openingBalanceModel);

		closingBalanceModel.setDate("As on "+reportRequestModel.getEndDate());

		BigDecimal closingBalance = transactionCategoryClosingBalance.getClosingBalance();
		if(closingBalance.longValue()<0)
			closingBalance= closingBalance.negate();
		if(isCredit) {
			closingBalanceModel.setCreditAmount(closingBalance);
			//closingBalanceModel.setDebitAmount(BigDecimal.ZERO);
		}
		else {
			//closingBalanceModel.setCreditAmount(BigDecimal.ZERO);
			closingBalanceModel.setDebitAmount(closingBalance);
		}
		closingBalanceModel.setPostingReferenceTypeEnum("Closing Balance");
		dataList.add(closingBalanceModel);
	}

	private Map<Integer, TransactionCategoryClosingBalance> processTransactionCategoryClosingBalance(List<TransactionCategoryClosingBalance> closingBalanceList) {
		Map<Integer, TransactionCategoryClosingBalance> transactionCategoryClosingBalanceMap = new HashMap<>();
		for(TransactionCategoryClosingBalance transactionCategoryClosingBalance :closingBalanceList)
		{
			TransactionCategoryClosingBalance tempTransactionCategoryClosingBalance = transactionCategoryClosingBalanceMap.get(transactionCategoryClosingBalance.getTransactionCategory().getTransactionCategoryId());

			if(tempTransactionCategoryClosingBalance==null)
			{
				tempTransactionCategoryClosingBalance = new TransactionCategoryClosingBalance();
				tempTransactionCategoryClosingBalance.setOpeningBalance(transactionCategoryClosingBalance.getOpeningBalance());
				tempTransactionCategoryClosingBalance.setClosingBalance(transactionCategoryClosingBalance.getClosingBalance());
				tempTransactionCategoryClosingBalance.setClosingBalanceDate(transactionCategoryClosingBalance.getClosingBalanceDate());
				transactionCategoryClosingBalanceMap.put(transactionCategoryClosingBalance.getTransactionCategory().getTransactionCategoryId(),tempTransactionCategoryClosingBalance);
			}
			else
				tempTransactionCategoryClosingBalance.setOpeningBalance(transactionCategoryClosingBalance.getOpeningBalance());
			tempTransactionCategoryClosingBalance.setCreatedDate(Date.from(transactionCategoryClosingBalance.getClosingBalanceDate().atZone(ZoneId.systemDefault()).toInstant()));
		}
		return transactionCategoryClosingBalanceMap;
	}

}

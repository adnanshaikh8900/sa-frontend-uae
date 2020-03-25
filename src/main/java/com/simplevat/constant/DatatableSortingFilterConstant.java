package com.simplevat.constant;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class DatatableSortingFilterConstant {

	Map<String, String> dataMap;
	public final static String DEFAULT_SORTING_ORDER = "DESC";

	public final String EXEPENSE = "EXPENSE";
	public final String EXEPENSE_DEFAULT = "expenseId";
	private final List<String> expenseColLabelList = Arrays.asList(new String[] { "payee", "expenseStatus",
			"expenseDescription", "receiptNumber", "expenseAmount", "transactionCategoryName", "expenseDate" });
	private final List<String> expenseColNameList = Arrays
			.asList(new String[] { "payee", "status", "expenseDescription", "receiptNumber", "expenseAmount",
					"transactionCategory.transactionCategoryName", "expenseDate" });

	public final String JOURNAL = "JOURNAL";
	public final String JOURNAL_DEFAULT = "id";
	private final List<String> journalColLabelList = Arrays
			.asList(new String[] { "journalDate", "journalReferenceNo", "postingReferenceType", "description" });
	private final List<String> journalColNameList = Arrays
			.asList(new String[] { "journalDate", "journlReferencenNo", "postingReferenceType", "description" });

	public final String BANK_ACCOUNT = "BANK_ACCOUNT";
	public final String BANK_ACCOUNT_DEFAULT = "id";
	private final List<String> bankAccountColLabelList = Arrays.asList(new String[] { "name", "bankAccountTypeName",
			"bankAccountNo", "accounName", "currancyName", "openingBalance" });
	private final List<String> bankAccountColNameList = Arrays.asList(new String[] { "bankName", "bankAccountType.name",
			"accountNumber", "bankAccountName", "bankAccountCurrency.currencyName", "openingBalance" });

	public final String INVOICE = "INVOICE";
	public final String INVOICE_DEFAULT = "id";
	private final List<String> invoiceColLabelList = Arrays.asList(new String[] { "status", "name", "referenceNumber",
			"invoiceDate", "invoiceDueDate", "totalAmount", "totalVatAmount" });
	private final List<String> invoiceColNameList = Arrays.asList(new String[] { "status", "contact.firstName",
			"referenceNumber", "invoiceDate", "invoiceDueDate", "totalAmount", "totalVatAmount" });

	public final String RECEIPT = "RECEIPT";
	public final String RECEIPT_DEFAULT = "id";
	private final List<String> receiptColLabelList = Arrays.asList(
			new String[] { "receiptDate", "referenceCode", "customerName", "invoiceNumber", "amount", "unusedAmount" });
	private final List<String> receiptColNameList = Arrays.asList(new String[] { "receiptDate", "referenceCode",
			"contact.firstName", "invoice.referenceNumber", "amount", "unusedAmount", });

	public final String PAYMENT = "PAYMENT";
	public final String PAYMENT_DEFAULT = "paymentId";
	private final List<String> paymentColLabelList = Arrays
			.asList(new String[] { "supplierName", "invoiceReferenceNo", "invoiceAmount", "paymentDate" });
	private final List<String> paymentColNameList = Arrays
			.asList(new String[] { "supplier.firstName", "invoice.referenceNumber", "invoiceAmount", "paymentDate" });

	public final String USER = "USER";
	public final String USER_DEFAULT = "userId";
	private final List<String> userColLabelList = Arrays
			.asList(new String[] { "firstName", "dob", "roleName", "active" });
	private final List<String> userColNameList = Arrays
			.asList(new String[] { "firstName", "dateOfBirth", "role.roleName", "isActive" });

	private Map<String, String> getMap(List<String> colLabelList, List<String> colNameList) {
		dataMap = new HashMap<String, String>();
		for (String colName : colLabelList) {
			int index = colLabelList.indexOf(colName);
			dataMap.put(colLabelList.get(index), colNameList.get(index));
		}
		return dataMap;
	}

	public String getColName(String label, String tableName) {

		String returnDbName = null;
		Map<String, String> map = null;
		switch (tableName) {
		case EXEPENSE:
			map = getMap(expenseColLabelList, expenseColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = EXEPENSE_DEFAULT;
			}
			break;

		case JOURNAL:
			map = getMap(journalColLabelList, journalColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = JOURNAL_DEFAULT;
			}
			break;

		case BANK_ACCOUNT:
			map = getMap(bankAccountColLabelList, bankAccountColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = BANK_ACCOUNT_DEFAULT;
			}
			break;

		case INVOICE:
			map = getMap(invoiceColLabelList, invoiceColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = INVOICE_DEFAULT;
			}
			break;
		case RECEIPT:
			map = getMap(receiptColLabelList, receiptColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = RECEIPT_DEFAULT;
			}
			break;
		case PAYMENT:
			map = getMap(paymentColLabelList, paymentColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = PAYMENT_DEFAULT;
			}
			break;

		case USER:
			map = getMap(userColLabelList, userColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = USER_DEFAULT;
			}
			break;
		}
		return returnDbName;
	}

}

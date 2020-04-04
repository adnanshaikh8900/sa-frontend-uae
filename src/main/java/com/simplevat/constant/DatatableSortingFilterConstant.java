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
	private final List<String> journalColLabelList = Arrays.asList(
			new String[] { "journalDate", "journalReferenceNo", "postingReferenceTypeDisplayName", "description" });
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

	public final String CHART_OF_ACCOUNT = "CHART_OF_ACCOUNT";
	public final String CHART_OF_ACCOUNT_DEFAULT = "transactionCategoryId";
	private final List<String> chartOfAccountColLabelList = Arrays
			.asList(new String[] { "transactionCategoryCode", "transactionCategoryName", "transactionTypeName" });
	private final List<String> chartOfAccountColNameList = Arrays.asList(
			new String[] { "transactionCategoryCode", "transactionCategoryName", "chartOfAccount.chartOfAccountName" });

	public final String CONTACT = "CONTACT";
	public final String CONTACT_DEFALT = "contactId";
	private final List<String> contactColLabelList = Arrays
			.asList(new String[] { "firstName", "email", "contactTypeString" });
	private final List<String> contactColNameList = Arrays.asList(new String[] { "firstName", "email", "contactType" });

	public final String EMPLOYEE = "EMPLOYEE";
	public final String EMPLOYEE_DEFALT = "id";
	private final List<String> employeeColLabelList = Arrays
			.asList(new String[] { "firstName", "referenceCode", "email", "vatRegestationNo" });
	private final List<String> employeeColNameList = Arrays
			.asList(new String[] { "firstName", "referenceCode", "email", "vatRegistrationNo" });

	public final String PRODUCT = "PRODUCT";
	public final String PRODUCT_DEFALT = "productID";
	private final List<String> productColLabelList = Arrays
			.asList(new String[] { "name", "productCode", "description", "vatPercentage", "unitPrice" });
	private final List<String> productColNameList = Arrays.asList(
			new String[] { "productName", "productCode", "productDescription", "vatCategory.name", "unitPrice" });

	public final String PROJECT = "PROJECT";
	public final String PROJECT_DEFALT = "projectId";
	private final List<String> projectColLabelList = Arrays
			.asList(new String[] { "projectName", "expenseBudget", "revenueBudget", "vatRegistrationNumber" });
	private final List<String> projectColNameList = Arrays
			.asList(new String[] { "projectName", "expenseBudget", "revenueBudget", "vatRegistrationNumber" });

	public final String VAT_CATEGORY = "VAT_CATEGORY";
	public final String VAT_CATEGORYT_DEFALT = "id";
	private final List<String> vatCategoryColLabelList = Arrays.asList(new String[] { "name", "vat" });
	private final List<String> vatCategoryColNameList = Arrays.asList(new String[] { "name", "vat" });

	public final String PRODUCT_CATEGORY = "PRODUCT_CATEGORY";
	public final String PRODUCT_CATEGORYT_DEFALT = "id";
	private final List<String> productCategoryColLabelList = Arrays
			.asList(new String[] { "productCategoryName", "productCategoryCode" });
	private final List<String> productCategoryColNameList = Arrays
			.asList(new String[] { "productCategoryName", "productCategoryCode" });

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

		case CHART_OF_ACCOUNT:
			map = getMap(chartOfAccountColLabelList, chartOfAccountColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = CHART_OF_ACCOUNT_DEFAULT;
			}
			break;

		case CONTACT:
			map = getMap(contactColLabelList, contactColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = CONTACT_DEFALT;
			}
			break;

		case EMPLOYEE:
			map = getMap(employeeColLabelList, employeeColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = EMPLOYEE_DEFALT;
			}
			break;

		case PRODUCT:
			map = getMap(productColLabelList, productColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = PRODUCT_DEFALT;
			}
			break;

		case PROJECT:
			map = getMap(projectColLabelList, projectColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = PROJECT_DEFALT;
			}
			break;

		case VAT_CATEGORY:
			map = getMap(vatCategoryColLabelList, vatCategoryColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = VAT_CATEGORYT_DEFALT;
			}
			break;

		case PRODUCT_CATEGORY:
			map = getMap(productCategoryColLabelList, productCategoryColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = PRODUCT_CATEGORYT_DEFALT;
			}
			break;

		}
		return returnDbName;
	}

}

package com.simplevat.constant;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class DatatableSortingFilterConstant {

	private DatatableSortingFilterConstant() {
		initColumnNameMapping();
	}

	Map<String, String> tableDefaultValueMap;
	Map<String, Map<String, String>> tableColumnNameMappingDataMap;
	public static final String DEFAULT_SORTING_ORDER = "DESC";

	//EXPENSE table
	public static final String EXPENSE = "EXPENSE";
	public static final String EXPENSE_DEFAULT_VALUE = "expenseId";
	public static final String EXPENSE_COL_LABEL_STRING = "payee,expenseStatus,expenseDescription,receiptNumber,expenseAmount,transactionCategoryName,expenseDate";
	public static final String EXPENSE_COL_NAME_STRING = "payee,status,expenseDescription,receiptNumber,expenseAmount,transactionCategory.transactionCategoryName,expenseDate";

	//JOURNAL table
	public static final String JOURNAL = "JOURNAL";
	public static final String JOURNAL_DEFAULT_VALUE = "id";
	public static final String JOURNAL_COL_LABEL_STRING = "journalDate,journalReferenceNo,postingReferenceTypeDisplayName,description";
	public static final String JOURNAL_COL_NAME_STRING = "journalDate,journlReferencenNo,postingReferenceType,description";

	//BANK_ACCOUNT table
	public static final String BANK_ACCOUNT = "BANK_ACCOUNT";
	public static final String BANK_ACCOUNT_DEFAULT_VALUE = "id";
	public static final String BANK_ACCOUNT_COL_LABEL_STRING = "name,bankAccountTypeName,bankAccountNo,accounName,currancyName,openingBalance";
	public static final String BANK_ACCOUNT_COL_NAME_STRING = "bankName,bankAccountType.name,accountNumber,bankAccountName,bankAccountCurrency.currencyName,openingBalance";

	//INVOICE table
	public static final String INVOICE = "INVOICE";
	public static final String INVOICE_DEFAULT_VALUE = "id";
	public static final String INVOICE_COL_LABEL_STRING = "name,referenceNumber,invoiceDate,invoiceDueDate,totalAmount,totalVatAmount";
	public static final String INVOICE_COL_NAME_STRING = "contact.firstName,referenceNumber,invoiceDate,invoiceDueDate,totalAmount,totalVatAmount";

	//RECEIPT table
	public static final String RECEIPT = "RECEIPT";
	public static final String RECEIPT_DEFAULT_VALUE = "id";
	public static final String RECEIPT_COL_LABEL_STRING = "receiptDate,referenceCode,customerName,invoiceNumber,amount,unusedAmount";
	public static final String RECEIPT_COL_NAME_STRING = "receiptDate,referenceCode,contact.firstName,invoice.referenceNumber,amount,unusedAmount";

	//PAYMENT table
	public static final String PAYMENT = "PAYMENT";
	public static final String PAYMENT_DEFAULT_VALUE = "paymentId";
	public static final String PAYMENT_COL_LABEL_STRING = "supplierName,invoiceReferenceNo,invoiceAmount,paymentDate";
	public static final String PAYMENT_COL_NAME_STRING = "supplier.firstName,invoice.referenceNumber,invoiceAmount,paymentDate";

	//USER table
	public static final String USER = "USER";
	public static final String USER_DEFAULT_VALUE = "userId";
	public static final String USER_COL_LABEL_STRING = "firstName,dob,roleName,active";
	public static final String USER_COL_NAME_STRING = "firstName,dateOfBirth,role.roleName,isActive";

    //CHART_OF_ACCOUNT table
	public static final String CHART_OF_ACCOUNT = "CHART_OF_ACCOUNT";
	public static final String CHART_OF_ACCOUNT_DEFAULT_VALUE = "transactionCategoryId";
	public static final String CHART_OF_ACCOUNT_COL_LABEL_STRING = "transactionCategoryCode,transactionCategoryName,transactionTypeName";
	public static final String CHART_OF_ACCOUNT_COL_NAME_STRING = "transactionCategoryCode,transactionCategoryName,chartOfAccount.chartOfAccountName";

	//CONTACT table
	public static final String CONTACT = "CONTACT";
	public static final String CONTACT_DEFAULT_VALUE = "contactId";
	public static final String CONTACT_COL_LABEL_STRING = "firstName,email,contactTypeString";
	public static final String CONTACT_COL_NAME_STRING = "firstName,email,contactType";

	//EMPLOYEE table
	public static final String EMPLOYEE = "EMPLOYEE";
	public static final String EMPLOYEE_DEFAULT_VALUE = "id";
	public static final String EMPLOYEE_COL_LABEL_STRING = "firstName,referenceCode,email,vatRegestationNo";
	public static final String EMPLOYEE_COL_NAME_STRING = "firstName,referenceCode,email,vatRegistrationNo";

	//PRODUCT table
	public static final String PRODUCT = "PRODUCT";
	public static final String PRODUCT_DEFAULT_VALUE = "productID";
	public static final String PRODUCT_COL_LABEL_STRING = "name,productCode,description,vatPercentage,unitPrice";
	public static final String PRODUCT_COL_NAME_STRING = "productName,productCode,productDescription,vatCategory.name,unitPrice";

	//PROJECT table
	public static final String PROJECT = "PROJECT";
	public static final String PROJECT_DEFAULT_VALUE = "projectId";
	public static final String PROJECT_COL_LABEL_STRING = "projectName,expenseBudget,revenueBudget,vatRegistrationNumber";
	public static final String PROJECT_COL_NAME_STRING = "projectName, expenseBudget, revenueBudget, vatRegistrationNumber";

	//VAT_CATEGORY table
	public static final String VAT_CATEGORY = "VAT_CATEGORY";
	public static final String VAT_CATEGORY_DEFAULT_VALUE = "id";
	public static final String VAT_CATEGORY_COL_LABEL_STRING = "name,vat";
	public static final String VAT_CATEGORY_COL_NAME_STRING = "name,vat";

	//PRODUCT_CATEGORY table
	public static final String PRODUCT_CATEGORY = "PRODUCT_CATEGORY";
	public static final String PRODUCT_CATEGORY_DEFAULT_VALUE = "id";
	public static final String PRODUCT_CATEGORY_COL_LABEL_STRING = "productCategoryName,productCategoryCode";
	public static final String PRODUCT_CATEGORY_COL_NAME_STRING = "productCategoryName,productCategoryCode";


	public String getColName(String label, String tableName) {
		if (tableColumnNameMappingDataMap == null) {
			initColumnNameMapping();
		}
			Map<String, String> columnDataMap = tableColumnNameMappingDataMap.get(tableName);
			String value = columnDataMap.get(label);
			if(value==null)
				return tableDefaultValueMap.get(tableName);
			return value;
	}

	private void initColumnNameMapping() {
		initTableNameDefaultValueMapping();
		tableColumnNameMappingDataMap = new HashMap<>();
		//EXPENSE
		String[] colLabelStringArray = EXPENSE_COL_LABEL_STRING.split(",");
		String[] colNameStringArray = EXPENSE_COL_NAME_STRING.split(",");
		Map<String, String>	tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(EXPENSE,tempDataMap);

		//JOURNAL
		colLabelStringArray = JOURNAL_COL_LABEL_STRING.split(",");
		colNameStringArray = JOURNAL_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(JOURNAL,tempDataMap);

		//BANK_ACCOUNT
		colLabelStringArray = BANK_ACCOUNT_COL_LABEL_STRING.split(",");
		colNameStringArray = BANK_ACCOUNT_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(BANK_ACCOUNT,tempDataMap);

		//INVOICE
		colLabelStringArray = INVOICE_COL_LABEL_STRING.split(",");
		colNameStringArray = INVOICE_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(INVOICE,tempDataMap);

		//RECEIPT
		colLabelStringArray = RECEIPT_COL_LABEL_STRING.split(",");
		colNameStringArray = RECEIPT_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(RECEIPT,tempDataMap);

		//PAYMENT
		colLabelStringArray = PAYMENT_COL_LABEL_STRING.split(",");
		colNameStringArray = PAYMENT_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(PAYMENT,tempDataMap);

		//USER
		colLabelStringArray = USER_COL_LABEL_STRING.split(",");
		colNameStringArray = USER_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(USER,tempDataMap);

		//CHART_OF_ACCOUNT
		colLabelStringArray = CHART_OF_ACCOUNT_COL_LABEL_STRING.split(",");
		colNameStringArray = CHART_OF_ACCOUNT_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(CHART_OF_ACCOUNT,tempDataMap);

		//CONTACT
		colLabelStringArray = CONTACT_COL_LABEL_STRING.split(",");
		colNameStringArray = CONTACT_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(CONTACT,tempDataMap);

		//EMPLOYEE
		colLabelStringArray = EMPLOYEE_COL_LABEL_STRING.split(",");
		colNameStringArray = EMPLOYEE_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(EMPLOYEE,tempDataMap);

		//PRODUCT
		colLabelStringArray = PRODUCT_COL_LABEL_STRING.split(",");
		colNameStringArray = PRODUCT_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(PRODUCT,tempDataMap);

		//PROJECT
		colLabelStringArray = PROJECT_COL_LABEL_STRING.split(",");
		colNameStringArray = PROJECT_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(PROJECT,tempDataMap);

		//VAT_CATEGORY
		colLabelStringArray = VAT_CATEGORY_COL_LABEL_STRING.split(",");
		colNameStringArray = VAT_CATEGORY_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(VAT_CATEGORY,tempDataMap);

		//PRODUCT_CATEGORY
		colLabelStringArray = PRODUCT_CATEGORY_COL_LABEL_STRING.split(",");
		colNameStringArray = PRODUCT_CATEGORY_COL_NAME_STRING.split(",");
		tempDataMap = createMap(colLabelStringArray,colNameStringArray);
		tableColumnNameMappingDataMap.put(PRODUCT_CATEGORY,tempDataMap);

	}

	private void initTableNameDefaultValueMapping() {
		tableDefaultValueMap = new HashMap<>();
		tableDefaultValueMap.put(EXPENSE, EXPENSE_DEFAULT_VALUE);
		tableDefaultValueMap.put(JOURNAL,JOURNAL_DEFAULT_VALUE);
		tableDefaultValueMap.put(BANK_ACCOUNT,BANK_ACCOUNT_DEFAULT_VALUE);
		tableDefaultValueMap.put(INVOICE,INVOICE_DEFAULT_VALUE);
		tableDefaultValueMap.put(RECEIPT,RECEIPT_DEFAULT_VALUE);
		tableDefaultValueMap.put(PAYMENT,PAYMENT_DEFAULT_VALUE);
		tableDefaultValueMap.put(USER,USER_DEFAULT_VALUE);
		tableDefaultValueMap.put(CHART_OF_ACCOUNT,CHART_OF_ACCOUNT_DEFAULT_VALUE);
		tableDefaultValueMap.put(CONTACT,CONTACT_DEFAULT_VALUE);
		tableDefaultValueMap.put(EMPLOYEE,EMPLOYEE_DEFAULT_VALUE);
		tableDefaultValueMap.put(PRODUCT,PRODUCT_DEFAULT_VALUE);
		tableDefaultValueMap.put(PROJECT,PROJECT_DEFAULT_VALUE);
		tableDefaultValueMap.put(VAT_CATEGORY,VAT_CATEGORY_DEFAULT_VALUE);
		tableDefaultValueMap.put(PRODUCT_CATEGORY,PRODUCT_CATEGORY_DEFAULT_VALUE);


	}

	private Map<String, String> createMap(String[] colLabelStringArray, String[] colNameStringArray) {
		Map<String, String> tempDataMap = new HashMap<>();
		for(int arrayCount=0;arrayCount<colLabelStringArray.length;arrayCount++)
			tempDataMap.put(colLabelStringArray[arrayCount],colNameStringArray[arrayCount]);
		return tempDataMap;
	}

}

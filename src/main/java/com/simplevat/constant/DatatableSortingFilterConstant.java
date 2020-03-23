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

	private Map<String, String> getMap(List<String> colNameList) {
		dataMap = new HashMap<String, String>();
		for (String colName : colNameList) {
			int index = colNameList.indexOf(colName);
			dataMap.put(expenseColLabelList.get(index), expenseColNameList.get(index));
			System.out.println(expenseColLabelList.get(index) + " = " + expenseColNameList.get(index));
		}
		return dataMap;
	}

	public String getColName(String label, String tableName) {

		String returnDbName = null;
		Map<String, String> map = null;
		switch (tableName) {
		case EXEPENSE:
			map = getMap(expenseColNameList);
			if (map.containsKey(label)) {
				returnDbName = map.get(label);
			} else {
				returnDbName = EXEPENSE_DEFAULT;
			}
			break;
		}
		return returnDbName;
	}

}

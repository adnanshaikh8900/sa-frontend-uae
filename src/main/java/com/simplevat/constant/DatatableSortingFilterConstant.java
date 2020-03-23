package com.simplevat.constant;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class DatatableSortingFilterConstant {

	Map<Integer, String> dataMap;

	public final String EXEPENSE = "EXPENSE";
	public final String EXEPENSE_DEFAULT = "expenseId";
	private final List<String> expenseColNameList = Arrays
			.asList(new String[] { "payee", "status", "expenseDescription", "receiptNumber", "expenseAmount",
					"transactionCategory.transactionCategoryName", "expenseDate" });

	public final String JOURNL = "JOURNAL";
	public final String JOURNAL_DEFAULT = "id";
	private final List<String> journalColNameList = Arrays
			.asList(new String[] { "payee", "status", "expenseDescription", "receiptNumber", "expenseAmount",
					"transactionCategory.transactionCategoryName", "expenseDate" });

	private Map<Integer, String> getMap(List<String> colNameList) {
		dataMap = new HashMap<Integer, String>();
		for (String colName : colNameList) {
			dataMap.put(colNameList.indexOf(colName), colName);
			System.out.println(colNameList.indexOf(colName) + " = " + colName);
		}
		return dataMap;
	}

	public String getColName(int index, String tableName) {

		String returnDbName = null;
		Map<Integer, String> map = null;
		switch (tableName) {
		case EXEPENSE:
			map = getMap(expenseColNameList);
			if (map.containsKey(index)) {
				returnDbName = map.get(index);
			} else {
				returnDbName = EXEPENSE_DEFAULT;
			}
			break;

		case JOURNL:
			map = getMap(journalColNameList);
			if (map.containsKey(index)) {
				returnDbName = map.get(index);
			} else {
				returnDbName = JOURNAL_DEFAULT;
			}
			break;

		}
		return returnDbName;
	}

}

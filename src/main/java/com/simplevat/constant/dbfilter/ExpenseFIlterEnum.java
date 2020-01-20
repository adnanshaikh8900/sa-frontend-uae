package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum ExpenseFIlterEnum {

	   EXPENSE_DATE("expenseDate", " = :expenseDate"),
	    PAYEE("payee", " like CONCAT(:payee,'%')"),
	    DELETE_FLAG("deleteFlag","= :deleteFlag"),
	    TRANSACTION_CATEGORY("transactionCategory", " = :transactionCategory");

	    @Getter
	    String dbColumnName;

	    @Getter
	    String condition;

	    private ExpenseFIlterEnum(String dbColumnName) {
	        this.dbColumnName = dbColumnName;
	    }

	    private ExpenseFIlterEnum(String dbColumnName, String condition) {
	        this.dbColumnName = dbColumnName;
	        this.condition = condition;
	    }
}

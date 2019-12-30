package com.simplevat.rest.expenses;

import lombok.Data;

@Data
public class ExpenseRequestFilterModel {

	private String expenseDate;
	private String payee;
	private Integer transactionCategoryId;
	
}

package com.simplevat.rest.expenses;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class ExpenseListModel {
	private Integer expenseId;
	private String payee;
	private String expenseDescription;
	private String receiptNumber;
	private String transactionCategoryName;
	private BigDecimal expenseAmount;
	private Date expenseDate;
	private Integer chartOfAccountId;
	private String expenseStatus;

}

package com.simplevat.rest.expensescontroller;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class ExpenseListModel {
	//if updated need to updaue in @link DatatableSortingFilterConstant 
	private Integer expenseId;
	private String payee;
	private String expenseDescription;
	private String receiptNumber;
	private String transactionCategoryName;
	private BigDecimal expenseAmount;
	private Date expenseDate;
	private Integer chartOfAccountId;
	private String expenseStatus;
	private Integer bankAccountId;
	private String currencyName;

}

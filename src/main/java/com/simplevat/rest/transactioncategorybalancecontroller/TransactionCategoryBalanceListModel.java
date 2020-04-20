package com.simplevat.rest.transactioncategorybalancecontroller;

import lombok.Data;

@Data
public class TransactionCategoryBalanceListModel {
	private Integer transactionCategoryBalanceId;
	private Integer transactionCategoryId;
	private String transactionCategoryName;
	private String effectiveDate; // dd/MM/yyyy
	private Double openingBalance;
}

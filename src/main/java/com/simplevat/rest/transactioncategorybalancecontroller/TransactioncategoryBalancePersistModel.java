package com.simplevat.rest.transactioncategorybalancecontroller;

import lombok.Data;

@Data
public class TransactioncategoryBalancePersistModel {

	private Integer transactionCategoryBalanceId;
	private Integer transactionCategoryId;
	private String effectiveDate; // dd/MM/yyyy
	private Double openingBalance;
}

package com.simplevat.rest.transactioncategorybalancecontroller;

import java.io.Serializable;

import lombok.Data;

@Data
public class TransactioncategoryBalancePersistModel implements Serializable{

	private Integer transactionCategoryBalanceId;
	private Integer transactionCategoryId;
	private String effectiveDate; // dd/MM/yyyy
	private Double openingBalance;
}

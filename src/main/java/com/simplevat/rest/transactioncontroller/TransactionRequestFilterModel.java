package com.simplevat.rest.transactioncontroller;

import java.util.Date;

import lombok.Data;

@Data
public class TransactionRequestFilterModel {
	private Integer bankId;
	private Date transactionDate;
	private Integer transactionTypeCode;
	private Integer transactionStatusCode;
}

package com.simplevat.rest.transactioncontroller;

import java.util.Date;

import com.simplevat.rest.PaginationModel;

import lombok.Data;

@Data
public class TransactionRequestFilterModel extends PaginationModel{
	private Integer bankId;
	private Date transactionDate;
	private Integer transactionTypeCode;
	private Integer transactionStatusCode;
}

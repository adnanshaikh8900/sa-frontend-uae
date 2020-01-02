package com.simplevat.rest.journalcontroller;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class JournalLineItemRequestModel {

	private Integer id;
	private String description;
	private Integer transactionCategoryId;
	private Integer contactId;
	private Integer vatCategoryId;
	private BigDecimal debitAmount;
	private BigDecimal creditAmount;
}

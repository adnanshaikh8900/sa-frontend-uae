package com.simplevat.rest.journalcontroller;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class JournalLineItemRequestModel {

	private int id;
	private String description;
	private Integer transactionCategoryId;
	private Integer contactId;
	private BigDecimal debitAmount;
	private BigDecimal creditAmount;
	private Integer createdBy;
	private LocalDateTime createdDate;
}

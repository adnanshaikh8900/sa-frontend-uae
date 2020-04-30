package com.simplevat.rest;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ReconsileRequestModel {

	private Integer transactionId;
	private Integer coaCategoryId;;
	private Integer transactionCategoryId;
	private BigDecimal amount;
	private String date;
	private String description;
	private MultipartFile attachmentFile;

	// EXPENSE
	private Integer vatId;
	private Integer vendorId;
	private Integer customerId;

	// MONEY PAID TO USER
	// MONEY RECEIVED FROM OTHER
	private Integer employeeId;

	// Transafer To
	private Integer bankId;

	// SALES
	private List<lineItem> invoiceIdList;

	@Data
	public class lineItem {
		private Integer invoiceId;
		private BigDecimal remainingInvoiceAmount;
	}
}

package com.simplevat.rest.receiptcontroller;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class ReceiptRequestModel {

	private Integer id;
	private Date receiptDate;
	private String receiptNo;
	private String receiptReferenceCode;
	private Integer contactId;
	private Integer invoiceId;
	private BigDecimal amount;
	private BigDecimal unusedAmount;

}

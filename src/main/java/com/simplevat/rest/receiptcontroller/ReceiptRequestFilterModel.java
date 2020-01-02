package com.simplevat.rest.receiptcontroller;

import java.util.Date;

import lombok.Data;

@Data
public class ReceiptRequestFilterModel {

	private Integer userId;
	private Integer contactId;
	private Integer invoiceId;
	private String referenceCode;
	private String receiptDate;
}

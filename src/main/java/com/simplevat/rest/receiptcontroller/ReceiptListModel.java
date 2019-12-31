package com.simplevat.rest.receiptcontroller;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class ReceiptListModel {

	private int id;
	private Date receiptDate;
	private String receiptReferenceCode;
	private String customerName;
	private BigDecimal amount;
	private BigDecimal unusedAmount;

}

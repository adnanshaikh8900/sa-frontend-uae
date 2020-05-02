package com.simplevat.rest;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReconsileRequestLineItemModel {

	private Integer invoiceId;
	private BigDecimal remainingInvoiceAmount;

}

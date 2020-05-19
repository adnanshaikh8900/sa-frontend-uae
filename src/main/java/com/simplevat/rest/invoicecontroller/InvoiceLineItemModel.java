package com.simplevat.rest.invoicecontroller;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceLineItemModel {

	private Integer id;
	private Integer quantity;
	private String description;
	private BigDecimal unitPrice;
	private String vatCategoryId;
	private BigDecimal subTotal;
	private Integer vatPercentage;
	private Integer productId;
	private Integer transactionCategoryId;
	private String transactionCategoryLabel;

}

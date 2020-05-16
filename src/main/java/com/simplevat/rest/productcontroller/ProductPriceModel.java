package com.simplevat.rest.productcontroller;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ProductPriceModel {
	private Integer id;
	private String name;
	private String description;
	private String vatPercentage;
	private BigDecimal unitPrice;
	private Integer vatCategoryId;
}

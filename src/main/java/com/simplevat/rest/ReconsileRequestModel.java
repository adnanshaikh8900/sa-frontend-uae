package com.simplevat.rest;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class ReconsileRequestModel {
	private String transactionCategory;
	private BigDecimal remainingBalance;
	private Integer transactionId;
	List<ReconsileLineItemModel> explainData;
}

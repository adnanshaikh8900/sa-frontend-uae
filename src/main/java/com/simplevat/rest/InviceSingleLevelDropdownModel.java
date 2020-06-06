package com.simplevat.rest;

import java.math.BigDecimal;

import com.simplevat.constant.PostingReferenceTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviceSingleLevelDropdownModel {
	private Integer value;
	private String label;
	private BigDecimal amount;
	private PostingReferenceTypeEnum type;

	public InviceSingleLevelDropdownModel(Integer value, String label, BigDecimal amount) {
		super();
		this.value = value;
		this.label = label;
		this.amount = amount;
	}

}

package com.simplevat.rest;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviceSingleLevelDropdownModel {
	private Integer options;
	private String label;
	private BigDecimal amount;

}

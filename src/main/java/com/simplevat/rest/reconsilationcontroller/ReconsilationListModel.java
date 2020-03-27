package com.simplevat.rest.reconsilationcontroller;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReconsilationListModel {

	private Integer id;
	private String date;
	private String label;
	private BigDecimal amount;
}

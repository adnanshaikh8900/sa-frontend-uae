/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest;

import java.io.Serializable;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author uday
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostingRequestModel implements Serializable {

	private Integer postingRefId;
	private String postingRefType;
	private Integer postingChartOfAccountId;
	private BigDecimal amount;
	private String comment;

	public PostingRequestModel(Integer postingRefId) {
		super();
		this.postingRefId = postingRefId;
	}

	public PostingRequestModel(Integer postingRefId,BigDecimal amount) {
		super();
		this.postingRefId = postingRefId;
		this.amount=amount;
	}

}

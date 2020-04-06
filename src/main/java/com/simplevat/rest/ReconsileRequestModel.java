package com.simplevat.rest;


import lombok.Data;

@Data
public class ReconsileRequestModel {
	private Integer reconcileRrefId;
	private Integer reconcileCategoryCode;
	private Integer transactionId;

}

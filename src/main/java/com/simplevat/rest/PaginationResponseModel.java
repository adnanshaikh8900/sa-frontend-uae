package com.simplevat.rest;

import lombok.Data;

@Data
public class PaginationResponseModel {

	private Integer count;
	private Object data;
}

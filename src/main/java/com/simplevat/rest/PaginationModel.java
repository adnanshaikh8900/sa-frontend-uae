/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest;

import lombok.Data;

/**
 *
 * @author uday
 */
@Data
public class PaginationModel {
	private Integer pageNo;
	private Integer pageSize;
	// private String order;
	// private String sortingCol;

	public Integer getPageNo() {
		if (pageNo == null) {
			pageNo = 0;
		} else {
			pageNo = pageNo * getPageSize();
		}
		return pageNo;
	}

	public Integer getPageSize() {
		if (pageSize == null) {
			pageSize = 10;
		}
		return pageSize;
	}
}

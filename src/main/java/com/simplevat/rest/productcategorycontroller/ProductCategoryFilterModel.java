package com.simplevat.rest.productcategorycontroller;

import com.simplevat.rest.PaginationModel;

import lombok.Data;

@Data
public class ProductCategoryFilterModel extends PaginationModel{

	public Integer id;
	public String productCategoryCode;
	public String productCategoryName;
	public boolean delete;
	public Integer userId;

}

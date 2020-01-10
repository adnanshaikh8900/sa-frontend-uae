package com.simplevat.rest.productcategorycontroller;

import lombok.Data;

@Data
public class ProductCategoryFilterModel {

	public Integer id;
	public String productCategoryCode;
	public String productCategoryName;
	public boolean delete;
	public Integer userId;

}

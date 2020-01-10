package com.simplevat.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.ProductCategoryFilterEnum;
import com.simplevat.entity.ProductCategory;

public abstract class ProductCategoryService extends SimpleVatService<Integer, ProductCategory> {

	public abstract List<ProductCategory> findAllProductCategoryByUserId(Integer userId, boolean isDeleted);

	public abstract void deleteByIds(ArrayList<Integer> ids);

	public abstract List<ProductCategory> getProductCategoryList(Map<ProductCategoryFilterEnum, Object> filterList);

}

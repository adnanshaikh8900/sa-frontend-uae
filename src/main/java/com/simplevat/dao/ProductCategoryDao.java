package com.simplevat.dao;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.ProductCategoryFilterEnum;
import com.simplevat.entity.ProductCategory;

public interface ProductCategoryDao extends Dao<Integer, ProductCategory> {

	public List<ProductCategory> getProductList(Map<ProductCategoryFilterEnum, Object> filterMap);

	public void deleteByIds(List<Integer> ids);
}

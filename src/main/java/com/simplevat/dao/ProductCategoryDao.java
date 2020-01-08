package com.simplevat.dao;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.ProductCategoryFilterEnum;
import com.simplevat.entity.ProductCategory;

public interface ProductCategoryDao extends Dao<Integer, ProductCategory> {

	public void deleteByIds(List<Integer> ids);

	public List<ProductCategory> getProductCategoryList(Map<ProductCategoryFilterEnum, Object> filterMap);
}

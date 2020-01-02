package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.ProductCategoryFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.ProductCategoryDao;
import com.simplevat.entity.ProductCategory;

@Transactional
@Repository
public class ProductCategoryDaoImpl extends AbstractDao<Integer, ProductCategory> implements ProductCategoryDao {

	@Override
	public List<ProductCategory> getProductList(Map<ProductCategoryFilterEnum, Object> filterMap) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach((productCategoryFilter, value) -> dbFilters
				.add(DbFilter.builder().dbCoulmnName(productCategoryFilter.getDbColumnName())
						.condition(productCategoryFilter.getCondition()).value(value).build()));
		List<ProductCategory> productCategories = this.executeQuery(dbFilters);
		return productCategories;
	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				ProductCategory productCategory = findByPK(id);
				productCategory.setDeleteFlag(Boolean.TRUE);
				update(productCategory);
			}
		}
	}

}

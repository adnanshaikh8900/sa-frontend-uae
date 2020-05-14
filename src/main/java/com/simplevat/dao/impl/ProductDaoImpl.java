package com.simplevat.dao.impl;

import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.ProductFilterEnum;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.ProductDao;
import com.simplevat.entity.Product;
import com.simplevat.entity.ProductLineItem;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

import java.util.ArrayList;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ProductDaoImpl extends AbstractDao<Integer, Product> implements ProductDao {
	@Autowired
	private DatatableSortingFilterConstant dataTableUtil;

	@Override
	public PaginationResponseModel getProductList(Map<ProductFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		paginationModel.setSortingCol(dataTableUtil.getColName(paginationModel.getSortingCol(), DatatableSortingFilterConstant.PRODUCT));
		return new PaginationResponseModel(this.getResultCount(dbFilters),
				this.executeQuery(dbFilters, paginationModel));
	}

	@Override
	@Transactional
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				Product product = findByPK(id);
				product.setDeleteFlag(Boolean.TRUE);
				for (ProductLineItem lineItem : product.getLineItemList())
					lineItem.setDeleteFlag(Boolean.TRUE);
				update(product);
			}
		}
	}
}

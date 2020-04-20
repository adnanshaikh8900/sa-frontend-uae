package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.TransactionCategoryBalanceDao;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.rest.PaginationResponseModel;

@Repository
@Transactional
public class TransactionCategoryBalanceDaoImpl extends AbstractDao<Integer, TransactionCategoryBalance>
		implements TransactionCategoryBalanceDao {

	@Override
	public PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> filterMap) {
		List<DbFilter> dbFilters = new ArrayList<>();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		PaginationResponseModel response = new PaginationResponseModel();
		response.setCount(this.getResultCount(dbFilters));
		response.setData(this.executeQuery(dbFilters, null));
		return response;
	}

}

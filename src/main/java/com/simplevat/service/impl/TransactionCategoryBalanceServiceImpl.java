package com.simplevat.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.TransactionCategoryBalanceDao;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.TransactionCategoryBalanceService;

@Service
public class TransactionCategoryBalanceServiceImpl extends TransactionCategoryBalanceService {

	@Autowired
	private TransactionCategoryBalanceDao transactionCategoryBalanceDao;

	@Override
	protected Dao<Integer, TransactionCategoryBalance> getDao() {
		return transactionCategoryBalanceDao;
	}

	@Override
	public PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> filterMap) {
		return transactionCategoryBalanceDao.getAll(filterMap);
	}

}

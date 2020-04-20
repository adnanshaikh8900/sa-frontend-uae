package com.simplevat.dao.impl;

import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.TransactionCategoryBalanceDao;
import com.simplevat.entity.TransactionCategoryBalance;

@Repository
@Transactional
public class TransactionCategoryBalanceDaoImpl extends AbstractDao<Integer, TransactionCategoryBalance>
		implements TransactionCategoryBalanceDao {

}

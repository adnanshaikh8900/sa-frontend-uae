package com.simplevat.dao.impl;

import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.TransactionExpensesDao;
import com.simplevat.entity.TransactionExpenses;

@Repository
@Transactional
public class TransactionExpensesDaoImpl extends AbstractDao<Integer, TransactionExpenses>
		implements TransactionExpensesDao {

}

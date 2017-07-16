package com.simplevat.service;

import java.util.List;

import com.simplevat.criteria.bankaccount.TransactionCategoryCriteria;
import com.simplevat.entity.bankaccount.TransactionCategory;

public interface TransactionCategoryServiceNew extends SimpleVatService<Integer, TransactionCategory> {
	
	public List<TransactionCategory> findAllTransactionCategory();
	
	public List<TransactionCategory> getCategoriesByComplexCriteria(TransactionCategoryCriteria criteria);
	
	public TransactionCategory getDefaultTransactionCategory();

}

package com.simplevat.service;

import java.util.List;

import com.simplevat.criteria.bankaccount.TransactionCategoryCriteria;
import com.simplevat.entity.bankaccount.TransactionCategory;

public abstract class TransactionCategoryServiceNew extends SimpleVatService<Integer, TransactionCategory> {
	
	public abstract  List<TransactionCategory> findAllTransactionCategory();
        
        public abstract  List<TransactionCategory> findAllTransactionCategoryByTransactionType(Integer transactionTypeCode,String name);
        
        public abstract  List<TransactionCategory> findTransactionCategoryListByParentCategory(Integer parentCategoryId);
	
	public abstract  List<TransactionCategory> getCategoriesByComplexCriteria(TransactionCategoryCriteria criteria);
	
	public abstract  TransactionCategory getDefaultTransactionCategory();
        
        public abstract  TransactionCategory getDefaultTransactionCategoryByTransactionCategoryId(Integer transactionCategoryId);

}

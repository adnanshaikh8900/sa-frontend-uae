package com.simplevat.dao.bankaccount;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.TransactionCategoryFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.entity.bankaccount.TransactionCategory;

public interface TransactionCategoryDao extends Dao<Integer, TransactionCategory> {

    public TransactionCategory updateOrCreateTransaction(TransactionCategory transactionCategory);

    public TransactionCategory getDefaultTransactionCategory();

    public List<TransactionCategory> findAllTransactionCategory();
    
    public TransactionCategory findTransactionCategoryByTransactionCategoryCode(Integer transactionCategoryCode);
    
    public List<TransactionCategory> findAllTransactionCategoryByTransactionTypeAndName(Integer transactionTypeCode, String name);

    public List<TransactionCategory> findTransactionCategoryListByParentCategory(Integer parentCategoryId);
    
    public List<TransactionCategory> findAllTransactionCategoryByTransactionType(Integer transactionTypeCode);

    public TransactionCategory getDefaultTransactionCategoryByTransactionCategoryId(Integer transactionCategoryId);

    public void deleteByIds(List<Integer> ids);

	public List<TransactionCategory> getTransactionCategoryList(Map<TransactionCategoryFilterEnum, Object> filterMap);
}

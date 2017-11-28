package com.simplevat.dao.bankaccount;

import java.util.List;

import com.simplevat.dao.Dao;
import com.simplevat.entity.bankaccount.TransactionCategory;

public interface TransactionCategoryDaoNew extends Dao<Integer, TransactionCategory> {

    public TransactionCategory updateOrCreateTransaction(TransactionCategory transactionCategory);

    public TransactionCategory getDefaultTransactionCategory();

    public List<TransactionCategory> findAllTransactionCategory();

    public List<TransactionCategory> findAllTransactionCategoryByTransactionType(Integer transactionTypeCode);

    public List<TransactionCategory> findTransactionCategoryListByParentCategory(Integer parentCategoryId);

}

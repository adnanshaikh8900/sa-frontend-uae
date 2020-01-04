package com.simplevat.service;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.TransactionCategoryFilterEnum;
import com.simplevat.criteria.bankaccount.TransactionCategoryCriteria;
import com.simplevat.entity.bankaccount.TransactionCategory;

public abstract class TransactionCategoryService extends SimpleVatService<Integer, TransactionCategory> {

    public abstract List<TransactionCategory> findAllTransactionCategory();

    public abstract List<TransactionCategory> findAllTransactionCategoryByUserId(Integer userId);

    public abstract List<TransactionCategory> findAllTransactionCategoryByTransactionTypeAndName(Integer transactionTypeCode, String name);

    public abstract List<TransactionCategory> findAllTransactionCategoryByTransactionType(Integer transactionTypeCode);

    public abstract List<TransactionCategory> findTransactionCategoryListByParentCategory(Integer parentCategoryId);

    public abstract List<TransactionCategory> getCategoriesByComplexCriteria(TransactionCategoryCriteria criteria);

    public abstract TransactionCategory getDefaultTransactionCategory();

    public abstract TransactionCategory getDefaultTransactionCategoryByTransactionCategoryId(Integer transactionCategoryId);

    public abstract void deleteByIds(List<Integer> ids);

    public abstract List<TransactionCategory> getTransactionCategoryList(Map<TransactionCategoryFilterEnum, Object> filterMap);
}

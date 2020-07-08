package com.simplevat.service;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public abstract class TransactionCategoryClosingBalanceService extends SimpleVatService<Integer, TransactionCategoryClosingBalance> {

    public abstract PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> dataMap);

    public abstract BigDecimal updateClosingBalance(Transaction lineItem);

    public abstract void addNewClosingBalance(TransactionCategoryBalance openingBalance);
    public abstract BigDecimal matchClosingBalanceForReconcile(LocalDateTime reconcileDate, TransactionCategory category);
}


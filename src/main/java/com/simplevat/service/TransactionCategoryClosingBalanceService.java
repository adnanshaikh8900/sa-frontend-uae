package com.simplevat.service;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public abstract class TransactionCategoryClosingBalanceService extends SimpleVatService<Integer, TransactionCategoryClosingBalance> {

    public abstract PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> dataMap);

    public abstract BigDecimal updateClosingBalance(Transaction lineItem);

    public abstract void addNewClosingBalance(TransactionCategoryBalance openingBalance);
    public abstract BigDecimal matchClosingBalanceForReconcile(LocalDateTime reconcileDate, TransactionCategory category);

    public abstract void updateClosingBalance(JournalLineItem lineItem) ;

    public abstract List<TransactionCategoryClosingBalance> getList(ReportRequestModel reportRequestModel);

    public abstract List<TransactionCategoryClosingBalance> getListByChartOfAccountIds(ReportRequestModel reportRequestModel);

    public abstract TransactionCategoryClosingBalance getLastClosingBalanceByDate(TransactionCategory category);
    public abstract TransactionCategoryClosingBalance getFirstClosingBalanceByDate(TransactionCategory category);
}


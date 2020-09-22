package com.simplevat.dao;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface TransactionCategoryClosingBalanceDao extends Dao<Integer, TransactionCategoryClosingBalance> {

    public PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> filterMap);

    public List<TransactionCategoryClosingBalance> getClosingBalanceForTimeRange(LocalDateTime closingBalanceStartDate, LocalDateTime closingBalanceEndDate,
                                                                                 TransactionCategory transactionCategory);

    public List<TransactionCategoryClosingBalance> getClosingBalanceGreaterThanCurrentDate( LocalDateTime closingBalanceEndDate,
                                                                                 TransactionCategory transactionCategory);
    public TransactionCategoryClosingBalance getClosingBalanceLessThanCurrentDate( LocalDateTime closingBalanceEndDate,
                                                                                            TransactionCategory transactionCategory);

    public TransactionCategoryClosingBalance getLastClosingBalanceByDate(TransactionCategory category);
    public TransactionCategoryClosingBalance getFirstClosingBalanceByDate(TransactionCategory category);

    public List<TransactionCategoryClosingBalance> getList(ReportRequestModel reportRequestModel);
    public List<TransactionCategoryClosingBalance> getListByChartOfAccountIds(ReportRequestModel reportRequestModel);
}

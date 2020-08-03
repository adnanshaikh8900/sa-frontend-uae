package com.simplevat.dao.impl;

import com.simplevat.constant.CommonColumnConstants;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.TransactionCategoryClosingBalanceDao;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.utils.DateFormatUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.simplevat.constant.ErrorConstant.ERROR;

@Repository
@Transactional
public class TransactionCategoryClosingBalanceDaoImpl extends AbstractDao<Integer, TransactionCategoryClosingBalance>
        implements TransactionCategoryClosingBalanceDao {
@Autowired
private DateFormatUtil dateUtil;
    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionCategoryClosingBalanceDaoImpl.class);

    public List<TransactionCategoryClosingBalance> getList(ReportRequestModel reportRequestModel)
    {
        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;
        try {
            fromDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getStartDate(), CommonColumnConstants.DD_MM_YYYY);
        } catch (Exception e) {
            LOGGER.error("Exception is ", e);
        }
        try {
            toDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getEndDate(), CommonColumnConstants.DD_MM_YYYY);
        } catch (Exception e) {
            LOGGER.error(ERROR, e);
        }

        String queryStr = "select cb from TransactionCategoryClosingBalance cb where cb.deleteFlag = false and cb.closingBalanceDate " +
                "BETWEEN :startDate and :endDate order by cb.closingBalanceDate DESC  ";

        TypedQuery<TransactionCategoryClosingBalance> query = getEntityManager().createQuery(queryStr, TransactionCategoryClosingBalance.class);
        if (fromDate != null) {
            query.setParameter(CommonColumnConstants.START_DATE, fromDate);
        }
        if (toDate != null) {
            query.setParameter(CommonColumnConstants.END_DATE, toDate);
        }
//        if (reportRequestModel.getChartOfAccountId() != null) {
//            query.setParameter("transactionCategoryId", reportRequestModel.getChartOfAccountId());
//        }
//        if (reportRequestModel.getReportBasis() != null && !reportRequestModel.getReportBasis().isEmpty()
//                && reportRequestModel.getReportBasis().equals("CASH")) {
//            query.setParameter("transactionCategoryIdList",
//                    Arrays.asList(TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode(),
//                            TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode()));
//        }
        List<TransactionCategoryClosingBalance> list = query.getResultList();
        return list != null && !list.isEmpty() ? list : null;
    }

    public List<TransactionCategoryClosingBalance> getListByChartOfAccountIds(ReportRequestModel reportRequestModel)
    {
        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;
        String chartOfAccountCodes = reportRequestModel.getChartOfAccountCodes();
        try {
            fromDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getStartDate(), CommonColumnConstants.DD_MM_YYYY);
        } catch (Exception e) {
            LOGGER.error("Exception is ", e);
        }
        try {
            toDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getEndDate(), CommonColumnConstants.DD_MM_YYYY);
        } catch (Exception e) {
            LOGGER.error(ERROR, e);
        }

        String queryStr = "select cb from TransactionCategoryClosingBalance cb where cb.deleteFlag = false and cb.closingBalanceDate " +
                "BETWEEN :startDate and :endDate and cb.transactionCategory.chartOfAccount.chartOfAccountCode in ("+chartOfAccountCodes+") order by cb.closingBalanceDate DESC  ";

        TypedQuery<TransactionCategoryClosingBalance> query = getEntityManager().createQuery(queryStr, TransactionCategoryClosingBalance.class);
        if (fromDate != null) {
            query.setParameter(CommonColumnConstants.START_DATE, fromDate);
        }
        if (toDate != null) {
            query.setParameter(CommonColumnConstants.END_DATE, toDate);
        }
//        if (reportRequestModel.getChartOfAccountId() != null) {
//            query.setParameter("transactionCategoryId", reportRequestModel.getChartOfAccountId());
//        }
//        if (reportRequestModel.getReportBasis() != null && !reportRequestModel.getReportBasis().isEmpty()
//                && reportRequestModel.getReportBasis().equals("CASH")) {
//            query.setParameter("transactionCategoryIdList",
//                    Arrays.asList(TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode(),
//                            TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode()));
//        }
        List<TransactionCategoryClosingBalance> list = query.getResultList();
        return list != null && !list.isEmpty() ? list : null;
    }
    @Override
    public PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> filterMap) {
        List<DbFilter> dbFilters = new ArrayList<>();
        filterMap.forEach(
                (productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
                        .condition(productFilter.getCondition()).value(value).build()));
        PaginationResponseModel response = new PaginationResponseModel();
        response.setCount(this.getResultCount(dbFilters));
        response.setData(this.executeQuery(dbFilters, null));
        return response;
    }

    public List<TransactionCategoryClosingBalance> getClosingBalanceForTimeRange(LocalDateTime closingBalanceStartDate, LocalDateTime closingBalanceEndDate,
                                                                                 TransactionCategory transactionCategory)
    {
        TypedQuery<TransactionCategoryClosingBalance> query = getEntityManager().createNamedQuery("getListByFrmToDate", TransactionCategoryClosingBalance.class);
        query.setParameter("startDate", closingBalanceStartDate);
        query.setParameter("endDate", closingBalanceEndDate);
        query.setParameter("transactionCategory", transactionCategory);
        List<TransactionCategoryClosingBalance> transactionCategoryClosingBalanceList = query.getResultList();
        return transactionCategoryClosingBalanceList != null && !transactionCategoryClosingBalanceList.isEmpty() ? transactionCategoryClosingBalanceList : null;
    }

    public List<TransactionCategoryClosingBalance> getClosingBalanceGreaterThanCurrentDate(LocalDateTime closingBalanceEndDate,
                                                                                 TransactionCategory transactionCategory)
    {
        TypedQuery<TransactionCategoryClosingBalance> query = getEntityManager().createNamedQuery("getListByFrmDate", TransactionCategoryClosingBalance.class);
        query.setParameter("endDate", closingBalanceEndDate);
        query.setParameter("transactionCategory", transactionCategory);
        List<TransactionCategoryClosingBalance> transactionCategoryClosingBalanceList = query.getResultList();
        return transactionCategoryClosingBalanceList != null && !transactionCategoryClosingBalanceList.isEmpty() ?
                transactionCategoryClosingBalanceList : new ArrayList<TransactionCategoryClosingBalance>();
    }

    public TransactionCategoryClosingBalance getClosingBalanceLessThanCurrentDate( LocalDateTime closingBalanceEndDate,
                                                                                         TransactionCategory transactionCategory)
    {
        TypedQuery<TransactionCategoryClosingBalance> query = getEntityManager().createNamedQuery("getListByForDate", TransactionCategoryClosingBalance.class);
        query.setParameter("endDate", closingBalanceEndDate);
        query.setParameter("transactionCategory", transactionCategory);
        List<TransactionCategoryClosingBalance> transactionCategoryClosingBalanceList = query.getResultList();
        return transactionCategoryClosingBalanceList != null && !transactionCategoryClosingBalanceList.isEmpty() ?
                transactionCategoryClosingBalanceList.get(0) : null;
    }
    public TransactionCategoryClosingBalance getLastClosingBalanceByDate(TransactionCategory category)
    {
        TypedQuery<TransactionCategoryClosingBalance> query = getEntityManager().createNamedQuery("getLastClosingBalanceByDate", TransactionCategoryClosingBalance.class);
        query.setParameter("transactionCategory", category);
        List<TransactionCategoryClosingBalance> transactionCategoryClosingBalanceList = query.getResultList();
        return transactionCategoryClosingBalanceList != null && !transactionCategoryClosingBalanceList.isEmpty() ?
                transactionCategoryClosingBalanceList.get(0) :null;
    }
}
package com.simplevat.dao.impl;

import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.TransactionCategoryClosingBalanceDao;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class TransactionCategoryClosingBalanceDaoImpl extends AbstractDao<Integer, TransactionCategoryClosingBalance>
        implements TransactionCategoryClosingBalanceDao {

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
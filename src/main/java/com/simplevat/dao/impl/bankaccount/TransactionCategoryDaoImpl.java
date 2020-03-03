package com.simplevat.dao.impl.bankaccount;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.TransactionCategoryFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.entity.bankaccount.TransactionCategory;
import javax.persistence.TypedQuery;
import org.springframework.transaction.annotation.Transactional;
import com.simplevat.dao.bankaccount.TransactionCategoryDao;

@Repository(value = "transactionCategoryDao")
public class TransactionCategoryDaoImpl extends AbstractDao<Integer, TransactionCategory> implements TransactionCategoryDao {

    @Override
    public TransactionCategory getDefaultTransactionCategory() {
        List<TransactionCategory> transactionCategories = findAllTransactionCategory();

        if (CollectionUtils.isNotEmpty(transactionCategories)) {
            return transactionCategories.get(0);
        }
        return null;
    }

    @Override
    public List<TransactionCategory> findAllTransactionCategory() {
        return this.executeNamedQuery("findAllTransactionCategory");
    }

    @Override
    public TransactionCategory updateOrCreateTransaction(TransactionCategory transactionCategory) {
        return this.update(transactionCategory);
    }

    @Override
    public List<TransactionCategory> findAllTransactionCategoryByChartOfAccountIdAndName(Integer chartOfAccountId, String name) {
        TypedQuery<TransactionCategory> query = getEntityManager().createQuery("SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.chartOfAccount.chartOfAccountId =:chartOfAccountId AND t.transactionCategoryName LIKE '%'||:transactionCategoryName||'%' ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC", TransactionCategory.class);
        query.setParameter("chartOfAccountId", chartOfAccountId);
        query.setParameter("transactionCategoryName", name);
        if (query.getResultList() != null && !query.getResultList().isEmpty()) {
            return query.getResultList();
        }
        return null;
    }

    @Override
    public List<TransactionCategory> findAllTransactionCategoryByChartOfAccount(Integer chartOfAccountId) {
        TypedQuery<TransactionCategory> query = getEntityManager().createQuery("SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.chartOfAccount.chartOfAccountId =:chartOfAccountId ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC", TransactionCategory.class);
        query.setParameter("chartOfAccountId", chartOfAccountId);
        if (query.getResultList() != null && !query.getResultList().isEmpty()) {
            return query.getResultList();
        }
        return null;
    }

    @Override
    public TransactionCategory findTransactionCategoryByTransactionCategoryCode(Integer transactionCategoryCode) {
        TypedQuery<TransactionCategory> query = getEntityManager().createQuery("SELECT t FROM TransactionCategory t where t.transactionCategoryCode =:transactionCategoryCode", TransactionCategory.class);
        query.setParameter("transactionCategoryCode", transactionCategoryCode.toString());
        if (query.getResultList() != null && !query.getResultList().isEmpty()) {
             return query.getResultList().get(0);
        }
        return null;
    }
    
    @Override
    public List<TransactionCategory> findTransactionCategoryListByParentCategory(Integer parentCategoryId) {
        TypedQuery<TransactionCategory> query = getEntityManager().createQuery("SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.parentTransactionCategory.transactionCategoryId =:parentCategoryId ORDER BY t.defaltFlag DESC , t.orderSequence ASC, t.transactionCategoryName ASC", TransactionCategory.class);
        query.setParameter("parentCategoryId", parentCategoryId);
        if (query.getResultList() != null && !query.getResultList().isEmpty()) {
            return query.getResultList();
        }
        return null;
    }

    @Override
    public TransactionCategory getDefaultTransactionCategoryByTransactionCategoryId(Integer transactionCategoryId) {
        TypedQuery<TransactionCategory> query = getEntityManager().createQuery("SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.defaltFlag = 'Y' AND t.transactionCategoryId !=:transactionCategoryId ORDER BY t.defaltFlag DESC , t.orderSequence ASC, t.transactionCategoryName ASC", TransactionCategory.class);
        query.setParameter("transactionCategoryId", transactionCategoryId);
        List<TransactionCategory> transactionCategoryList = query.getResultList();
        if (transactionCategoryList != null && !transactionCategoryList.isEmpty()) {
            return transactionCategoryList.get(0);
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteByIds(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            for (Integer id : ids) {
                TransactionCategory transactionCategory = findByPK(id);
                transactionCategory.setDeleteFlag(Boolean.TRUE);
                update(transactionCategory);
            }
        }
    }

    @Override
    public List<TransactionCategory> getTransactionCategoryList(Map<TransactionCategoryFilterEnum, Object> filterMap) {
        List<DbFilter> dbFilters = new ArrayList();
        filterMap.forEach((transactionCategoryFilter, value) -> dbFilters
                .add(DbFilter.builder().dbCoulmnName(transactionCategoryFilter.getDbColumnName())
                        .condition(transactionCategoryFilter.getCondition()).value(value).build()));
        List<TransactionCategory> transactionCategories = this.executeQuery(dbFilters);
        return transactionCategories;
    }

}

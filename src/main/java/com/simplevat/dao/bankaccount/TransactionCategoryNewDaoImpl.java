package com.simplevat.dao.bankaccount;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Repository;

import com.simplevat.dao.AbstractDao;
import com.simplevat.entity.bankaccount.TransactionCategory;
import javax.persistence.TypedQuery;
import org.springframework.transaction.annotation.Transactional;

@Repository(value = "transactionCategoryDao")
public class TransactionCategoryNewDaoImpl extends AbstractDao<Integer, TransactionCategory> implements TransactionCategoryDaoNew {

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
    public List<TransactionCategory> findAllTransactionCategoryByTransactionTypeAndName(Integer transactionTypeCode, String name) {
        TypedQuery<TransactionCategory> query = getEntityManager().createQuery("SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.transactionType.transactionTypeCode =:transactionTypeCode AND t.transactionCategoryName LIKE '%'||:transactionCategoryName||'%' ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC", TransactionCategory.class);
        query.setParameter("transactionTypeCode", transactionTypeCode);
        query.setParameter("transactionCategoryName", name);
        if (query.getResultList() != null && !query.getResultList().isEmpty()) {
            return query.getResultList();
        }
        return null;
    }
    
    @Override
    public List<TransactionCategory> findAllTransactionCategoryByTransactionType(Integer transactionTypeCode) {
        TypedQuery<TransactionCategory> query = getEntityManager().createQuery("SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.transactionType.transactionTypeCode =:transactionTypeCode ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC", TransactionCategory.class);
        query.setParameter("transactionTypeCode", transactionTypeCode);
        if (query.getResultList() != null && !query.getResultList().isEmpty()) {
            return query.getResultList();
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

}

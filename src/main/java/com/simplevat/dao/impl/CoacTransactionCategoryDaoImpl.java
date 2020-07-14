package com.simplevat.dao.impl;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.CoacTransactionCategoryDao;
import com.simplevat.entity.CoaCoaCategory;
import com.simplevat.entity.CoacTransactionCategory;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.ChartOfAccountCategoryService;
import com.simplevat.service.TransactionCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.List;

@Repository
public class CoacTransactionCategoryDaoImpl extends AbstractDao<Integer, CoacTransactionCategory>  implements CoacTransactionCategoryDao  {

    @Autowired
    ChartOfAccountCategoryService chartOfAccountCategoryService;

    @Autowired
    TransactionCategoryService transactionCategoryService;

    public void addCoacTransactionCategory(ChartOfAccount chartOfAccountCategory, TransactionCategory transactionCategory){

        String query =  "SELECT MAX(id) FROM CoacTransactionCategory ORDER BY id DESC";

        TypedQuery<Integer> typedQuery = getEntityManager().createQuery(query, Integer.class);

        Integer id = typedQuery.getSingleResult();

        String coaquery =  "SELECT c.chartOfAccountCategory.chartOfAccountCategoryId  FROM CoaCoaCategory c  WHERE c.chartOfAccount = :chartOfAccount";

        TypedQuery<Integer> typedCoaQuery = getEntityManager().createQuery(coaquery, Integer.class);

        typedCoaQuery.setParameter("chartOfAccount",transactionCategory.getChartOfAccount());

        List<Integer> coaCategoryList = typedCoaQuery.getResultList();

        if (coaCategoryList!=null && !coaCategoryList.isEmpty()){

            for ( Integer coaCategoryId : coaCategoryList ){
                id = id+1;
                CoacTransactionCategory coacTransactionCategory = new CoacTransactionCategory();
                coacTransactionCategory.setChartOfAccountCategory(chartOfAccountCategoryService.findByPK(coaCategoryId));
                coacTransactionCategory.setTransactionCategory(transactionCategory);
                coacTransactionCategory.setId(id);
                persist(coacTransactionCategory);

            }
        }
    }
}

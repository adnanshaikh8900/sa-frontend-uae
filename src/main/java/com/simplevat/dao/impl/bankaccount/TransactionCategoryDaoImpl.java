package com.simplevat.dao.impl.bankaccount;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.TypedQuery;

import com.simplevat.constant.CommonColumnConstants;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.TransactionCategoryFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.bankaccount.TransactionCategoryDao;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

@Repository(value = "transactionCategoryDao")
public class TransactionCategoryDaoImpl extends AbstractDao<Integer, TransactionCategory>
		implements TransactionCategoryDao {

	@Autowired
	private DatatableSortingFilterConstant dataTableUtil;

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
	public List<TransactionCategory> findAllTransactionCategoryByChartOfAccountIdAndName(Integer chartOfAccountId,
			String name) {
		TypedQuery<TransactionCategory> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.chartOfAccount.chartOfAccountId =:chartOfAccountId AND t.transactionCategoryName LIKE '%'||:transactionCategoryName||'%' ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC",
				TransactionCategory.class);
		query.setParameter(CommonColumnConstants.CHARTOFACCOUNT_ID, chartOfAccountId);
		query.setParameter("transactionCategoryName", name);
		if (query.getResultList() != null && !query.getResultList().isEmpty()) {
			return query.getResultList();
		}
		return new ArrayList<>();
	}

	@Override
	public List<TransactionCategory> findAllTransactionCategoryByChartOfAccount(Integer chartOfAccountId) {
		TypedQuery<TransactionCategory> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND (t.chartOfAccount.chartOfAccountId =:chartOfAccountId  or t.chartOfAccount.parentChartOfAccount.chartOfAccountId =:chartOfAccountId) ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC",
				TransactionCategory.class);
		query.setParameter(CommonColumnConstants.CHARTOFACCOUNT_ID, chartOfAccountId);
		if (query.getResultList() != null && !query.getResultList().isEmpty()) {
			return query.getResultList();
		}
		return new ArrayList<>();
	}

	@Override
	public TransactionCategory findTransactionCategoryByTransactionCategoryCode(String transactionCategoryCode) {
		TypedQuery<TransactionCategory> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionCategory t where t.transactionCategoryCode =:transactionCategoryCode",
				TransactionCategory.class);
		query.setParameter("transactionCategoryCode", transactionCategoryCode);
		if (query.getResultList() != null && !query.getResultList().isEmpty()) {
			return query.getResultList().get(0);
		}
		return null;
	}

	@Override
	public List<TransactionCategory> findTransactionCategoryListByParentCategory(Integer parentCategoryId) {
		TypedQuery<TransactionCategory> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.parentTransactionCategory.transactionCategoryId =:parentCategoryId ORDER BY t.defaltFlag DESC , t.orderSequence ASC, t.transactionCategoryName ASC",
				TransactionCategory.class);
		query.setParameter("parentCategoryId", parentCategoryId);
		if (query.getResultList() != null && !query.getResultList().isEmpty()) {
			return query.getResultList();
		}
		return new ArrayList<>();

	}

	@Override
	public TransactionCategory getDefaultTransactionCategoryByTransactionCategoryId(Integer transactionCategoryId) {
		TypedQuery<TransactionCategory> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.defaltFlag = 'Y' AND t.transactionCategoryId !=:transactionCategoryId ORDER BY t.defaltFlag DESC , t.orderSequence ASC, t.transactionCategoryName ASC",
				TransactionCategory.class);
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
	public PaginationResponseModel getTransactionCategoryList(Map<TransactionCategoryFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {
		List<DbFilter> dbFilters = new ArrayList<>();
		filterMap.forEach((transactionCategoryFilter, value) -> dbFilters
				.add(DbFilter.builder().dbCoulmnName(transactionCategoryFilter.getDbColumnName())
						.condition(transactionCategoryFilter.getCondition()).value(value).build()));
		paginationModel.setSortingCol(
				dataTableUtil.getColName(paginationModel.getSortingCol(), DatatableSortingFilterConstant.CHART_OF_ACCOUNT));
		return new PaginationResponseModel(this.getResultCount(dbFilters),
				this.executeQuery(dbFilters, paginationModel));
	}

	@Override
	public String getNxtTransactionCatCodeByChartOfAccount(ChartOfAccount chartOfAccount) {
		List<TransactionCategory> result = getEntityManager()
				.createNamedQuery("findMaxTnxCodeByChartOfAccId", entityClass)
				.setParameter(CommonColumnConstants.CHARTOFACCOUNT_ID, chartOfAccount).setMaxResults(1).getResultList();

		String chartOfAccountCode = chartOfAccount.getChartOfAccountCode();

		String trnxCatCode = result != null && result.size() > 0 && result.get(0).getTransactionCategoryCode() != null
				? result.get(0).getTransactionCategoryCode()
				: "0";

		String[] arr = trnxCatCode.split("-");
		trnxCatCode = arr.length > 0 ? arr[arr.length - 1] : "0";

		// considered valid no
		Integer d = Integer.valueOf(trnxCatCode);

		return chartOfAccountCode + "-" + String.format("%03d", (d + 1));
	}

	@Override
	public List<TransactionCategory> getTransactionCatByChartOfAccountCategoryId(Integer chartOfAccountCategoryId) {
		return getEntityManager().createNativeQuery(
				"SELECT * FROM TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT on TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID= CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID INNER JOIN COA_COA_CATEGORY ON COA_COA_CATEGORY.CHART_OF_ACCOUNT_ID= CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID WHERE COA_COA_CATEGORY.CHART_OF_ACCOUNT_CATEGORY_ID = :coaCategoryId",
				TransactionCategory.class).setParameter("coaCategoryId", chartOfAccountCategoryId).getResultList();
	}
}

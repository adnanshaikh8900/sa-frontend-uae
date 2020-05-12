package com.simplevat.dao.impl;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.rest.financialreport.CreditDebitAggregator;
import com.simplevat.rest.financialreport.FinancialReportRequestModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.utils.DateFormatUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.ParameterMode;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;
import javax.persistence.TypedQuery;

import org.springframework.transaction.annotation.Transactional;

@Repository
public class JournalLineItemDaoImpl extends AbstractDao<Integer, JournalLineItem> implements JournalLineItemDao {

	private static final Logger LOGGER = LoggerFactory.getLogger(JournalLineItemDaoImpl.class);

	@Autowired
	private DateFormatUtil dateUtil;

	@Override
	@Transactional
	public void deleteByJournalId(Integer journalId) {
		Query query = getEntityManager().createQuery("DELETE FROM JournalLineItem e WHERE e.journal.id = :journalId ");
		query.setParameter("journalId", journalId);
		query.executeUpdate();
	}

	@Override
	public List<JournalLineItem> getList(ReportRequestModel reportRequestModel) {
		LocalDateTime fromDate = null;
		LocalDateTime toDate = null;
		try {
			fromDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getStartDate(), "dd/MM/yyyy");
		} catch (Exception e) {
			LOGGER.error("Exception is ", e);
		}
		try {
			toDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getEndDate(), "dd/MM/yyyy");
		} catch (Exception e) {
			LOGGER.error("Error is ", e);
		}

		String queryStr = "select jn from JournalLineItem jn INNER join Journal j on j.id = jn.journal.id where j.journalDate BETWEEN :startDate and :endDate ";

		if (reportRequestModel.getChartOfAccountId() != null) {
			queryStr += " and jn.transactionCategory.transactionCategoryId = :transactionCategoryId";
		}
		if (reportRequestModel.getReportBasis() != null && !reportRequestModel.getReportBasis().isEmpty()
				&& reportRequestModel.getReportBasis().equals("CASH")) {
			if (reportRequestModel.getChartOfAccountId() != null) {
				queryStr += " or ";
			} else {
				queryStr += " and ";
			}
			queryStr += " jn.transactionCategory.transactionCategoryId in :transactionCategoryIdList";
		}

		TypedQuery<JournalLineItem> query = getEntityManager().createQuery(queryStr, JournalLineItem.class);
		if (fromDate != null) {
			query.setParameter("startDate", fromDate);
		}
		if (toDate != null) {
			query.setParameter("endDate", toDate);
		}
		if (reportRequestModel.getChartOfAccountId() != null) {
			query.setParameter("transactionCategoryId", reportRequestModel.getChartOfAccountId());
		}
		if (reportRequestModel.getReportBasis() != null && !reportRequestModel.getReportBasis().isEmpty()
				&& reportRequestModel.getReportBasis().equals("CASH")) {
			query.setParameter("transactionCategoryIdList",
					Arrays.asList(TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode(),
							TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode()));
		}
		List<JournalLineItem> list = query.getResultList();
		return list != null && !list.isEmpty() ? list : null;
	}

	@Override
	public List<JournalLineItem> getListByTransactionCategory(TransactionCategory transactionCategory) {
		return getEntityManager().createNamedQuery("getListByTransactionCategory")
				.setParameter("transactionCategory", transactionCategory).getResultList();
	}

	@Override
	public Map<Integer, CreditDebitAggregator> getAggregateTransactionCategoryMap(
			FinancialReportRequestModel financialReportRequestModel) {
		LocalDateTime fromDate = null;
		LocalDateTime toDate = null;
		Map<Integer, CreditDebitAggregator> aggregatedTransactionMap = new HashMap<>();
		try {
			fromDate = dateUtil.getDateStrAsLocalDateTime(financialReportRequestModel.getStartDate(), "dd/MM/yyyy");
		} catch (Exception e) {
			LOGGER.error("Error is ", e);
		}
		try {
			toDate = dateUtil.getDateStrAsLocalDateTime(financialReportRequestModel.getEndDate(), "dd/MM/yyyy");
		} catch (Exception e) {
			LOGGER.error("Error is ", e);
		}
		try {

			StoredProcedureQuery storedProcedureQuery = getEntityManager()
					.createStoredProcedureQuery("profitAndLossStoredProcedure");
			storedProcedureQuery.registerStoredProcedureParameter("incomeCode", String.class, ParameterMode.IN);
			storedProcedureQuery.registerStoredProcedureParameter("costOfGoodsSoldCode", String.class,
					ParameterMode.IN);
			storedProcedureQuery.registerStoredProcedureParameter("adminExpenseCode", String.class, ParameterMode.IN);
			storedProcedureQuery.registerStoredProcedureParameter("otherExpenseCode", String.class, ParameterMode.IN);
			storedProcedureQuery.registerStoredProcedureParameter("startDate", LocalDateTime.class, ParameterMode.IN);
			storedProcedureQuery.registerStoredProcedureParameter("endDate", LocalDateTime.class, ParameterMode.IN);

			storedProcedureQuery.setParameter("incomeCode", ChartOfAccountCategoryCodeEnum.INCOME.getCode());
			storedProcedureQuery.setParameter("costOfGoodsSoldCode",
					ChartOfAccountCategoryCodeEnum.COST_OF_GOODS_SOLD.getCode());
			storedProcedureQuery.setParameter("adminExpenseCode",
					ChartOfAccountCategoryCodeEnum.ADMIN_EXPENSE.getCode());
			storedProcedureQuery.setParameter("otherExpenseCode",
					ChartOfAccountCategoryCodeEnum.OTHER_EXPENSE.getCode());
			storedProcedureQuery.setParameter("startDate", fromDate);
			storedProcedureQuery.setParameter("endDate", toDate);
			storedProcedureQuery.execute();
			List<Object[]> resultList = storedProcedureQuery.getResultList();
			int code = 0;
			for (Object[] object : resultList) {
				String transactionCategoryName = (String) object[0];
				BigDecimal creditAmountBD = (BigDecimal) object[1];
				BigDecimal debitAmountBD = (BigDecimal) object[2];
				String transactionCategoryCode = (String) object[3];
				Double creditAmount = creditAmountBD != null ? creditAmountBD.doubleValue() : (double) 0;
				Double debitAmount = debitAmountBD != null ? debitAmountBD.doubleValue() : (double) 0;
				CreditDebitAggregator creditDebitAggregator = new CreditDebitAggregator(creditAmount, debitAmount,
						transactionCategoryCode, transactionCategoryName);
				aggregatedTransactionMap.put(code++, creditDebitAggregator);
			}
			return aggregatedTransactionMap;
		} catch (Exception e) {
			LOGGER.error(
					String.format("Error occurred while calling stored procedure profitAndLossStoredProcedure %s", e.getStackTrace()));
		}
		return aggregatedTransactionMap;
	}
}

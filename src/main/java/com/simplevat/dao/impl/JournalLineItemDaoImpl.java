package com.simplevat.dao.impl;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.constant.CommonColumnConstants;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.financialreport.CreditDebitAggregator;
import com.simplevat.rest.financialreport.FinancialReportRequestModel;
import com.simplevat.rest.taxescontroller.TaxesFilterEnum;
import com.simplevat.rest.taxescontroller.TaxesFilterModel;
import com.simplevat.utils.DateUtils;
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
import java.util.Date;

import javax.persistence.ParameterMode;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;
import javax.persistence.TypedQuery;

import org.springframework.transaction.annotation.Transactional;

import static com.simplevat.constant.ErrorConstant.ERROR;

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
			fromDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getStartDate(), CommonColumnConstants.DD_MM_YYYY);
		} catch (Exception e) {
			LOGGER.error("Exception is ", e);
		}
		try {
			toDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getEndDate(), CommonColumnConstants.DD_MM_YYYY);
		} catch (Exception e) {
			LOGGER.error(ERROR, e);
		}

		String queryStr = "select jn from JournalLineItem jn INNER join Journal j on j.id = jn.journal.id where j.deleteFlag = false and jn.deleteFlag = false and   j.journalDate BETWEEN :startDate and :endDate ";

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
			query.setParameter(CommonColumnConstants.START_DATE, fromDate);
		}
		if (toDate != null) {
			query.setParameter(CommonColumnConstants.END_DATE, toDate);
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
	public PaginationResponseModel getVatTransactionList(Map<TaxesFilterEnum, Object> filterMap, TaxesFilterModel paginationModel){
		PaginationResponseModel response = new PaginationResponseModel();
		TypedQuery<JournalLineItem> typedQuery = getEntityManager().createNamedQuery("getVatTransationList", JournalLineItem.class );
		if (paginationModel != null && !paginationModel.isPaginationDisable()) {
			typedQuery.setFirstResult(paginationModel.getPageNo());
			typedQuery.setMaxResults(paginationModel.getPageSize());
		}
		List<JournalLineItem> journalLineItemList = typedQuery.getResultList();
		if (journalLineItemList != null && !journalLineItemList.isEmpty()){
			response.setCount(journalLineItemList.size());
			response.setData(journalLineItemList);
		}
			return response;
	}


	@Override
	public Map<Integer, CreditDebitAggregator> getAggregateTransactionCategoryMap(
			FinancialReportRequestModel financialReportRequestModel, String reportType) {
		LocalDateTime fromDate = null;
		LocalDateTime toDate = null;
		Map<Integer, CreditDebitAggregator> aggregatedTransactionMap = new HashMap<>();
		try {
			fromDate = dateUtil.getDateStrAsLocalDateTime(financialReportRequestModel.getStartDate(), CommonColumnConstants.DD_MM_YYYY);
		} catch (Exception e) {
			LOGGER.error(ERROR, e);
		}
		try {
			toDate = dateUtil.getDateStrAsLocalDateTime(financialReportRequestModel.getEndDate(), CommonColumnConstants.DD_MM_YYYY);
		} catch (Exception e) {
			LOGGER.error(ERROR, e);
		}
		try {
			List<Object[]> resultList =null;
			switch (reportType){

				case "ProfitAndLoss":
					resultList = getProfitLossReport(fromDate, toDate);

					break;

				case "BalanceSheet":
					resultList = getBalanceSheetReport(fromDate, toDate);

					break;

				case "TrialBalance":
					resultList = getTrialBanaceReport(fromDate, toDate);

				default:
					break;

			}
			if(resultList == null){
				return aggregatedTransactionMap;
			}
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
			LOGGER.error(String.format("Error occurred while calling stored procedure profitAndLossStoredProcedure %s",
					e.getStackTrace()));
		}
		return aggregatedTransactionMap;
	}

	private List<Object[]> getBalanceSheetReport(LocalDateTime fromDate, LocalDateTime toDate) {

		StoredProcedureQuery storedProcedureQuery = getEntityManager()
				.createStoredProcedureQuery("balanceSheetStoredProcedure");
		storedProcedureQuery.registerStoredProcedureParameter("currentAssetCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("bankCode", String.class,
				ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("otherCurrentAssetCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("accountReceivableCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("accountPayableCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("fixedAssetCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("currentLiabilityCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("otherLiabilityCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("equityCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter(CommonColumnConstants.START_DATE, LocalDateTime.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter(CommonColumnConstants.END_DATE, LocalDateTime.class, ParameterMode.IN);

		storedProcedureQuery.setParameter("currentAssetCode", ChartOfAccountCategoryCodeEnum.CURRENT_ASSET.getCode());
		storedProcedureQuery.setParameter("bankCode",
				ChartOfAccountCategoryCodeEnum.BANK.getCode());
		storedProcedureQuery.setParameter("otherCurrentAssetCode",
				ChartOfAccountCategoryCodeEnum.OTHER_CURRENT_ASSET.getCode());
		storedProcedureQuery.setParameter("accountReceivableCode",
				ChartOfAccountCategoryCodeEnum.ACCOUNTS_RECEIVABLE.getCode());
		storedProcedureQuery.setParameter("accountPayableCode",
				ChartOfAccountCategoryCodeEnum.ACCOUNTS_PAYABLE.getCode());
		storedProcedureQuery.setParameter("fixedAssetCode",
				ChartOfAccountCategoryCodeEnum.FIXED_ASSET.getCode());
		storedProcedureQuery.setParameter("currentLiabilityCode",
				ChartOfAccountCategoryCodeEnum.OTHER_CURRENT_LIABILITIES.getCode());
		storedProcedureQuery.setParameter("otherLiabilityCode",
				ChartOfAccountCategoryCodeEnum.OTHER_LIABILITY.getCode());
		storedProcedureQuery.setParameter("equityCode",
				ChartOfAccountCategoryCodeEnum.EQUITY.getCode());
		storedProcedureQuery.setParameter(CommonColumnConstants.START_DATE, fromDate);
		storedProcedureQuery.setParameter(CommonColumnConstants.END_DATE, toDate);
		storedProcedureQuery.execute();
		return (List<Object[]>) storedProcedureQuery.getResultList();

	}

	private List<Object[]> getProfitLossReport(LocalDateTime fromDate, LocalDateTime toDate) {
		StoredProcedureQuery storedProcedureQuery = getEntityManager()
				.createStoredProcedureQuery("profitAndLossStoredProcedure");
		storedProcedureQuery.registerStoredProcedureParameter("incomeCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("costOfGoodsSoldCode", String.class,
				ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("adminExpenseCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("otherExpenseCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter(CommonColumnConstants.START_DATE, LocalDateTime.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter(CommonColumnConstants.END_DATE, LocalDateTime.class, ParameterMode.IN);

		storedProcedureQuery.setParameter("incomeCode", ChartOfAccountCategoryCodeEnum.INCOME.getCode());
		storedProcedureQuery.setParameter("costOfGoodsSoldCode",
				ChartOfAccountCategoryCodeEnum.COST_OF_GOODS_SOLD.getCode());
		storedProcedureQuery.setParameter("adminExpenseCode",
				ChartOfAccountCategoryCodeEnum.ADMIN_EXPENSE.getCode());
		storedProcedureQuery.setParameter("otherExpenseCode",
				ChartOfAccountCategoryCodeEnum.OTHER_EXPENSE.getCode());
		storedProcedureQuery.setParameter(CommonColumnConstants.START_DATE, fromDate);
		storedProcedureQuery.setParameter(CommonColumnConstants.END_DATE, toDate);
		storedProcedureQuery.execute();
		return (List<Object[]>) storedProcedureQuery.getResultList();
	}

	private List<Object[]> getTrialBanaceReport(LocalDateTime fromDate, LocalDateTime toDate) {
		StoredProcedureQuery storedProcedureQuery = getEntityManager()
				.createStoredProcedureQuery("trialBalanceStoredProcedure");
		storedProcedureQuery.registerStoredProcedureParameter("bankCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("otherCurrentAssetCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("accountReceivableCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("accountPayableCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("fixedAssetCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("otherLiabilityCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("equityCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("incomeCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("adminExpenseCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter("otherExpenseCode", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter(CommonColumnConstants.START_DATE, LocalDateTime.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter(CommonColumnConstants.END_DATE, LocalDateTime.class, ParameterMode.IN);
		storedProcedureQuery.setParameter("bankCode",
				ChartOfAccountCategoryCodeEnum.BANK.getCode());
		storedProcedureQuery.setParameter("otherCurrentAssetCode",
				ChartOfAccountCategoryCodeEnum.OTHER_CURRENT_ASSET.getCode());
		storedProcedureQuery.setParameter("accountReceivableCode",
				ChartOfAccountCategoryCodeEnum.ACCOUNTS_RECEIVABLE.getCode());
		storedProcedureQuery.setParameter("accountPayableCode",
				ChartOfAccountCategoryCodeEnum.ACCOUNTS_PAYABLE.getCode());
		storedProcedureQuery.setParameter("fixedAssetCode",
				ChartOfAccountCategoryCodeEnum.FIXED_ASSET.getCode());
		storedProcedureQuery.setParameter("otherLiabilityCode",
				ChartOfAccountCategoryCodeEnum.OTHER_LIABILITY.getCode());
		storedProcedureQuery.setParameter("equityCode",
				ChartOfAccountCategoryCodeEnum.EQUITY.getCode());
		storedProcedureQuery.setParameter("incomeCode", ChartOfAccountCategoryCodeEnum.INCOME.getCode());
		storedProcedureQuery.setParameter("adminExpenseCode",
				ChartOfAccountCategoryCodeEnum.ADMIN_EXPENSE.getCode());
		storedProcedureQuery.setParameter("otherExpenseCode",
				ChartOfAccountCategoryCodeEnum.OTHER_EXPENSE.getCode());
		storedProcedureQuery.setParameter(CommonColumnConstants.START_DATE, fromDate);
		storedProcedureQuery.setParameter(CommonColumnConstants.END_DATE, toDate);
		storedProcedureQuery.execute();
		return (List<Object[]>) storedProcedureQuery.getResultList();
	}

	@Override
	public 	Map<Integer, CreditDebitAggregator> getTaxReport(Date startDate, Date endDate){
		Map<Integer, CreditDebitAggregator> aggregatedTransactionMap = new HashMap<>();
		try
		{
		StoredProcedureQuery storedProcedureQuery = getEntityManager()
				.createStoredProcedureQuery("taxesStoredProcedure");
		storedProcedureQuery.registerStoredProcedureParameter("inputvat", String.class, ParameterMode.IN);
			storedProcedureQuery.registerStoredProcedureParameter("outputvat", String.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter(CommonColumnConstants.START_DATE,LocalDateTime.class, ParameterMode.IN);
		storedProcedureQuery.registerStoredProcedureParameter(CommonColumnConstants.END_DATE, LocalDateTime.class, ParameterMode.IN);
		storedProcedureQuery
				.setParameter(CommonColumnConstants.START_DATE, (dateUtil.getDateStrAsLocalDateTime(startDate,CommonColumnConstants.DD_MM_YYYY)))
				.setParameter(CommonColumnConstants.END_DATE, (dateUtil.getDateStrAsLocalDateTime(endDate,CommonColumnConstants.DD_MM_YYYY)));
		storedProcedureQuery.setParameter("inputvat",TransactionCategoryCodeEnum.INPUT_VAT.getCode());
		storedProcedureQuery.setParameter("outputvat",TransactionCategoryCodeEnum.OUTPUT_VAT.getCode());
           storedProcedureQuery.execute();
		List<Object[]> resultList = storedProcedureQuery.getResultList();

		if(resultList == null){
			return aggregatedTransactionMap;
		}
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
		LOGGER.error(String.format("Error occurred while calling stored procedure profitAndLossStoredProcedure %s",
				e.getStackTrace()));
	}
		return aggregatedTransactionMap;
	}

}


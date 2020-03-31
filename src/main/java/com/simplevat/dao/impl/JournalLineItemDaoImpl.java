package com.simplevat.dao.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.utils.DateFormatUtil;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Query;
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
			LOGGER.error("Error is ", e);
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
					Arrays.asList(new Integer[] { TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode(),
							TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode() }));
		}
		List<JournalLineItem> list = query.getResultList();
		return list != null && list.isEmpty() ? list : null;
	}
}

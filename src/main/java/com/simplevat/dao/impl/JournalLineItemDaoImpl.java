package com.simplevat.dao.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.DateUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.springframework.transaction.annotation.Transactional;

@Repository
public class JournalLineItemDaoImpl extends AbstractDao<Integer, JournalLineItem> implements JournalLineItemDao {

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

		}
		try {
			toDate = dateUtil.getDateStrAsLocalDateTime(reportRequestModel.getEndDate(), "dd/MM/yyyy");
		} catch (Exception e) {

		}

		String queryStr = "select jn from JournalLineItem jn INNER join Journal j on j.id = jn.journal.id where j.journalDate BETWEEN :startDate and :endDate ";

		if (reportRequestModel.getChartOfAccountId() != null) {
			queryStr += " and jn.transactionCategory.chartOfAccount.chartOfAccountId = :chartOfAccountId";
		}
		if (reportRequestModel.getReportBasic() != null && !reportRequestModel.getReportBasic().isEmpty()
				&& reportRequestModel.getReportBasic().equals("CASH")) {
			queryStr += " and jn.transactionCategory.transactionCategoryId in :transactionCategoryId";
		}

		TypedQuery<JournalLineItem> query = getEntityManager().createQuery(queryStr, JournalLineItem.class);
		if (fromDate != null) {
			query.setParameter("startDate", fromDate);
		}
		if (toDate != null) {
			query.setParameter("endDate", toDate);
		}
		if (reportRequestModel.getChartOfAccountId() != null) {
			query.setParameter("chartOfAccountId", reportRequestModel.getChartOfAccountId());
		}
		if (reportRequestModel.getReportBasic() != null && !reportRequestModel.getReportBasic().isEmpty()
				&& reportRequestModel.getReportBasic().equals("CASH")) {
			query.setParameter("transactionCategoryId",
					Arrays.asList(new Integer[] { TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode(),
							TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode() }));
			queryStr += " and jn.transactionCategory.transactionCategoryId in :transactionCategoryId";
		}
//		if (paginationModel != null && paginationModel.getPageNo() != null) {
//			query.setMaxResults(paginationModel.getPageSize());
//			query.setFirstResult(paginationModel.getPageNo());
//		}
		List<JournalLineItem> list = query.getResultList();
		return list != null && list.size() > 0 ? list : null;
	}
}

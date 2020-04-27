package com.simplevat.service.impl;

import java.util.List;
import java.util.Map;

import com.simplevat.rest.financialreport.CreditDebitAggregator;
import com.simplevat.rest.financialreport.FinancialReportRequestModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.service.JournalLineItemService;

@Service("JournalLineItemService")
public class JournalLineItemServiceImpl extends JournalLineItemService {

	@Autowired
	private JournalLineItemDao journalLineItemDao;

	@Override
	protected Dao<Integer, JournalLineItem> getDao() {
		return journalLineItemDao;
	}

	@Override
	public void deleteByJournalId(Integer journalId) {
		journalLineItemDao.deleteByJournalId(journalId);
	}

	@Override
	public List<JournalLineItem> getList(ReportRequestModel reportRequestModel) {
		return journalLineItemDao.getList(reportRequestModel);
	}

	@Override
	public Map<Integer, CreditDebitAggregator> getAggregateTransactionCategoryMap(FinancialReportRequestModel financialReportRequestModel) {
		return journalLineItemDao.getAggregateTransactionCategoryMap(financialReportRequestModel);
	}

}


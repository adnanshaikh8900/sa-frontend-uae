package com.simplevat.service.impl;

import java.math.BigDecimal;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.taxescontroller.TaxesFilterEnum;
import com.simplevat.rest.taxescontroller.TaxesFilterModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.simplevat.rest.financialreport.CreditDebitAggregator;
import com.simplevat.rest.financialreport.FinancialReportRequestModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.dao.Dao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.service.JournalLineItemService;

@Service("JournalLineItemService")
public class JournalLineItemServiceImpl extends JournalLineItemService {

	private final Logger logger = LoggerFactory.getLogger(JournalLineItemServiceImpl.class);

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
	public BigDecimal updateCurrentBalance(TransactionCategory transactionCategory, BigDecimal balance) {
		List<JournalLineItem> itemList = journalLineItemDao.getListByTransactionCategory(transactionCategory);

		BigDecimal currentBalance = balance;
		for (JournalLineItem journalLineItem : itemList) {

			if (journalLineItem.getCreditAmount() != null) {
				currentBalance = currentBalance.add(journalLineItem.getCreditAmount());
			} else {
				currentBalance = currentBalance.subtract(journalLineItem.getDebitAmount());
			}
			journalLineItem.setCurrentBalance(currentBalance);
		}

		return currentBalance;
	}

	@Override
	public Map<Integer, CreditDebitAggregator> getAggregateTransactionCategoryMap(
			FinancialReportRequestModel financialReportRequestModel, String reportType) {
		return journalLineItemDao.getAggregateTransactionCategoryMap(financialReportRequestModel,reportType);
	}

	@Override
	public PaginationResponseModel getVatTransactionList(Map<TaxesFilterEnum, Object> filterMap, TaxesFilterModel paginationModel) {
		return journalLineItemDao.getVatTransactionList(filterMap, paginationModel);
	}

	@Override
	public 	Map<Integer, CreditDebitAggregator> getTaxReport(Date startdate, Date endDate) {
		return journalLineItemDao.getTaxReport(startdate, endDate);

	}
}

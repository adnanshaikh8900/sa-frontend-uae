package com.simplevat.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.JournalDao;
import com.simplevat.entity.Journal;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryBalanceService;

@Service("JournalServiceImpl")
public class JournalServiceImpl extends JournalService {

	@Autowired
	private JournalDao journalDao;

	@Autowired
	private TransactionCategoryBalanceService transactionCategoryBalanceService;

	@Override
	public PaginationResponseModel getJornalList(Map<JournalFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {
		return journalDao.getJornalList(filterMap, paginationModel);
	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		journalDao.deleteByIds(ids);
	}

	@Override
	protected Dao<Integer, Journal> getDao() {
		return journalDao;
	}

	@Override
	public void persist(Journal journal) {
		transactionCategoryBalanceService.updateRunningBalance(journal.getJournalLineItems());
		super.persist(journal);
	}
}

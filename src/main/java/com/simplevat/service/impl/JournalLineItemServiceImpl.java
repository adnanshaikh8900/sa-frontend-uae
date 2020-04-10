package com.simplevat.service.impl;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.PaginationModel;
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

}


package com.simplevat.service.impl;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.JournalDao;
import com.simplevat.entity.Journal;
import com.simplevat.service.JournalService;

@Service("JournalServiceImpl")
public class JournalServiceImpl extends JournalService {

	@Autowired
	private JournalDao journalDao;

	@Override
	public List<Journal> getJornalList(Map<JournalFilterEnum, Object> filterMap) {
		List<Journal> journalList = journalDao.getJornalList(filterMap);
		// need to replace in abstract dao impl with order by
		if (journalList != null && !journalList.isEmpty())
			journalList.sort(new Comparator<Journal>() {

				@Override
				public int compare(Journal o1, Journal o2) {
					return o2.getJournalDate().compareTo(o1.getJournalDate());
				}
			});
		return journalList;
	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		journalDao.deleteByIds(ids);
	}

	@Override
	protected Dao<Integer, Journal> getDao() {
		return journalDao;
	}

}

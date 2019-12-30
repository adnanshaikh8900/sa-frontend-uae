package com.simplevat.dao;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.entity.Journal;

public interface JournalDao extends Dao<Integer, Journal> {

	public void deleteByIds(List<Integer> ids);

	public List<Journal> getJornalList(Map<JournalFilterEnum, Object> filterMap);

}

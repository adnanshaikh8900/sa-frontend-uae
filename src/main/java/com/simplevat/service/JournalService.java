package com.simplevat.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.entity.Journal;

@Service
public abstract class JournalService extends SimpleVatService<Integer, Journal> {
	public abstract void deleteByIds(List<Integer> ids);

	public abstract List<Journal> getJornalList(Map<JournalFilterEnum, Object> filterMap);

}

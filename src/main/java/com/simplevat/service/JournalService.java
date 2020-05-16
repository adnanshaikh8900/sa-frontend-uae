package com.simplevat.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.entity.Journal;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

@Service
public abstract class JournalService extends SimpleVatService<Integer, Journal> {
	public abstract void deleteByIds(List<Integer> ids);

	public abstract PaginationResponseModel getJornalList(Map<JournalFilterEnum, Object> filterMap,
			PaginationModel paginationModel);
}

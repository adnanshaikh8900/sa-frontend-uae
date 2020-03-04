package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.JournalDao;
import com.simplevat.entity.Journal;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

@Repository
public class JournalDaoImpl extends AbstractDao<Integer, Journal> implements JournalDao {
	@Override
	@Transactional
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				Journal journal = findByPK(id);
				journal.setDeleteFlag(Boolean.TRUE);
				update(journal);
			}
		}
	}

	@Override
	public PaginationResponseModel getJornalList(Map<JournalFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {

		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		List<Journal> journals = this.executeQuery(dbFilters, paginationModel);

		PaginationResponseModel resposne = new PaginationResponseModel();
		resposne.setCount(this.getResultCount(dbFilters));
		resposne.setData(journals);
		return resposne;
	}
}

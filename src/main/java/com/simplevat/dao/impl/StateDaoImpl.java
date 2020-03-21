package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.StateFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.StateDao;
import com.simplevat.entity.State;

@Repository
public class StateDaoImpl extends AbstractDao<Integer, State> implements StateDao {

	@Override
	public List<State> getstateList(Map<StateFilterEnum, Object> filterMap) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(stateFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(stateFilter.getDbColumnName())
						.condition(stateFilter.getCondition()).value(value).build()));
		List<State> stateList = this.executeQuery(dbFilters);
		return stateList;
	}
}

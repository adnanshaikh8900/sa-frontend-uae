package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.TransactionParsingSettingFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.TransactionParsingSettingDao;
import com.simplevat.entity.TransactionParsingSetting;

@Repository
public class TransactionParsingSettingDaoImpl extends AbstractDao<Long, TransactionParsingSetting>
		implements TransactionParsingSettingDao {

	@Override
	public List<TransactionParsingSetting> getTransactionList(
			Map<TransactionParsingSettingFilterEnum, Object> filterMap) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach((filter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(filter.getDbColumnName())
				.condition(filter.getCondition()).value(value).build()));
		List<TransactionParsingSetting> TransactionParsingSettingList = this.executeQuery(dbFilters);
		return TransactionParsingSettingList;
	}
}

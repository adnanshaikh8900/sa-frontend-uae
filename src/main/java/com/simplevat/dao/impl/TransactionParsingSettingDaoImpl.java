package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.TransactionParsingSettingFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.TransactionParsingSettingDao;
import com.simplevat.entity.TransactionParsingSetting;
import com.simplevat.entity.bankaccount.BankAccount;

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

	@Override
	public String getDateFormatByTemplateId(Integer templateId) {
		List<String> list = getEntityManager().createNamedQuery("getDateFormatIdTemplateId", String.class)
				.getResultList();

		return list != null && list.size() > 0 ? list.get(0) : null;
	}

}

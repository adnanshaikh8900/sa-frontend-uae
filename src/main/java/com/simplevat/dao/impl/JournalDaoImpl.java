package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.JournalDao;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.TransactionCategoryBalanceService;

@Repository
public class JournalDaoImpl extends AbstractDao<Integer, Journal> implements JournalDao {

	@Autowired
	private DatatableSortingFilterConstant dataTableUtil;

	@Autowired
	private TransactionCategoryBalanceService transactionCategoryBalanceService;

	@Override
	@Transactional
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				Journal journal = findByPK(id);
				journal.setDeleteFlag(Boolean.TRUE);

				if (journal.getJournalLineItems() != null && !journal.getJournalLineItems().isEmpty()) {
					for (JournalLineItem journalLineItem : journal.getJournalLineItems())
						journalLineItem.setDeleteFlag(Boolean.TRUE);
				}

				update(journal);
				for (JournalLineItem lineItem : journal.getJournalLineItems()) {
					lineItem.setCurrentBalance(transactionCategoryBalanceService.updateRunningBalance(lineItem));
				}
			}
		}
	}

	@Override
	public PaginationResponseModel getJornalList(Map<JournalFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {

		List<DbFilter> dbFilters = new ArrayList<>();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		paginationModel
				.setSortingCol(dataTableUtil.getColName((paginationModel.getSortingCol()), DatatableSortingFilterConstant.JOURNAL));
		PaginationResponseModel resposne = new PaginationResponseModel();
		resposne.setCount(this.getResultCount(dbFilters));
		resposne.setData(this.executeQuery(dbFilters, paginationModel));
		return resposne;
	}
}

package com.simplevat.dao.impl;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.PaginationModel;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.springframework.transaction.annotation.Transactional;

@Repository
public class JournalLineItemDaoImpl extends AbstractDao<Integer, JournalLineItem> implements JournalLineItemDao {

	@Override
	@Transactional
	public void deleteByJournalId(Integer journalId) {
		Query query = getEntityManager().createQuery("DELETE FROM JournalLineItem e WHERE e.journal.id = :journalId ");
		query.setParameter("journalId", journalId);
		query.executeUpdate();
	}

	@Override
	public List<JournalLineItem> getList(LocalDateTime startDate, LocalDateTime endDate,
			PaginationModel paginationModel) {
		TypedQuery<JournalLineItem> query = getEntityManager().createNamedQuery("getListByFrmToDateWthPagintion",
				JournalLineItem.class);
		if (startDate != null) {
			query.setParameter("startDate", startDate);
		}
		if (endDate != null) {
			query.setParameter("endDate", endDate);
		}
//		if (paginationModel != null && paginationModel.getPageNo() != null) {
//			query.setMaxResults(paginationModel.getPageSize());
//			query.setFirstResult(paginationModel.getPageNo());
//		}
		List<JournalLineItem> list = query.getResultList();
		return list != null && list.size() > 0 ? list : null;
	}
}

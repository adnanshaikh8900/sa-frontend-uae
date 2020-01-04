package com.simplevat.dao.impl;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import javax.persistence.Query;
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
}

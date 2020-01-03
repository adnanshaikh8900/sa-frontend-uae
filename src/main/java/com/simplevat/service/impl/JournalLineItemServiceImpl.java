package com.simplevat.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.service.JournalLineItemService;

@Service("JournalLineItemService")
public class JournalLineItemServiceImpl extends JournalLineItemService {

    @Autowired
    private JournalLineItemDao journalLineItemDao;

    @Override
    protected Dao<Integer, JournalLineItem> getDao() {
        return journalLineItemDao;
    }

    @Override
    public void deleteByJournalId(Integer journalId) {
        journalLineItemDao.deleteByJournalId(journalId);
    }

}

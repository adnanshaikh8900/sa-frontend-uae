package com.simplevat.service;

import com.simplevat.entity.JournalLineItem;

public abstract class JournalLineItemService extends SimpleVatService<Integer, JournalLineItem> {

    public abstract void deleteByJournalId(Integer journalId);

}

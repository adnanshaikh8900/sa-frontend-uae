package com.simplevat.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.PaginationModel;

public abstract class JournalLineItemService extends SimpleVatService<Integer, JournalLineItem> {

    public abstract void deleteByJournalId(Integer journalId);

    public abstract List<JournalLineItem> getList(LocalDateTime startDate, LocalDateTime endDate, PaginationModel paginationModel);
}

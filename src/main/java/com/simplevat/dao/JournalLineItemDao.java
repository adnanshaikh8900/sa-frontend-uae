/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.dao;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.PaginationModel;

/**
 *
 * @author daynil
 */
public interface JournalLineItemDao extends Dao<Integer, JournalLineItem> {

	public void deleteByJournalId(Integer journalId);

	public List<JournalLineItem> getList(LocalDateTime startDate, LocalDateTime endDate,
			PaginationModel paginationModel);

}

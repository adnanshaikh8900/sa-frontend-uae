/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.dao;

import com.simplevat.constant.ContactTypeEnum;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.entity.Invoice;
import com.simplevat.model.OverDueAmountDetailsModel;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 *
 * @author daynil
 */
public interface InvoiceDao extends Dao<Integer, Invoice> {

	public PaginationResponseModel getInvoiceList(Map<InvoiceFilterEnum, Object> filterMap,
			PaginationModel paginationModel);

	public List<DropdownModel> getInvoicesForDropdown();

	public void deleteByIds(List<Integer> ids);

	public Invoice getLastInvoice();

	public List<Invoice> getInvoiceList(Date startDate, Date endDate);

	public OverDueAmountDetailsModel getOverDueAmountDetails(Integer type);

	public List<Invoice> getUnpaidInvoice(Integer customerId, ContactTypeEnum type);

	public List<Invoice> getSuggestionUnpaidInvoices(BigDecimal amount, Integer contactId,ContactTypeEnum type);

}
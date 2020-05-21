package com.simplevat.service;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.ContactTypeEnum;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.entity.Invoice;
import com.simplevat.model.OverDueAmountDetailsModel;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

public abstract class InvoiceService extends SimpleVatService<Integer, Invoice> {

	public abstract PaginationResponseModel getInvoiceList(Map<InvoiceFilterEnum, Object> map,
			PaginationModel paginationModel);

	public abstract List<DropdownModel> getInvoicesForDropdown();

	public abstract void deleteByIds(List<Integer> ids);

	public abstract Integer getLastInvoiceNo();

	public abstract List<Invoice> getInvoiceList(int mounthCount);

	public abstract OverDueAmountDetailsModel getOverDueAmountDetails(Integer type);

	public abstract Invoice deleteJournaForInvoice(Invoice invoice);

	public abstract List<Invoice> getUnpaidInvoice(Integer contactId, ContactTypeEnum type);
}
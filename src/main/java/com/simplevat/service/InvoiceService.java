package com.simplevat.service;

import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.entity.Invoice;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

import java.util.List;
import java.util.Map;

public abstract class InvoiceService extends SimpleVatService<Integer, Invoice> {

	public abstract PaginationResponseModel getInvoiceList(Map<InvoiceFilterEnum, Object> map,
			PaginationModel paginationModel);

	public abstract List<DropdownModel> getInvoicesForDropdown();

	public abstract void deleteByIds(List<Integer> ids);

	public abstract Integer getLastInvoiceNo();
}

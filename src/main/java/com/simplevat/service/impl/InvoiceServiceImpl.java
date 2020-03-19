package com.simplevat.service.impl;

import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.entity.Invoice;
import com.simplevat.service.InvoiceService;
import java.util.Map;
import com.simplevat.dao.InvoiceDao;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

@Service("SupplierInvoiceService")
public class InvoiceServiceImpl extends InvoiceService {

	@Autowired
	private InvoiceDao supplierInvoiceDao;

	@Override
	protected Dao<Integer, Invoice> getDao() {
		return supplierInvoiceDao;
	}

	@Override
	public PaginationResponseModel getInvoiceList(Map<InvoiceFilterEnum, Object> map, PaginationModel paginationModel) {
		return supplierInvoiceDao.getInvoiceList(map, paginationModel);
	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		supplierInvoiceDao.deleteByIds(ids);
	}

	@Override
	public List<DropdownModel> getInvoicesForDropdown() {
		return supplierInvoiceDao.getInvoicesForDropdown();
	}

	@Override
	public Integer getLastInvoiceNo() {

		Invoice invoice = supplierInvoiceDao.getLastInvoice();
		if (invoice != null) {
			try {
				return new Integer(invoice.getReferenceNumber()) + 1;
			} catch (Exception e) {
				// TODO: handle exception
				return 0;
			}
		}
		return 0;
	}
}

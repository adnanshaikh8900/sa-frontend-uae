package com.simplevat.dao.impl;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import java.util.List;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.entity.Invoice;
import java.util.ArrayList;
import java.util.Map;

import javax.persistence.TypedQuery;

import org.springframework.transaction.annotation.Transactional;
import com.simplevat.dao.InvoiceDao;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

import net.bytebuddy.asm.Advice.This;

@Repository
public class InvoiceDaoImpl extends AbstractDao<Integer, Invoice> implements InvoiceDao {

	@Override
	public PaginationResponseModel getInvoiceList(Map<InvoiceFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));

		PaginationResponseModel response = new PaginationResponseModel();
		response.setCount(this.getResultCount(dbFilters));
		response.setData(this.executeQuery(dbFilters, paginationModel));
		return response;
	}

	@Override
	public List<DropdownModel> getInvoicesForDropdown() {
		List<DropdownModel> empSelectItemModels = getEntityManager()
				.createNamedQuery("invoiceForDropdown", DropdownModel.class).getResultList();
		return empSelectItemModels;
	}

	@Override
	@Transactional
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				Invoice supplierInvoice = findByPK(id);
				supplierInvoice.setDeleteFlag(Boolean.TRUE);
				update(supplierInvoice);
			}
		}
	}

	 @Override
	public Invoice getLastInvoice() {
		TypedQuery<Invoice> query = getEntityManager().createNamedQuery("lastInvoice", Invoice.class);
		query.setMaxResults(1);
		List<Invoice> invoiceList = query.getResultList();

		return invoiceList != null && invoiceList.size() > 0 ? invoiceList.get(0) : null;
	}
}

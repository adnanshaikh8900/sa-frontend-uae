package com.simplevat.dao.impl;

import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.entity.Invoice;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import javax.persistence.TypedQuery;

import org.springframework.transaction.annotation.Transactional;
import com.simplevat.dao.InvoiceDao;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.utils.DateUtils;

@Repository
public class InvoiceDaoImpl extends AbstractDao<Integer, Invoice> implements InvoiceDao {

	@Autowired
	private DateUtils dateUtil;

	@Autowired
	private DatatableSortingFilterConstant datatableUtil;

	@Override
	public PaginationResponseModel getInvoiceList(Map<InvoiceFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		paginationModel.setSortingCol(datatableUtil.getColName(paginationModel.getSortingCol(), datatableUtil.INVOICE));
		PaginationResponseModel response = new PaginationResponseModel();
		response.setCount(this.getResultCount(dbFilters));
		response.setData(this.executeQuery(dbFilters, paginationModel));
		return response;
	}

	@Override
	public List<DropdownModel> getInvoicesForDropdown() {
		return getEntityManager().createNamedQuery("invoiceForDropdown", DropdownModel.class).getResultList();
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

		return invoiceList != null && invoiceList.isEmpty() ? invoiceList.get(0) : null;
	}

	@Override
	public List<Invoice> getInvoiceList(Date startDate, Date endDate) {
		TypedQuery<Invoice> query = getEntityManager().createNamedQuery("activeInvoicesByDateRange", Invoice.class);
		query.setParameter("startDate", dateUtil.get(startDate));
		query.setParameter("endDate", dateUtil.get(endDate));
		List<Invoice> invoiceList = query.getResultList();
		return invoiceList != null && invoiceList.isEmpty() ? invoiceList : null;
	}
}

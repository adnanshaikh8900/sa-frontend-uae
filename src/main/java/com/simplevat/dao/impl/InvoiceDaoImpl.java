package com.simplevat.dao.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.constant.ContactTypeEnum;
import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.InvoiceDao;
import com.simplevat.dao.JournalDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.model.OverDueAmountDetailsModel;
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

	@Autowired
	private JournalDao journalDao;

	@Autowired
	private JournalLineItemDao journalLineItemDao;

	@Override
	public PaginationResponseModel getInvoiceList(Map<InvoiceFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {
		List<DbFilter> dbFilters = new ArrayList<>();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		paginationModel.setSortingCol(
				datatableUtil.getColName(paginationModel.getSortingCol(), DatatableSortingFilterConstant.INVOICE));
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
				// find journal related to invoice and delete
				Map<String, Object> param = new HashMap<>();
				param.put("referenceType", PostingReferenceTypeEnum.INVOICE);
				param.put("referenceId", id);
				param.put("deleteFlag", false);
				List<JournalLineItem> lineItemList = journalLineItemDao.findByAttributes(param);

				if (lineItemList != null && !lineItemList.isEmpty()) {
					List<Integer> list = new ArrayList<>();
					list.add(lineItemList.get(0).getJournal().getId());
					journalDao.deleteByIds(list);
				}
				update(supplierInvoice);
			}
		}
	}

	@Override
	public Invoice getLastInvoice() {
		TypedQuery<Invoice> query = getEntityManager().createNamedQuery("lastInvoice", Invoice.class);
		query.setMaxResults(1);
		List<Invoice> invoiceList = query.getResultList();

		return invoiceList != null && !invoiceList.isEmpty() ? invoiceList.get(0) : null;
	}

	@Override
	public List<Invoice> getInvoiceList(Date startDate, Date endDate) {
		TypedQuery<Invoice> query = getEntityManager().createNamedQuery("activeInvoicesByDateRange", Invoice.class);
		query.setParameter("startDate", dateUtil.get(startDate));
		query.setParameter("endDate", dateUtil.get(endDate));
		List<Invoice> invoiceList = query.getResultList();
		return invoiceList != null && !invoiceList.isEmpty() ? invoiceList : null;
	}

	@Override
	public OverDueAmountDetailsModel getOverDueAmountDetails(Integer type) {

		TypedQuery<BigDecimal> query = getEntityManager().createNamedQuery("overDueAmount", BigDecimal.class);
		query.setParameter("type", type);
		query.setMaxResults(1);

		BigDecimal overDueAmount = query.getSingleResult();
		Float overDueAmountFloat = (float) 0;
		if (overDueAmount != null)
			overDueAmountFloat = overDueAmount.floatValue();
		Date date = new Date();

		Date startDate = DateUtils.getStartDate(DateUtils.Duration.THIS_WEEK, TimeZone.getDefault(), date);
		Date endDate = DateUtils.getEndDate(DateUtils.Duration.THIS_WEEK, TimeZone.getDefault(), date);
		Float overDueAmountWeeklyFloat = getOverDueAmountWeeklyMonthly(type, startDate, endDate);

		startDate = DateUtils.getStartDate(DateUtils.Duration.THIS_MONTH, TimeZone.getDefault(), date);
		endDate = DateUtils.getEndDate(DateUtils.Duration.THIS_MONTH, TimeZone.getDefault(), date);
		Float overDueAmountMonthlyFloat = getOverDueAmountWeeklyMonthly(type, startDate, endDate);

		return new OverDueAmountDetailsModel(overDueAmountFloat, overDueAmountWeeklyFloat, overDueAmountMonthlyFloat);
	}

	private Float getOverDueAmountWeeklyMonthly(Integer type, Date startDate, Date endDate) {

		TypedQuery<BigDecimal> query = getEntityManager().createNamedQuery("overDueAmountWeeklyMonthly",
				BigDecimal.class);
		query.setParameter("type", type);
		query.setParameter("startDate", dateUtil.get(startDate));
		query.setParameter("endDate", dateUtil.get(endDate));
		query.setMaxResults(1);

		BigDecimal overDueAmountMonthly = query.getSingleResult();
		Float overDueAmountFloat = (float) 0;
		if (overDueAmountMonthly != null)
			overDueAmountFloat = overDueAmountMonthly.floatValue();
		return overDueAmountFloat;
	}

	@Override
	public List<Invoice> getUnpaidInvoice(Integer contactId, ContactTypeEnum type) {
		TypedQuery<Invoice> query = getEntityManager().createNamedQuery("unpaidInvoices", Invoice.class);
		query.setParameter("status", InvoiceStatusEnum.PARTIALLY_PAID.getValue());
		query.setParameter("id", contactId);
		query.setParameter("type", type.getValue());
		List<Invoice> invoiceList = query.getResultList();
		return invoiceList != null && !invoiceList.isEmpty() ? invoiceList : null;
	}
}
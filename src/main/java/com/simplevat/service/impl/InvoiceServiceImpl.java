package com.simplevat.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.ContactTypeEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.InvoiceDao;
import com.simplevat.dao.JournalDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.model.OverDueAmountDetailsModel;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.invoicecontroller.InvoiceRestController;
import com.simplevat.service.InvoiceService;
import com.simplevat.utils.ChartUtil;
import com.simplevat.utils.DateUtils;

@Service("SupplierInvoiceService")
public class InvoiceServiceImpl extends InvoiceService {
	private final Logger logger = LoggerFactory.getLogger(InvoiceRestController.class);

	@Autowired
	private InvoiceDao supplierInvoiceDao;

	@Autowired
	ChartUtil util;

	@Autowired
	DateUtils dateUtils;

	@Autowired
	private JournalDao journalDao;

	@Autowired
	private JournalLineItemDao journalLineItemDao;

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
				return 0;
			}
		}
		return 1;
	}

	@Override
	public List<Invoice> getInvoiceList(int mounthCount) {
		return supplierInvoiceDao.getInvoiceList(util.getStartDate(Calendar.MONTH, -mounthCount).getTime(),
				util.getEndDate().getTime());

	}

	/**
	 * @author zain/Muzammil for getting overdueamount created on:28/03/2020
	 * 
	 * @param @see com.simplevat.constant.ContactTypeEnum
	 * 
	 * 
	 */

	@Override
	public OverDueAmountDetailsModel getOverDueAmountDetails(Integer type) {

		OverDueAmountDetailsModel overDueAmountDetails = supplierInvoiceDao.getOverDueAmountDetails(type);
		return overDueAmountDetails;
	}

	/**
	 * @author $@urabh for deleting journal belongs to invoice created on:15/05/2020
	 */
	@Override
	public Invoice deleteJournaForInvoice(Invoice invoice) {

		try {
			// find journal related to invoice and delete
			Map<String, Object> param = new HashMap<>();
			param.put("referenceType", PostingReferenceTypeEnum.INVOICE);
			param.put("referenceId", invoice.getId());
			param.put("deleteFlag", false);
			List<JournalLineItem> lineItemList = journalLineItemDao.findByAttributes(param);

			if (lineItemList != null && !lineItemList.isEmpty()) {
				List<Integer> list = new ArrayList<>();
				list.add(lineItemList.get(0).getJournal().getId());
				journalDao.deleteByIds(list);
			}

		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return invoice;
	}

	/**
	 * @author $@urabh : get invoice based on status created on:20/05/2020
	 * @param @see InvoiceStatusEnum
	 * @return list invoiceList
	 */
	@Override
	public List<Invoice> getUnpaidInvoice(Integer contactId,ContactTypeEnum type) {
		return supplierInvoiceDao.getUnpaidInvoice(contactId,type);
	}
	
	/**
	 * @author $@urabh : get invoice suggestion for transaction explanation created on:28/05/2020
	 * @param InvoiceStatusEnum type
	 * @param BigDecimal amount 
	 * @return list invoiceList
	 */
	@Override
	public List<Invoice> getSuggestionUnpaidInvoices(BigDecimal amount,ContactTypeEnum type) {
		return supplierInvoiceDao.getSuggestionUnpaidInvoices(amount,type);
	}
}
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
import com.simplevat.dao.CustomerInvoiceReceiptDao;
import com.simplevat.dao.Dao;
import com.simplevat.dao.InvoiceDao;
import com.simplevat.dao.JournalDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.dao.SupplierInvoicePaymentDao;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.model.OverDueAmountDetailsModel;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.InvoiceService;
import com.simplevat.utils.ChartUtil;
import com.simplevat.utils.DateUtils;

@Service("SupplierInvoiceService")
public class InvoiceServiceImpl extends InvoiceService {
	private final Logger logger = LoggerFactory.getLogger(InvoiceServiceImpl.class);

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

	@Autowired
	private CustomerInvoiceReceiptDao customerInvoiceReceiptDao;

	@Autowired
	private SupplierInvoicePaymentDao supplierInvoicePaymentDao;

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
	public Integer getLastInvoiceNo(Integer invoiceType) {

		Invoice invoice = supplierInvoiceDao.getLastInvoice(invoiceType);
		if (invoice != null) {
			try {
				String referenceNumber = invoice.getReferenceNumber();
				if(referenceNumber!=null && (referenceNumber.contains("INV")||referenceNumber.contains("SUP")))
					referenceNumber=referenceNumber.substring(referenceNumber.indexOf("-")+1);
				return Integer.valueOf(referenceNumber) + 1;
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
    return supplierInvoiceDao.getOverDueAmountDetails(type);
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
	public List<Invoice> getUnpaidInvoice(Integer contactId, ContactTypeEnum type) {
		return supplierInvoiceDao.getUnpaidInvoice(contactId, type);
	}

	/**
	 * @author $@urabh : get invoice suggestion for transaction explanation created
	 *         on:28/05/2020
	 * @param Integer    contactId
	 * @param BigDecimal amount
	 * @return list invoiceList
	 */
	@Override
	public List<Invoice> getSuggestionInvoices(BigDecimal amount, Integer contactId, ContactTypeEnum type,
			Integer userId) {
		return supplierInvoiceDao.getSuggestionUnpaidInvoices(amount, contactId, type, userId);
	}

	@Override
	public List<Invoice> getSuggestionExplainedInvoices(BigDecimal amount, Integer contactId, ContactTypeEnum type,
											   Integer userId) {
		return supplierInvoiceDao.getSuggestionExplainedInvoices(amount, contactId, type, userId);
	}

	@Override
	public Integer getTotalInvoiceCountByContactId(Integer contactId){
		return supplierInvoiceDao.getTotalInvoiceCountByContactId(contactId);
	}

	@Override
	public Integer getReceiptCountByCustInvoiceId(Integer invoiceId){
		return supplierInvoiceDao.getReceiptCountByCustInvoiceId(invoiceId);

	}
	@Override
	public Integer getReceiptCountBySupInvoiceId(Integer invoiceId){
		return supplierInvoiceDao.getReceiptCountBySupInvoiceId(invoiceId);

	}

}
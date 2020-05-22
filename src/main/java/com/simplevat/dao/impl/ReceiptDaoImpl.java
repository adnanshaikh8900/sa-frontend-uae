package com.simplevat.dao.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.ReceiptFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.CustomerInvoiceReceiptDao;
import com.simplevat.dao.InvoiceDao;
import com.simplevat.dao.JournalDao;
import com.simplevat.dao.JournalLineItemDao;
import com.simplevat.dao.ReceiptDao;
import com.simplevat.entity.CustomerInvoiceReceipt;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.Receipt;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

@Repository
@Transactional
public class ReceiptDaoImpl extends AbstractDao<Integer, Receipt> implements ReceiptDao {

	@Autowired
	private DatatableSortingFilterConstant dataTableUtil;

	@Autowired
	private CustomerInvoiceReceiptDao customerInvoiceReceiptDao;

	@Autowired
	private JournalLineItemDao journalLineItemDao;

	@Autowired
	private JournalDao journalDao;

	@Autowired
	private InvoiceDao invoiceDao;

	@Override
	public PaginationResponseModel getProductList(Map<ReceiptFilterEnum, Object> filterMap,
			PaginationModel paginamtionModel) {
		List<DbFilter> dbFilters = new ArrayList<>();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		paginamtionModel.setSortingCol(
				dataTableUtil.getColName(paginamtionModel.getSortingCol(), DatatableSortingFilterConstant.RECEIPT));
		PaginationResponseModel responseModel = new PaginationResponseModel();
		responseModel.setCount(this.getResultCount(dbFilters));
		responseModel.setData(this.executeQuery(dbFilters, paginamtionModel));
		return responseModel;
	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				Receipt receipt = findByPK(id);

				// Delete middle tabe mapping and update invoice stats as post/partially paid
				List<CustomerInvoiceReceipt> receiptEntryList = customerInvoiceReceiptDao.findForReceipt(id);
				if (receiptEntryList != null && !receiptEntryList.isEmpty()) {
					for (CustomerInvoiceReceipt receiptEntry : receiptEntryList) {
						BigDecimal remainingAmt = receiptEntry.getCustomerInvoice().getTotalAmount()
								.subtract(receipt.getAmount());
						Invoice invoice = receiptEntry.getCustomerInvoice();
						invoice.setStatus(
								remainingAmt.compareTo(BigDecimal.ZERO) == 0 ? InvoiceStatusEnum.POST.getValue()
										: InvoiceStatusEnum.PARTIALLY_PAID.getValue());
						invoiceDao.update(invoice);
						receiptEntry.setDeleteFlag(Boolean.TRUE);
						customerInvoiceReceiptDao.update(receiptEntry);
					}
				}

				// delete related journal
				Map<String, Object> param = new HashMap<>();
				param.put("referenceType", PostingReferenceTypeEnum.RECEIPT);
				param.put("referenceId", id);
				param.put("deleteFlag", false);
				List<JournalLineItem> lineItemList = journalLineItemDao.findByAttributes(param);

				if (lineItemList != null && !lineItemList.isEmpty()) {
					List<Integer> list = new ArrayList<>();
					list.add(lineItemList.get(0).getJournal().getId());
					journalDao.deleteByIds(list);
				}

				// delete receipt
				receipt.setDeleteFlag(Boolean.TRUE);
				update(receipt);
			}
		}
	}

}

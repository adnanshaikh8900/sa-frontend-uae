/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.simplevat.constant.ExpenseStatusEnum;
import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.InvoiceTypeConstant;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.ProductPriceType;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.Expense;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.InvoiceLineItem;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.InvoiceLineItemService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryService;

import io.swagger.annotations.ApiOperation;

/**
 *
 * @author uday
 */
public abstract class AbstractDoubleEntryRestController {

	@Autowired
	TransactionCategoryService abstractDoubleEntryTransactionCategoryService;

	@Autowired
	JournalService journalService;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private InvoiceLineItemService invoiceLineItemService;

	@ApiOperation(value = "Post Journal Entry")
	@PostMapping(value = "/posting")
	public ResponseEntity posting(@RequestBody PostingRequestModel postingRequestModel, HttpServletRequest request) {

		Journal journal = null;

		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		if (postingRequestModel.getPostingRefType().equalsIgnoreCase(PostingReferenceTypeEnum.INVOICE.name())) {
			journal = invoicePosting(postingRequestModel, userId);
		} else if (postingRequestModel.getPostingRefType().equalsIgnoreCase(PostingReferenceTypeEnum.EXPENSE.name())) {
			journal = expensePosting(postingRequestModel, userId);
		}

		if (journal != null) {
			journalService.persist(journal);
		}

		if (postingRequestModel.getPostingRefType().equalsIgnoreCase(PostingReferenceTypeEnum.INVOICE.name())) {
			Invoice invoice = invoiceService.findByPK(postingRequestModel.getPostingRefId());
			invoice.setStatus(InvoiceStatusEnum.POST.getValue());
			invoiceService.persist(invoice);
		} else if (postingRequestModel.getPostingRefType().equalsIgnoreCase(PostingReferenceTypeEnum.EXPENSE.name())) {
			Expense expense = expenseService.findByPK(postingRequestModel.getPostingRefId());
			expense.setStatus(ExpenseStatusEnum.POST.getValue());
			expenseService.persist(expense);
		}

		return null;
	}

	private Journal invoicePosting(PostingRequestModel postingRequestModel, Integer userId) {
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Invoice invoice = invoiceService.findByPK(postingRequestModel.getPostingRefId());

		boolean isCustomerInvoice = InvoiceTypeConstant.isCustomerInvoice(invoice.getType());

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory transactionCategory = abstractDoubleEntryTransactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						isCustomerInvoice ? TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode()
								: TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		if (isCustomerInvoice)
			journalLineItem1.setDebitAmount(postingRequestModel.getAmount());
		else
			journalLineItem1.setCreditAmount(postingRequestModel.getAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.INVOICE);
		journalLineItem1.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		Map<String, Object> param = new HashMap<>();
		param.put("invoice", invoice);
		param.put("deleteFlag", false);

		List<InvoiceLineItem> invoiceLineItemList = invoiceLineItemService.findByAttributes(param);
		Map<Integer, List<InvoiceLineItem>> tnxcatIdInvLnItemMap = new HashMap<>();
		Map<Integer, TransactionCategory> tnxcatMap = new HashMap<>();
		TransactionCategory category = null;
		for (InvoiceLineItem lineItem : invoiceLineItemList) {
			// sales for customer
			// purchase for vendor
			if (isCustomerInvoice)
				category = lineItem.getProduct().getLineItemList().stream()
						.filter(p -> p.getPriceType().equals(ProductPriceType.SALES)).findAny().get()
						.getTransactioncategory();
			else {
				// TODO : need to add transaction category
//				category = lineItem.gettransaction
				category = lineItem.getProduct().getLineItemList().stream()
						.filter(p -> p.getPriceType().equals(ProductPriceType.PURCHASE)).findAny().get()
						.getTransactioncategory();
			}
			tnxcatMap.put(category.getTransactionCategoryId(), category);
			if (tnxcatIdInvLnItemMap.containsKey(category.getTransactionCategoryId())) {
				tnxcatIdInvLnItemMap.get(category.getTransactionCategoryId()).add(lineItem);
			} else {
				List<InvoiceLineItem> dummyInvoiceLineItemList = new ArrayList<>();
				dummyInvoiceLineItemList.add(lineItem);
				tnxcatIdInvLnItemMap.put(category.getTransactionCategoryId(), dummyInvoiceLineItemList);
			}
		}

		for (Integer categoryId : tnxcatIdInvLnItemMap.keySet()) {
			List<InvoiceLineItem> sortedItemList = tnxcatIdInvLnItemMap.get(categoryId);
			BigDecimal totalAmount = BigDecimal.ZERO;
			for (InvoiceLineItem sortedLineItem : sortedItemList) {
				BigDecimal amntWithoutVat = sortedLineItem.getUnitPrice()
						.multiply(BigDecimal.valueOf(sortedLineItem.getQuantity()));
				totalAmount = totalAmount.add(amntWithoutVat);
			}
			JournalLineItem journalLineItem = new JournalLineItem();
			journalLineItem.setTransactionCategory(tnxcatMap.get(categoryId));
			if (isCustomerInvoice)
				journalLineItem.setCreditAmount(totalAmount);
			else
				journalLineItem.setDebitAmount(totalAmount);
			journalLineItem.setReferenceType(PostingReferenceTypeEnum.INVOICE);
			journalLineItem.setReferenceId(postingRequestModel.getPostingRefId());
			journalLineItem.setCreatedBy(userId);
			journalLineItem.setJournal(journal);
			journalLineItemList.add(journalLineItem);

		}

		if (invoice.getTotalVatAmount().compareTo(BigDecimal.ZERO) > 0) {
			JournalLineItem journalLineItem = new JournalLineItem();
			TransactionCategory inputVatCategory = abstractDoubleEntryTransactionCategoryService
					.findTransactionCategoryByTransactionCategoryCode(
							isCustomerInvoice ? TransactionCategoryCodeEnum.INPUT_VAT.getCode()
									: TransactionCategoryCodeEnum.OUTPUT_VAT.getCode());
			journalLineItem.setTransactionCategory(inputVatCategory);
			if (isCustomerInvoice)
				journalLineItem.setCreditAmount(invoice.getTotalVatAmount());
			else
				journalLineItem.setDebitAmount(invoice.getTotalVatAmount());
			journalLineItem.setReferenceType(PostingReferenceTypeEnum.INVOICE);
			journalLineItem.setReferenceId(postingRequestModel.getPostingRefId());
			journalLineItem.setCreatedBy(userId);
			journalLineItem.setJournal(journal);
			journalLineItemList.add(journalLineItem);
		}

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.INVOICE);
		journal.setJournalDate(LocalDateTime.now());

		return journal;
	}

	private Journal expensePosting(PostingRequestModel postingRequestModel, Integer userId) {
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory transactionCategory = abstractDoubleEntryTransactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		journalLineItem1.setDebitAmount(postingRequestModel.getAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journalLineItem1.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		TransactionCategory saleTransactionCategory = abstractDoubleEntryTransactionCategoryService
				.findByPK(postingRequestModel.getPostingChartOfAccountId());
		journalLineItem2.setTransactionCategory(saleTransactionCategory);
		journalLineItem2.setCreditAmount(postingRequestModel.getAmount());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journalLineItem2.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}
}

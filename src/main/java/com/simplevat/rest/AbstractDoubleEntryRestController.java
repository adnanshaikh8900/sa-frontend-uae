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
import com.simplevat.rest.invoicecontroller.InvoiceRestHelper;
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
	private InvoiceRestHelper invoiceRestHelper;

	@ApiOperation(value = "Post Journal Entry")
	@PostMapping(value = "/posting")
	public ResponseEntity posting(@RequestBody PostingRequestModel postingRequestModel, HttpServletRequest request) {

		Journal journal = null;

		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		if (postingRequestModel.getPostingRefType().equalsIgnoreCase(PostingReferenceTypeEnum.INVOICE.name())) {
			journal = invoiceRestHelper.invoicePosting(postingRequestModel, userId);
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

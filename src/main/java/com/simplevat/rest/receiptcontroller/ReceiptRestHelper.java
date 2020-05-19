package com.simplevat.rest.receiptcontroller;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.CustomerInvoiceReceipt;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.Receipt;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PostingRequestModel;
import com.simplevat.service.ContactService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.ReceiptService;
import com.simplevat.service.TransactionCategoryService;

@Component
public class ReceiptRestHelper {

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private ReceiptService receiptService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	public List<ReceiptModel> getListModel(Object receipts) {
		List<ReceiptModel> receiptModelList = new ArrayList<ReceiptModel>();

		if (receipts != null) {
			for (Receipt receipt : (List<Receipt>) receipts) {
				ReceiptModel model = new ReceiptModel();
				model.setReceiptId(receipt.getId());
				model.setAmount(receipt.getAmount());
				// TODO remove once remove from front end list
				model.setUnusedAmount(BigDecimal.ZERO);
				model.setReferenceCode(receipt.getReferenceCode());
				model.setReceiptNo(receipt.getReceiptNo());
				if (receipt.getContact() != null) {
					model.setContactId(receipt.getContact().getContactId());
					model.setCustomerName(
							receipt.getContact().getFirstName() + " " + receipt.getContact().getLastName());
				}
				if (receipt.getInvoice() != null) {
					model.setInvoiceId(receipt.getInvoice().getId());
					model.setInvoiceNumber(receipt.getInvoice().getReferenceNumber());
				}
				if (receipt.getReceiptDate() != null) {
					Date date = Date.from(receipt.getReceiptDate().atZone(ZoneId.systemDefault()).toInstant());
					model.setReceiptDate(date);
				}
				receiptModelList.add(model);
			}
		}
		return receiptModelList;
	}

	public Receipt getEntity(ReceiptRequestModel receiptRequestModel) {
		Receipt receipt = new Receipt();
		if (receiptRequestModel.getReceiptId() != null) {
			receipt = receiptService.findByPK(receiptRequestModel.getReceiptId());
		}
		if (receiptRequestModel.getContactId() != null) {
			receipt.setContact(contactService.findByPK(receiptRequestModel.getContactId()));
		}
		receipt.setAmount(receiptRequestModel.getAmount());
		receipt.setNotes(receiptRequestModel.getNotes());
		receipt.setReceiptNo(receiptRequestModel.getReceiptNo());
		receipt.setReferenceCode(receiptRequestModel.getReferenceCode());
		if (receiptRequestModel.getReceiptDate() != null) {
			LocalDateTime date = Instant.ofEpochMilli(receiptRequestModel.getReceiptDate().getTime())
					.atZone(ZoneId.systemDefault()).withHour(0).withMinute(0).withSecond(0).withNano(0)
					.toLocalDateTime();
			receipt.setReceiptDate(date);
		}
		receipt.setPayMode(receiptRequestModel.getPayMode());
		receipt.setDepositeToTransactionCategory(
				transactionCategoryService.findByPK(receiptRequestModel.getDepositeTo()));
		return receipt;
	}

	public ReceiptRequestModel getRequestModel(Receipt receipt) {
		ReceiptRequestModel model = new ReceiptRequestModel();
		if (receipt.getId() != null) {
			model.setReceiptId(receipt.getId());
		}
		model.setAmount(receipt.getAmount());
		model.setNotes(receipt.getNotes());
		if (receipt.getContact() != null) {
			model.setContactId(receipt.getContact().getContactId());
		}
		if (receipt.getInvoice() != null) {
			model.setInvoiceId(receipt.getInvoice().getId());
		}
		if (receipt.getReceiptDate() != null) {
			Date date = Date.from(receipt.getReceiptDate().atZone(ZoneId.systemDefault()).withHour(0).withMinute(0)
					.withSecond(0).withNano(0).toInstant());
			model.setReceiptDate(date);
		}
		model.setReferenceCode(receipt.getReferenceCode());
		model.setReceiptNo(receipt.getReceiptNo());
		return model;
	}

	public CustomerInvoiceReceipt getCustomerInvoiceReceiptEntity(ReceiptRequestModel receiptRequestModel) {
		CustomerInvoiceReceipt receipt = new CustomerInvoiceReceipt();

		if (receiptRequestModel.getInvoiceId() != null) {
			Invoice invoice = invoiceService.findByPK(receiptRequestModel.getInvoiceId());
			invoice.setStatus(InvoiceStatusEnum.PAID.getValue());
			invoice.setDueAmount(BigDecimal.ZERO);
			receipt.setCustomerInvoice(invoice);
		}
		receipt.setPaidAmount(receiptRequestModel.getAmount());
		receipt.setDeleteFlag(Boolean.FALSE);
		// Update for partial payment
		receipt.setDueAmount(BigDecimal.ZERO);

		return receipt;
	}

	public Journal receiptPosting(PostingRequestModel postingRequestModel, Integer userId,
			TransactionCategory depositeToTransactionCategory) {
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		journalLineItem1.setCreditAmount(postingRequestModel.getAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.RECEIPT);
		journalLineItem1.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();

		journalLineItem2.setTransactionCategory(depositeToTransactionCategory);
		journalLineItem2.setDebitAmount(postingRequestModel.getAmount());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.RECEIPT);
		journalLineItem2.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.RECEIPT);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}
}

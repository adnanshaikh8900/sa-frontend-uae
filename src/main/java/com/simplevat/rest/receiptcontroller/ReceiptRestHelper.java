package com.simplevat.rest.receiptcontroller;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import com.simplevat.rest.invoicecontroller.InvoiceDueAmountModel;
import com.simplevat.service.ContactService;
import com.simplevat.service.CustomerInvoiceReceiptService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.JournalLineItemService;
import com.simplevat.service.ReceiptService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.utils.FileHelper;

@Component
public class ReceiptRestHelper {
	private final Logger logger = LoggerFactory.getLogger(ReceiptRestHelper.class);

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private ReceiptService receiptService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private FileHelper fileHelper;

	@Autowired
	private JournalLineItemService journalLineItemService;

	@Autowired
	private CustomerInvoiceReceiptService customerInvoiceReceiptService;

	public List<ReceiptModel> getListModel(Object receipts) {
		List<ReceiptModel> receiptModelList = new ArrayList<ReceiptModel>();

		if (receipts != null) {
			for (Receipt receipt : (List<Receipt>) receipts) {
				ReceiptModel model = new ReceiptModel();
				model.setReceiptId(receipt.getId());
				model.setAmount(receipt.getAmount());
				model.setUnusedAmount(BigDecimal.ZERO);
				model.setReferenceCode(receipt.getReferenceCode());
				model.setReceiptNo(receipt.getReceiptNo());
				getContact(receipt, model);

				List<CustomerInvoiceReceipt> receiptEntryList = customerInvoiceReceiptService
						.findForReceipt(receipt.getId());
				if (receiptEntryList != null && !receiptEntryList.isEmpty()) {
					List<String> invIdlist = new ArrayList<>();
					for (CustomerInvoiceReceipt receiptEntry : receiptEntryList) {
						invIdlist.add(receiptEntry.getCustomerInvoice().getId().toString());
					}
					model.setInvoiceIdStr(String.join(",", invIdlist));
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

	private void getContact(Receipt receipt, ReceiptModel model) {
		if (receipt.getContact() != null) {
			model.setContactId(receipt.getContact().getContactId());
			model.setCustomerName(receipt.getContact().getFirstName() + " " + receipt.getContact().getLastName());
		}
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
		if (receipt.getReceiptDate() != null) {
			Date date = Date.from(receipt.getReceiptDate().atZone(ZoneId.systemDefault()).withHour(0).withMinute(0)
					.withSecond(0).withNano(0).toInstant());
			model.setReceiptDate(date);
		}
		model.setReferenceCode(receipt.getReferenceCode());
		model.setReceiptNo(receipt.getReceiptNo());
		model.setPayMode(receipt.getPayMode());
		if (receipt.getDepositeToTransactionCategory() != null) {
			model.setDepositeTo(receipt.getDepositeToTransactionCategory().getTransactionCategoryId());
		}
		if (receipt.getReceiptAttachmentFileName() != null) {
			model.setFileName(receipt.getReceiptAttachmentFileName());
		}
		model.setReceiptAttachmentDescription(receipt.getReceiptAttachmentDescription());
		if (receipt.getReceiptAttachmentPath() != null) {
			model.setFilePath("/file/" + fileHelper.convertFilePthToUrl(receipt.getReceiptAttachmentPath()));
		}
		List<CustomerInvoiceReceipt> receiptEntryList = customerInvoiceReceiptService.findForReceipt(receipt.getId());
		if (receiptEntryList != null) {
			model.setPaidInvoiceList(getInvoiceDueAmountList(receiptEntryList));
		}
		return model;

	}

	public List<CustomerInvoiceReceipt> getCustomerInvoiceReceiptEntity(String invoiceDueAmountModelListStr) {
		if (invoiceDueAmountModelListStr != null && ! invoiceDueAmountModelListStr.isEmpty()) {

			ObjectMapper mapper = new ObjectMapper();
			List<InvoiceDueAmountModel> itemModels = null;
			try {
				itemModels = mapper.readValue(invoiceDueAmountModelListStr,
						new TypeReference<List<InvoiceDueAmountModel>>() {
						});
			} catch (IOException ex) {
				logger.error("Error", ex);
			}

			List<CustomerInvoiceReceipt> receiptList = new ArrayList<>();
			for (InvoiceDueAmountModel dueAmountModel : itemModels) {
				CustomerInvoiceReceipt receipt = new CustomerInvoiceReceipt();
				Invoice invoice = invoiceService.findByPK(dueAmountModel.getId());
				invoice.setStatus(dueAmountModel.getDueAmount().equals(dueAmountModel.getPaidAmount())
						? InvoiceStatusEnum.PAID.getValue()
						: InvoiceStatusEnum.PARTIALLY_PAID.getValue());
				receipt.setCustomerInvoice(invoice);
				receipt.setPaidAmount(dueAmountModel.getPaidAmount());
				receipt.setDeleteFlag(Boolean.FALSE);
				receipt.setDueAmount(dueAmountModel.getDueAmount().subtract(dueAmountModel.getPaidAmount()));
				receiptList.add(receipt);
			}
			return receiptList;
		}
		return new ArrayList<>();
	}

	public Journal receiptPosting(PostingRequestModel postingRequestModel, Integer userId,
			TransactionCategory depositeToTransactionCategory) {
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Map<String, Object> param = new HashMap<>();
		param.put("referenceType", PostingReferenceTypeEnum.RECEIPT);
		param.put("referenceId", postingRequestModel.getPostingRefId());
		param.put("deleteFlag", false);
		journalLineItemList = journalLineItemService.findByAttributes(param);

		Journal journal = journalLineItemList != null && journalLineItemList.size() > 0
				? journalLineItemList.get(0).getJournal()
				: new Journal();
		JournalLineItem journalLineItem1 = journal.getJournalLineItems() != null
				&& journal.getJournalLineItems().size() > 0 ? journalLineItemList.get(0) : new JournalLineItem();
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

		JournalLineItem journalLineItem2 = journal.getJournalLineItems() != null
				&& journal.getJournalLineItems().size() > 0 ? journalLineItemList.get(1) : new JournalLineItem();
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

	private List<InvoiceDueAmountModel> getInvoiceDueAmountList(List<CustomerInvoiceReceipt> receiptList) {

		if (receiptList != null && !receiptList.isEmpty()) {
			List<InvoiceDueAmountModel> modelList = new ArrayList<>();
			for (CustomerInvoiceReceipt customerInvoiceReceipt : receiptList) {
				Invoice invoice = customerInvoiceReceipt.getCustomerInvoice();
				InvoiceDueAmountModel model = new InvoiceDueAmountModel();

				model.setId(invoice.getId());
				model.setDueAmount(invoice.getDueAmount() != null ? invoice.getDueAmount() : invoice.getTotalAmount());
				if (invoice.getInvoiceDate() != null) {
					Date date = Date.from(invoice.getInvoiceDate().atZone(ZoneId.systemDefault()).toInstant());
					model.setDate(date);
				}
				if (invoice.getInvoiceDueDate() != null) {
					Date date = Date.from(invoice.getInvoiceDueDate().atZone(ZoneId.systemDefault()).toInstant());
					model.setDueDate(date);
				}
				model.setReferenceNo(invoice.getReferenceNumber());
				model.setTotalAount(invoice.getTotalAmount());

				modelList.add(model);
			}
			return modelList;
		}

		return new ArrayList<>();
	}
	
	public Journal paymentPosting(PostingRequestModel postingRequestModel, Integer userId,
			TransactionCategory depositeToTransactionCategory) {
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Map<String, Object> param = new HashMap<>();
		param.put("referenceType", PostingReferenceTypeEnum.PAYMENT);
		param.put("referenceId", postingRequestModel.getPostingRefId());
		param.put("deleteFlag", false);
		journalLineItemList = journalLineItemService.findByAttributes(param);

		Journal journal = journalLineItemList != null && journalLineItemList.size() > 0
				? journalLineItemList.get(0).getJournal()
				: new Journal();
		JournalLineItem journalLineItem1 = journal.getJournalLineItems() != null
				&& journal.getJournalLineItems().size() > 0 ? journalLineItemList.get(0) : new JournalLineItem();
		TransactionCategory transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		journalLineItem1.setDebitAmount(postingRequestModel.getAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.PAYMENT);
		journalLineItem1.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = journal.getJournalLineItems() != null
				&& journal.getJournalLineItems().size() > 0 ? journalLineItemList.get(1) : new JournalLineItem();
		journalLineItem2.setTransactionCategory(depositeToTransactionCategory);
		journalLineItem2.setCreditAmount(postingRequestModel.getAmount());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.PAYMENT);
		journalLineItem2.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.PAYMENT);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

}

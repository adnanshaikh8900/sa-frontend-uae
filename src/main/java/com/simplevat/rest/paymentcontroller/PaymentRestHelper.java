package com.simplevat.rest.paymentcontroller;

import java.io.IOException;
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
import com.simplevat.constant.FileTypeEnum;
import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.CustomerInvoiceReceipt;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.Payment;
import com.simplevat.entity.SupplierInvoicePayment;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PostingRequestModel;
import com.simplevat.rest.invoicecontroller.InvoiceDueAmountModel;
import com.simplevat.rest.receiptcontroller.ReceiptRequestModel;
import com.simplevat.service.ContactService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.JournalLineItemService;
import com.simplevat.service.SupplierInvoicePaymentService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.utils.FileHelper;

@Component
public class PaymentRestHelper {

	private final Logger logger = LoggerFactory.getLogger(PaymentRestHelper.class);

	@Autowired
	private ContactService contactService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private FileHelper fileHelper;

	@Autowired
	private JournalLineItemService journalLineItemService;

	@Autowired
	private SupplierInvoicePaymentService supplierInvoicePaymentService;

	@Autowired
	private InvoiceService invoiceService;

	public Payment convertToPayment(PaymentPersistModel paymentModel) throws IOException {
		Payment payment = new Payment();
		if (paymentModel.getPaymentId() != null) {
			payment.setPaymentId(paymentModel.getPaymentId());
		}
		if (paymentModel.getPaymentDate() != null) {
			LocalDateTime paymentDate = Instant.ofEpochMilli(paymentModel.getPaymentDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			payment.setPaymentDate(paymentDate);
		}
		payment.setPaymentNo(paymentModel.getPaymentNo());
		payment.setReferenceNo(paymentModel.getReferenceNo());

		if (paymentModel.getContactId() != null) {
			payment.setSupplier(contactService.findByPK(paymentModel.getContactId()));
		}
		payment.setInvoiceAmount(paymentModel.getAmount());
		payment.setPayMode(paymentModel.getPayMode());
		payment.setDepositeToTransactionCategory(transactionCategoryService.findByPK(paymentModel.getDepositeTo()));
		payment.setNotes(paymentModel.getNotes());
		if (paymentModel.getAttachmentFile() != null && !paymentModel.getAttachmentFile().isEmpty()) {
			String filePath = fileHelper.saveFile(paymentModel.getAttachmentFile(), FileTypeEnum.PAYMENT);
			payment.setAttachmentFileName(paymentModel.getAttachmentFile().getOriginalFilename());
			payment.setAttachmentPath(filePath);
		}
		return payment;
	}

	public PaymentViewModel convertToPaymentViewModel(Payment payment) {
		PaymentViewModel paymentModel = new PaymentViewModel();
		paymentModel.setPaymentId(payment.getPaymentId());
		paymentModel.setInvoiceAmount(payment.getInvoiceAmount());
		if (payment.getBankAccount() != null) {
			paymentModel.setBankName(payment.getBankAccount().getBankAccountName());
		}
		if (payment.getSupplier() != null && (payment.getSupplier().getFirstName() != null
				|| payment.getSupplier().getMiddleName() != null || payment.getSupplier().getLastName() != null)) {
			paymentModel.setSupplierName(payment.getSupplier().getFirstName() + " "
					+ payment.getSupplier().getMiddleName() + " " + payment.getSupplier().getLastName());
		}

		List<SupplierInvoicePayment> receiptEntryList = supplierInvoicePaymentService
				.findForPayment(payment.getPaymentId());
		if (receiptEntryList != null && !receiptEntryList.isEmpty()) {
			List<String> invIdlist = new ArrayList<>();
			for (SupplierInvoicePayment receiptEntry : receiptEntryList) {
				invIdlist.add(receiptEntry.getSupplierInvoice().getId().toString());
			}
			paymentModel.setInvoiceReferenceNo(String.join(",", invIdlist));
		}
		if (payment.getPaymentDate() != null) {
			Date paymentDate = Date.from(payment.getPaymentDate().atZone(ZoneId.systemDefault()).toInstant());
			paymentModel.setPaymentDate(paymentDate);
		}
		paymentModel.setDescription(payment.getDescription());
		paymentModel.setDeleteFlag(payment.getDeleteFlag());
		return paymentModel;
	}

	public PaymentPersistModel convertToPaymentPersistModel(Payment payment) {
		PaymentPersistModel paymentModel = new PaymentPersistModel();
		paymentModel.setPaymentId(payment.getPaymentId());

		if (payment.getPaymentDate() != null) {
			Date paymentDate = Date.from(payment.getPaymentDate().atZone(ZoneId.systemDefault()).toInstant());
			paymentModel.setPaymentDate(paymentDate);
		}
		paymentModel.setPaymentNo(payment.getPaymentNo());
		paymentModel.setReferenceNo(payment.getReferenceNo());

		if (payment.getSupplier() != null) {
			paymentModel.setContactId(payment.getSupplier().getContactId());
		}
		paymentModel.setAmount(payment.getInvoiceAmount());
		paymentModel.setPayMode(payment.getPayMode());
		paymentModel.setDepositeTo(payment.getDepositeToTransactionCategory().getTransactionCategoryId());
		paymentModel.setDepositeToLabel(
				payment.getDepositeToTransactionCategory().getChartOfAccount().getChartOfAccountName());
		paymentModel.setNotes(paymentModel.getNotes());
		paymentModel.setDeleteFlag(payment.getDeleteFlag());
		paymentModel.setFileName(payment.getAttachmentFileName());
		paymentModel.setAttachmentDescription(payment.getAttachmentDescription());
		if (payment.getAttachmentPath() != null) {
			paymentModel.setFilePath("/file/" + fileHelper.convertFilePthToUrl(payment.getAttachmentPath()));
		}
		List<SupplierInvoicePayment> receiptEntryList = supplierInvoicePaymentService
				.findForPayment(payment.getPaymentId());
		if (receiptEntryList != null) {
			paymentModel.setPaidInvoiceList(getInvoiceDueAmountList(receiptEntryList));
		}
		return paymentModel;
	}

	public List<SupplierInvoicePayment> getSupplierInvoicePaymentEntity(PaymentPersistModel paymentPersistModel) {
		if (paymentPersistModel.getPaidInvoiceListStr() != null
				&& !paymentPersistModel.getPaidInvoiceListStr().isEmpty()) {

			ObjectMapper mapper = new ObjectMapper();
			try {
				List<InvoiceDueAmountModel> itemModels = mapper.readValue(paymentPersistModel.getPaidInvoiceListStr(),
						new TypeReference<List<InvoiceDueAmountModel>>() {
						});
				paymentPersistModel.setPaidInvoiceList(itemModels);
			} catch (IOException ex) {
				logger.error("Error", ex);
			}

			List<SupplierInvoicePayment> receiptList = new ArrayList<>();
			for (InvoiceDueAmountModel dueAmountModel : paymentPersistModel.getPaidInvoiceList()) {
				SupplierInvoicePayment receipt = new SupplierInvoicePayment();
				Invoice invoice = invoiceService.findByPK(dueAmountModel.getId());
				invoice.setStatus(dueAmountModel.getDueAmount().equals(dueAmountModel.getPaidAmount())
						? InvoiceStatusEnum.PAID.getValue()
						: InvoiceStatusEnum.PARTIALLY_PAID.getValue());
				receipt.setSupplierInvoice(invoice);
				receipt.setPaidAmount(dueAmountModel.getPaidAmount());
				receipt.setDeleteFlag(Boolean.FALSE);
				receipt.setDueAmount(dueAmountModel.getDueAmount().subtract(dueAmountModel.getPaidAmount()));
				receiptList.add(receipt);
			}
			return receiptList;
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

	private List<InvoiceDueAmountModel> getInvoiceDueAmountList(List<SupplierInvoicePayment> receiptList) {

		if (receiptList != null && !receiptList.isEmpty()) {
			List<InvoiceDueAmountModel> modelList = new ArrayList<>();
			for (SupplierInvoicePayment supplierInvoiceReceipt : receiptList) {
				Invoice invoice = supplierInvoiceReceipt.getSupplierInvoice();
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
}

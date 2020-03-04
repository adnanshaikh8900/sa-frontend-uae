package com.simplevat.rest.receiptcontroller;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.entity.Receipt;
import com.simplevat.service.ContactService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.ReceiptService;

@Component
public class ReceiptRestHelper {

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private ReceiptService receiptService;

	public List<ReceiptModel> getListModel(Object receipts) {
		List<ReceiptModel> receiptModelList = new ArrayList<ReceiptModel>();

		if (receipts != null) {
			for (Receipt receipt : (List<Receipt>) receipts) {
				ReceiptModel model = new ReceiptModel();
				model.setReceiptId(receipt.getId());
				model.setAmount(receipt.getAmount());
				model.setUnusedAmount(receipt.getUnusedAmount());
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
		if (receiptRequestModel.getInvoiceId() != null) {
			receipt.setInvoice(invoiceService.findByPK(receiptRequestModel.getInvoiceId()));
		}
		receipt.setAmount(receiptRequestModel.getAmount());
		receipt.setUnusedAmount(receiptRequestModel.getUnusedAmount());
		receipt.setReceiptNo(receiptRequestModel.getReceiptNo());
		receipt.setReferenceCode(receiptRequestModel.getReferenceCode());
		if (receiptRequestModel.getReceiptDate() != null) {
			LocalDateTime date = Instant.ofEpochMilli(receiptRequestModel.getReceiptDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			receipt.setReceiptDate(date);
		}
		return receipt;
	}

	public ReceiptRequestModel getRequestModel(Receipt receipt) {
		ReceiptRequestModel model = new ReceiptRequestModel();
		if (receipt.getId() != null) {
			model.setReceiptId(receipt.getId());
		}
		model.setAmount(receipt.getAmount());
		model.setUnusedAmount(receipt.getUnusedAmount());
		if (receipt.getContact() != null) {
			model.setContactId(receipt.getContact().getContactId());
		}
		if (receipt.getInvoice() != null) {
			model.setInvoiceId(receipt.getInvoice().getId());
		}
		if (receipt.getReceiptDate() != null) {
			Date date = Date.from(receipt.getReceiptDate().atZone(ZoneId.systemDefault()).toInstant());
			model.setReceiptDate(date);
		}
		model.setReferenceCode(receipt.getReferenceCode());
		model.setReceiptNo(receipt.getReceiptNo());
		return model;
	}
}

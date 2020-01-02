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

@Component
public class ReceiptRestHelper {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private ContactService contactService;

    public List<ReceiptModel> getListModel(List<Receipt> receipts) {

        if (receipts != null && receipts.size() > 0) {
            List<ReceiptModel> receiptModelList = new ArrayList<ReceiptModel>();
            for (Receipt receipt : receipts) {
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
            return receiptModelList;
        }

        return null;
    }

    public Receipt getEntity(ReceiptRequestModel receiptRequestModel) {

        if (receiptRequestModel != null) {
            Receipt receipt = new Receipt();
            if (receiptRequestModel.getId() != null) {
                receipt = new Receipt();
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
            receipt.setReferenceCode(receiptRequestModel.getReceiptReferenceCode());
            if (receiptRequestModel.getReceiptDate() != null) {
                LocalDateTime date = Instant.ofEpochMilli(receiptRequestModel.getReceiptDate().getTime())
                        .atZone(ZoneId.systemDefault()).toLocalDateTime();
                receipt.setReceiptDate(date);
            }

            return receipt;
        }
        return null;
    }

}

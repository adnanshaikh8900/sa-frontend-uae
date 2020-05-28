package com.simplevat.rest.receiptcontroller;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.simplevat.constant.PayMode;
import com.simplevat.rest.invoicecontroller.InvoiceDueAmountModel;

import lombok.Data;

@Data
public class ReceiptRequestModel {

	private Integer receiptId;
	private Date receiptDate;
	private String receiptNo; // payment filed from ui
	private String referenceCode; // reference number
	private Integer contactId; // customer details
	private BigDecimal amount;

	// New
	private PayMode payMode;
	private Integer depositeTo;// transaction category Id
	private String notes;
	private MultipartFile attachmentFile;
	private String fileName;
	private String filePath;
	private String receiptAttachmentDescription;
	/** @see InvoiceDueAmountModel */
	private String paidInvoiceListStr;
	private List<InvoiceDueAmountModel> paidInvoiceList;

}

package com.simplevat.rest.paymentcontroller;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.simplevat.constant.PayMode;
import com.simplevat.rest.invoicecontroller.InvoiceDueAmountModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentPersistModel {
//    private Integer paymentId;
//    private Integer bankAccountId;
//    private Integer contactId;
//    private Integer currencyCode;
//    private Integer projectId;
//    private Date paymentDate;
//    private String description;
	private Boolean deleteFlag;

	private Integer paymentId;
	private Date paymentDate;
	private String paymentNo; // payment filed from ui
	private String referenceNo; // reference number
	private Integer contactId; // customer details
	private BigDecimal amount;

// New
	private PayMode payMode;
	private Integer depositeTo;// transaction category Id
	private String depositeToLabel;
	private String notes;
	private MultipartFile attachmentFile;
	private String fileName;
	private String filePath;
	private String attachmentDescription;
	/** {@see InvoiceDueAmountModel} */
	private String paidInvoiceListStr;
	private List<InvoiceDueAmountModel> paidInvoiceList;
}

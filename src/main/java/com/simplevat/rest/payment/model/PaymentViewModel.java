package com.simplevat.rest.payment.model;

import java.math.BigDecimal;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentViewModel {

    private Integer paymentId;
    private String supplierName;
    private String invoiceReferenceNo;
    private BigDecimal amount;
    private String bankName;
    private Date paymentDate;
    private Date paymentDueDate;
    private String description;
    private String receiptNo;
    private String receiptAttachmentDescription;
    private String receiptAttachmentPath;
    private Boolean deleteFlag;
}

package com.simplevat.rest.payment.model;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentViewModel {

    private Integer paymentId;
    private String paymentNo;
    private String referenceNo;
    private String invoiceNo;
    private String bankName;
    private Integer amount;
    private Date paymentDate;
    private Date paymentDueDate;
    private String description;
    private String receiptNo;
    private String receiptAttachmentDescription;
    private String receiptAttachmentPath;
    private Boolean deleteFlag;
}

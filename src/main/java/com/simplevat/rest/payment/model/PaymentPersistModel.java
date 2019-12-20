package com.simplevat.rest.payment.model;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class PaymentPersistModel {

    private Integer paymentId;
    private Integer bankAccountId;
    private Integer supplierId;
    private String invoiceReferenceNo;
    private Integer amount;
    private Date paymentDate;
    private Integer currencyCode;
    private Integer projectId;
    private Date paymentDueDate;
    private String description;
    private String receiptNo;
    private MultipartFile attachmentFile;
    private String receiptAttachmentDescription;
    private Boolean deleteFlag;
}

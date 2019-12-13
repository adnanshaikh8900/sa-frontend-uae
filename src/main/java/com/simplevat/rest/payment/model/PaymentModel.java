package com.simplevat.rest.payment.model;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class PaymentModel {

    private Integer paymentId;
    private Integer supplierId;
    private Integer invoiceId;
    private Date paymentDate;
    private Integer currencyCode;
    private Integer projectId;
    private Date paymentDueDate;
    private String description;
    private String receiptNo;
    private String receiptAttachmentPath;
    private String receiptAttachmentDescription;
    private MultipartFile attachmentFile;
    private Boolean deleteFlag;
}

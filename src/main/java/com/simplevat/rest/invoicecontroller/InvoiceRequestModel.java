package com.simplevat.rest.invoicecontroller;

import com.simplevat.constant.DiscountType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class InvoiceRequestModel {

    private Integer invoiceId;
    private String referenceNumber;
    private Integer projectId;
    private Integer contactId;
    private Date invoiceDate;
    private Date invoiceDueDate;
    private Integer currencyCode;
    private String contactPoNumber;    
    private MultipartFile attachmentFile;
    private String receiptAttachmentDescription;
    private String receiptNumber;
    private String notes;
    private BigDecimal totalAmount;
    private BigDecimal totalVatAmount;
    private String lineItemsString;
    private String type;
    private String taxIdentificationNumber;
    private List<InvoiceLineItemModel> invoiceLineItems;
    private String status;
    private String fileName;
    private String filePath;
    
    private DiscountType discountType;
    private BigDecimal discount;
    private double discountPercentage;
    private Integer createdBy;
    private LocalDateTime createdDate;
    private Integer lastUpdatedBy;
    private LocalDateTime lastUpdateDate;
    private Boolean deleteFlag = Boolean.FALSE;
    private Boolean active;
    private Integer versionNumber;
}

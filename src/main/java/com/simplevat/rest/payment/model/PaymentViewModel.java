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
    private BigDecimal invoiceAmount;
    private String invoiceReferenceNo;
    private String bankName;
    private Date paymentDate;
    private String description;
    private Boolean deleteFlag;
}

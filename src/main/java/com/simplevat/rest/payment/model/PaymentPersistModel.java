package com.simplevat.rest.payment.model;

import java.math.BigDecimal;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentPersistModel {

    private Integer paymentId;
    private Integer bankAccountId;
    private Integer supplierId;
    private Integer invoiceId;
    private BigDecimal invoiceAmount;
    private Integer currencyCode;
    private Integer projectId;
    private Date paymentDate;
    private String description;
    private Boolean deleteFlag;
}

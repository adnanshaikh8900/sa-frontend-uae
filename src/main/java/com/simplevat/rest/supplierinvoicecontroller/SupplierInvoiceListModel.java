package com.simplevat.rest.supplierinvoicecontroller;

import java.math.BigDecimal;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierInvoiceListModel {

    private Integer id;
    private String status;
    private String customerName;
    private String referenceNumber;
    private Date invoiceDate;
    private Date invoiceDueDate;
    private BigDecimal totalAmount;
    private BigDecimal totalVatAmount;
    
}

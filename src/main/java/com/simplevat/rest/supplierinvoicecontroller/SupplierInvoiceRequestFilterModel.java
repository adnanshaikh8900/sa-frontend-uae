/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.supplierinvoicecontroller;

import com.simplevat.rest.PaginationModel;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

/**
 *
 * @author ashish
 */
@Data
public class SupplierInvoiceRequestFilterModel extends PaginationModel {

    private String customerName;
    private String referenceNumber;
    private Date invoiceDate;
    private Date invoiceDueDate;
    private BigDecimal amount;
    private String status;
}

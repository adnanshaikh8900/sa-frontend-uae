/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.constant.dbfilter;

import lombok.Getter;

/**
 *
 * @author ashish
 */
public enum SupplierInvoiceFilterEnum {
    CUSTOMER_NAME("contact.firstName"),
    INVOICE_NUMBER("referenceNumber"),
    INVOICE_DATE("invoiceDate"),
    INVOICE_DUE_DATE("invoiceDueDate"),
    STATUS("status"),
    PAGE_NUMBER("pageNo"),
    PAGE_SIZE("pageSize"),
    USER_ID("createdBy");

    @Getter
    String dbColumnName;

    private SupplierInvoiceFilterEnum(String dbColumnName) {
        this.dbColumnName = dbColumnName;
    }
}

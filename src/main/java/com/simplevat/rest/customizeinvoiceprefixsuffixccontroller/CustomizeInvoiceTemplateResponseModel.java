package com.simplevat.rest.customizeinvoiceprefixsuffixccontroller;


import lombok.Data;

@Data
public class CustomizeInvoiceTemplateResponseModel {
    private Integer invoiceId;
    private String invoicePrefix;
    private Integer invoiceSuffix;
    private Integer invoiceType;
}

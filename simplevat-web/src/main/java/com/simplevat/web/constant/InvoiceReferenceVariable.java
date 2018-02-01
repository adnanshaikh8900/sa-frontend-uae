/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.web.constant;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author HP
 */
public enum InvoiceReferenceVariable {

    INVOICE_REFERENCE_NUMBER("Invoice Reference Number", "{invoiceReferenceNumber}"),
    INVOICE_DATE("Invoice Date", "{invoiceDate}"),
    INVOICE_DUE_DATE("Invoice Due Date", "{invoiceDueDate}"),
    INVOICE_DISCOUNT("Invoice Discount", "{invoiceDiscount}"),
    CONTRACT_PO_NUMBER("contract Po Number", "{contractPoNumber}"),
    CONTRACT_NAME("Contact Name", "{contactName}"),
    PROJECT_NAME("Project Name", "{projectName}"),
    INVOICE_AMOUNT("Invoice Amount", "{invoiceAmount}"),
    DUE_DATE("Due Amount", "{dueAmount}"),
    SENDER_NAME("Sender Name", "{senderName}"),
    COMPANY_NAME("Company Name", "{companyName}"),
    INVOICE_CURRENCY_SYMBOL("Invoice Currency Symbol", "{invoiceCurrencySymbol}");

    private String name;
    private String value;

    private InvoiceReferenceVariable(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public static List<InvoiceReferenceVariable> getInvoiceReferenceVariables() {
        List<InvoiceReferenceVariable> referenceVariables = new ArrayList<>();
        for (InvoiceReferenceVariable invoiceReferenceVariable : values()) {
            referenceVariables.add(invoiceReferenceVariable);
        }
        return referenceVariables;
    }

//      invoiceVariableList.add("{invoiceReferenceNumber}");
//        invoiceVariableList.add("{invoiceDate}");
//        invoiceVariableList.add("{invoiceDueDate}");
//        invoiceVariableList.add("{invoiceDiscount}");
//        invoiceVariableList.add("{contractPoNumber}");
//        invoiceVariableList.add("{contactName}");
//        invoiceVariableList.add("{projectName}");
//        invoiceVariableList.add("{invoiceAmount}");
//        invoiceVariableList.add("{dueAmount}");
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

}

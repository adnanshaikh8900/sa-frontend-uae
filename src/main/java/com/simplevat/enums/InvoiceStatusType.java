/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.enums;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author ashish
 */
public enum InvoiceStatusType {

    PAID("Paid"),
    UNPAID("Unpaid"),
    PARTIALLY_PAID("Partially Paid");

    private String desc;

    InvoiceStatusType(String desc) {
        this.desc = desc;
    }

    public String toString() {
        return name();
    }

    public String getDesc() {
        return desc;
    }

    public static List<InvoiceStatusType> invoiceStatusList() {
        List<InvoiceStatusType> statusTypes = new ArrayList<InvoiceStatusType>();
        for (InvoiceStatusType statusType : values()) {
            statusTypes.add(statusType);
        }
        return statusTypes;
    }

}

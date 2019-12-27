package com.simplevat.enums;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Hiren
 */
public enum InvoiceStatusEnum {

    SAVED("Saved"),
    PENDING("Pending"),
    APPROVED("Approved"),
    PARTIALLY_PAID("Partially Paid"),
    PAID("Paid");

    private String desc;

    InvoiceStatusEnum(final String desc) {
        this.desc = desc;
    }

    @Override
    public String toString() {
        return this.desc;
    }

    public String getDesc() {
        return desc;
    }

    public static List<InvoiceStatusEnum> getInvoiceStatusList() {
        List<InvoiceStatusEnum> statusEnums = new ArrayList<InvoiceStatusEnum>();
        for (InvoiceStatusEnum statusEnum : values()) {
            statusEnums.add(statusEnum);
        }
        return statusEnums;
    }
}

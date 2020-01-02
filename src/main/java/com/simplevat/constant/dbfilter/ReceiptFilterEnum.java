package com.simplevat.constant.dbfilter;

import lombok.Getter;

/**
 * @author saurabhg
 */
public enum ReceiptFilterEnum {
    RECEIPT_DATE("receiptDate", "= :receiptDate"),
    INVOICE("invoice", ("= :invoice")),
    CONTACT("contact", "= :contact"),
    REFERENCE_CODE("referenceCode", "= :referenceCode"),
    DELETE("deleteFlag", " = :deleteFlag"),
    USER_ID("createdBy", "= :createdBy");

    @Getter
    String dbColumnName;

    @Getter
    String condition;

    private ReceiptFilterEnum(String dbColumnName) {
        this.dbColumnName = dbColumnName;
    }

    private ReceiptFilterEnum(String dbColumnName, String condition) {
        this.dbColumnName = dbColumnName;
        this.condition = condition;
    }

}

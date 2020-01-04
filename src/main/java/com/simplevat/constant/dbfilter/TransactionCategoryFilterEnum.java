package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum TransactionCategoryFilterEnum {

    TRANSACTION_CATEGORY_CODE("transactionCategoryCode", "= :transactionCategoryCode"),
    TRANSACTION_CATEGORY_NAME("transactionCategoryName", " like CONCAT(:transactionCategoryName,'%')"),
    TRANSACTION_TYPE("transactionType", " = :transactionType"),
    DELETE_FLAG("deleteFlag", " = :deleteFlag"),
    USER_ID("createdBy", "= :createdBy");

    @Getter
    String dbColumnName;

    @Getter
    String condition;

    private TransactionCategoryFilterEnum(String dbColumnName) {
        this.dbColumnName = dbColumnName;
    }

    private TransactionCategoryFilterEnum(String dbColumnName, String condition) {
        this.dbColumnName = dbColumnName;
        this.condition = condition;
    }
}

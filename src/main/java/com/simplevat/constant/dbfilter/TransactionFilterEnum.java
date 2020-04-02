package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum TransactionFilterEnum {
	BANK_ID("bankAccount"," =:bankAccount"),
	TRANSACTION_DATE("transactionDate"," =:transactionDate"),
	CHART_OF_ACCOUNT("chartOfAccount"," =:chartOfAccount"),
	TRANSACTION_STATUS("transactionStatus"," =:transactionStatus"),
    DELETE_FLAG("deleteFlag", " = :deleteFlag"),
    ORDER_BY("transactionId", " = :transactionId"),
    USER_ID("createdBy", "= :createdBy");

    @Getter
    String dbColumnName;

    @Getter
    String condition;

   
    private TransactionFilterEnum(String dbColumnName, String condition) {
        this.dbColumnName = dbColumnName;
        this.condition = condition;
    }


}

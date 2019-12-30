package com.simplevat.rest.transactioncategorycontroller;

import lombok.Data;

@Data
public class TransactionCategoryRequestFilterModel {

    private String transactionCategoryName;
    private String transactionCategoryCode;
    private Integer transactionType;
}

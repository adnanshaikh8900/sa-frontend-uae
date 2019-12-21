/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.constant.dbfilter;

import lombok.Getter;

/**
 *
 * @author uday
 */
public enum ProductFilterEnum {
    PRODUCT_NAME("name"),
    PRODUCT_CODE("productCode"),
    PRODUCT_VAT_PERCENTAGE("vatPercentage"),
    PAGE_NUMBER("pageNo"),
    PAGE_SIZE("pageSize"),
    USER_ID("createdBy");

    @Getter
    String dbColumnName;

    private ProductFilterEnum(String dbColumnName) {
        this.dbColumnName = dbColumnName;
    }
}

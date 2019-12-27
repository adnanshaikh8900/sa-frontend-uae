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
    PRODUCT_NAME("productName", " like CONCAT(:productName,'%')"),
    PRODUCT_CODE("productCode", " like CONCAT(:productCode,'%')"),
    PRODUCT_VAT_PERCENTAGE("vatCategory", " = :vatCategory"),   
    DELETE_FLAG("deleteFlag", " = :deleteFlag"),   
    USER_ID("createdBy", "= :createdBy");

    @Getter
    String dbColumnName;

    @Getter
    String condition;

    private ProductFilterEnum(String dbColumnName) {
        this.dbColumnName = dbColumnName;
    }

    private ProductFilterEnum(String dbColumnName, String condition) {
        this.dbColumnName = dbColumnName;
        this.condition = condition;
    }
}

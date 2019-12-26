package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum ProductCategoryFilterEnum {

    ID("ID", " = :id"),
    PRODUCT_CATEGORY_NAME("PRODUCT_CATEGORY_NAME", " like '%:productCategoryName%'"),
    PRODUCT_CATEGORY_DESCRIPTION("PRODUCT_CATEGORY_DESCRIPTION", " = :productCategoryDescription"),   
    USER_ID("createdBy", "= :createdBy");

    @Getter
    String dbColumnName;

    @Getter
    String condition;

    private ProductCategoryFilterEnum(String dbColumnName) {
        this.dbColumnName = dbColumnName;
    }

    private ProductCategoryFilterEnum(String dbColumnName, String condition) {
        this.dbColumnName = dbColumnName;
        this.condition = condition;
    }

}

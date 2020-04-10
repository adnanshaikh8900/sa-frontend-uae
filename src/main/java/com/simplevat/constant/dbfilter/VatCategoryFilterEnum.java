package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum VatCategoryFilterEnum {


	   VAT_CATEGORY_NAME("name", " like CONCAT(:name,'%')"),
	   VAT_RATE("vat", " = :vat"), 
	   ORDER_BY("id"," =:id"),
	   DELETE_FLAG("deleteFlag","= :deleteFlag");

	    @Getter
	    String dbColumnName;

	    @Getter
	    String condition;

	    private VatCategoryFilterEnum(String dbColumnName, String condition) {
	        this.dbColumnName = dbColumnName;
	        this.condition = condition;
	    }

}

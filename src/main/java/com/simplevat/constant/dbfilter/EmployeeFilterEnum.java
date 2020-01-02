package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum EmployeeFilterEnum {

	   EMAIL("email", " like CONCAT(:email,'%')"),
	    FIRST_NAME("firstName", " like CONCAT(:firstName,'%')"),
	    DELETE_FLAG("deleteFlag", " = :deleteFlag");

	    @Getter
	    String dbColumnName;

	    @Getter
	    String condition;

	    private EmployeeFilterEnum(String dbColumnName) {
	        this.dbColumnName = dbColumnName;
	    }

	    private EmployeeFilterEnum(String dbColumnName, String condition) {
	        this.dbColumnName = dbColumnName;
	        this.condition = condition;
	    }
}

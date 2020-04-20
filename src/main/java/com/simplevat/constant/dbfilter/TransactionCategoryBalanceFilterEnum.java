package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum TransactionCategoryBalanceFilterEnum {

	USER_ID("createdBy", "= :createdBy");

	@Getter
	String dbColumnName;

	@Getter
	String condition;

	private TransactionCategoryBalanceFilterEnum(String dbColumnName, String condition) {
		this.dbColumnName = dbColumnName;
		this.condition = condition;
	}

}

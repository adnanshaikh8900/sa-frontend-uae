package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum JournalFilterEnum {

	USER_ID("createdBy", "= :createdBy");

	@Getter
	String dbColumnName;

	@Getter
	String condition;

	private JournalFilterEnum(String dbColumnName) {
		this.dbColumnName = dbColumnName;
	}

	private JournalFilterEnum(String dbColumnName, String condition) {
		this.dbColumnName = dbColumnName;
		this.condition = condition;
	}

}

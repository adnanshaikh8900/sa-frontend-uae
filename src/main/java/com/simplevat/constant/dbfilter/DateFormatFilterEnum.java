package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum DateFormatFilterEnum {

	DELETE_FLAG("deleteFlag", " = :deleteFlag");

	@Getter
	String dbColumnName;

	@Getter
	String condition;

	private DateFormatFilterEnum(String dbColumnName) {
		this.dbColumnName = dbColumnName;
	}

	private DateFormatFilterEnum(String dbColumnName, String condition) {
		this.dbColumnName = dbColumnName;
		this.condition = condition;
	}
}

package com.simplevat.criteria.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import com.simplevat.rest.EnumDropdownModel;

import lombok.Getter;

public enum TransactionEnum {

	TRANSACTION_DATE("TRANSACTION_DATE", "Transaction Date"), DESCRITION("DESCRITION", "Description"),
	DR_AMOUNT("DR_AMOUNT", "Debit Amount"), CR_AMOUNT("DR_AMOUNT", "Credit Amount"), DATE("DATE", "Date"),
	CREDIT("CREDIT", "Credit"), DEBIT("DEBIT", "Debit");

	@Getter
	String dbColumnName;

	@Getter
	String displayName;

	private TransactionEnum(String dbColumnName, String displayName) {
		this.dbColumnName = dbColumnName;
		this.displayName = displayName;
	}

	public static List<EnumDropdownModel> getDropdownList() {
		List<EnumDropdownModel> enumDropdownModels = new ArrayList<>();
		Stream.of(TransactionEnum.values()).forEach(transactionEnum -> enumDropdownModels
				.add(new EnumDropdownModel(transactionEnum.name(), transactionEnum.displayName)));
		return enumDropdownModels;
	}

}

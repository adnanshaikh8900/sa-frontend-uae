package com.simplevat.rest.bankaccountcontroller;

import lombok.Data;

@Data
public class BankAccountListModel {

	private Integer bankAccountId;
	private String name;
	private String bankAccountTypeName;
	private String bankAccountNo;
	private String accounName;
	private String currancyName;
	private Double openingBalance;
	
}

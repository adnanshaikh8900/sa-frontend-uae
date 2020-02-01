package com.simplevat.rest.bankaccountcontroller;

import java.util.Date;

import lombok.Data;

@Data
public class BankAccountFilterModel {

	private String bankName;
	private Integer bankAccountTypeId;
	private String bankAccountName;
	private Date transactionDate;
	private String accountNumber;
	private Integer currencyCode;
}

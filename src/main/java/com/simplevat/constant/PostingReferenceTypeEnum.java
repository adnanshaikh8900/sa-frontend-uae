package com.simplevat.constant;

import lombok.Getter;

/**
 *
 * @author uday
 */
public enum PostingReferenceTypeEnum {
    MANUAL("Manual"),
    INVOICE("Invoice"),
    EXPENSE("Expense"),
    TRANSACTION_RECONSILE_INVOICE("Reconsile Transaction for Invoice"),
    TRANSACTION_RECONSILE("Transaction Reconsile"),
    BANK_ACCOUNT("Bank Account"),
    PURCHASE("Purchase"),
    RECEIPT("Customer Payment")
    ;
	
	@Getter
	private String displayName;

	private PostingReferenceTypeEnum(String displayName) {
		this.displayName = displayName;
	}
}

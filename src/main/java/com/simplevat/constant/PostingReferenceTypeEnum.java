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
    TRANSACTION_RECONSILE_INVOICE("Reconcile  Transaction for Invoice"),
    TRANSACTION_RECONSILE("Transaction Reconcile "),
    BANK_ACCOUNT("Bank Account"),
    PURCHASE("Purchase"),
    RECEIPT("Customer Payment"),
    BALANCE_ADJUSTMENT("Opening Balance Adjustments"),
    PAYMENT("Supplier Payment");
	
	@Getter
	private String displayName;

	private PostingReferenceTypeEnum(String displayName) {
		this.displayName = displayName;
	}
}

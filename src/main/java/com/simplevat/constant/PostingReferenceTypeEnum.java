/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
    BANK_ACCOUNT("Bank Account"),
    PURCHASE("Purchase");
	
	@Getter
	private String displayName;

	private PostingReferenceTypeEnum(String displayName) {
		this.displayName = displayName;
	}
}

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
public enum TransactionCategoryCodeEnum {
    ACCOUNT_PAYABLE("02-01-001"),
    ACCOUNT_RECEIVABLE("01-01-001"),
    ACCOUNTANCY_FEE("04-01-002"),
    SALE("03-01-006"),
    BANK("01-02-001"),
    PETTY_CASH("01-04-001"),
	EXPENSE("04"),
	INPUT_VAT("01-06-004"),
	OUTPUT_VAT("02-02-004"),
    EMPLOYEE_REIMBURSEMENT("02-02-001"),
	UNDEPOSTED_FUND("01-04-006");
	
	
    @Getter
    private final String code;

    private TransactionCategoryCodeEnum(String  code) {
        this.code = code;
    }
}

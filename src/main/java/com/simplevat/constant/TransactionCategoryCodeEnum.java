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
    ACCOUNT_PAYABLE(2101),
    ACCOUNT_RECEIVABLE(1101),
    ACCOUNTANCY_FEE(4102),
    SALE(3106);

    @Getter
    private final Integer code;

    private TransactionCategoryCodeEnum(Integer code) {
        this.code = code;
    }
}

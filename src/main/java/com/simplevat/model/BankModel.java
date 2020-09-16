/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

import lombok.Data;

/**
 *
 * @author Sonu
 */
@Data
public class BankModel implements Serializable {

    private Integer bankAccountId;

    private String bankAccountName;

    private String bankAccountCurrency;

    private Integer bankAccountStatus;

    private String personalCorporateAccountInd;

    private Boolean isprimaryAccountFlag = Boolean.TRUE;

    private String bankName;

    private String accountNumber;

    private String ifscCode;

    private String swiftCode;

    private BigDecimal openingBalance;

    private BigDecimal currentBalance;

    private Integer bankFeedStatusCode;

    private Integer bankCountry;

    private Integer createdBy;

    private Integer bankAccountType;

    private BigDecimal closingBalance;

    private LocalDateTime openingDate;

    private LocalDateTime lastReconcileDate;
}

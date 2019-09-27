/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.reports;

import com.simplevat.entity.Country;
import com.simplevat.entity.Currency;
import com.simplevat.entity.bankaccount.BankAccountStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author admin
 */
@Getter
@Setter
public class BankAccountRestModel {

//    public BankAccountModel() {
//        this.bankAccountId = 0;
//    }
    private Integer bankAccountId;

    private String bankAccountName;

    private Currency bankAccountCurrency;

    private BankAccountStatus bankAccountStatus;

    private Character personalCorporateAccountInd = 'C';

    private Boolean isprimaryAccountFlag = true;

    private String bankName;

    private String accountNumber;

    private String ibanNumber;

    private String swiftCode;

    private BigDecimal openingBalance;

    private BigDecimal currentBalance;

    private Integer bankFeedStatusCode;

    private Country bankCountry;

    private Integer createdBy;

    private LocalDateTime createdDate;

    private Integer lastUpdatedBy;

    private LocalDateTime lastUpdateDate;

    private Boolean deleteFlag = Boolean.FALSE;

    private Integer versionNumber;

}

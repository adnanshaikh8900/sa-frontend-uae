/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.model.BankModel;
import com.simplevat.entity.Currency;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.BankAccountStatus;
import com.simplevat.entity.bankaccount.BankAccountType;
import com.simplevat.service.BankAccountTypeService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.BankAccountStatusService;

/**
 *
 * @author Sonu
 */
public class BankHelper {
    
    public static BankAccount createBankAccountByBankAccountModel(BankModel bankModel, BankAccountService bankAccountService,BankAccountStatusService bankAccountStatusService, CurrencyService currencyService, BankAccountTypeService bankAccountTypeService, CountryService countryService) {
        BankAccount bankAccount = new BankAccount();
    	
        if (bankModel.getBankCountry() != null) {
            bankAccount.setBankCountry(countryService.getCountry(bankModel.getBankCountry()));
        }
        bankAccount.setAccountNumber(bankModel.getAccountNumber());
        bankAccount.setBankAccountName(bankModel.getBankAccountName());
        bankAccount.setBankName(bankModel.getBankName());
        bankAccount.setDeleteFlag(Boolean.FALSE);
        bankAccount.setIbanNumber(bankModel.getIbanNumber());
        bankAccount.setIsprimaryAccountFlag(bankModel.getIsprimaryAccountFlag());
        bankAccount.setOpeningBalance(bankModel.getOpeningBalance());
        bankAccount.setPersonalCorporateAccountInd(bankModel.getPersonalCorporateAccountInd().charAt(0));
        bankAccount.setSwiftCode(bankModel.getSwiftCode());
        bankAccount.setVersionNumber(1);
        
        if (bankModel.getBankAccountStatus() != null) {
            BankAccountStatus bankAccountStatus = bankAccountStatusService
                    .getBankAccountStatus(bankModel.getBankAccountStatus());
            bankAccount.setBankAccountStatus(bankAccountStatus);
        }
        if (bankModel.getBankAccountCurrency() != null) {
            Currency currency = currencyService
                    .getCurrency(Integer.valueOf(bankModel.getBankAccountCurrency()));
            bankAccount.setBankAccountCurrency(currency);
        }
        
        if (bankModel.getBankAccountType() != null) {
            BankAccountType bankAccountType = bankAccountTypeService.getBankAccountType(bankModel.getBankAccountType());
            bankAccount.setBankAccountType(bankAccountType);
        }
        
        if (bankModel.getBankAccountId() == null || bankModel.getBankAccountId() == 0) {
            bankAccount.setCurrentBalance(bankModel.getOpeningBalance());
            BankAccountStatus bankAccountStatus = bankAccountStatusService.getBankAccountStatusByName("ACTIVE");
            bankAccount.setBankAccountStatus(bankAccountStatus);
        }
        
        return bankAccount;
    }
    
    public static BankAccount getBankAccountByBankAccountModel(BankModel bankModel, BankAccountService bankAccountService,BankAccountStatusService bankAccountStatusService, CurrencyService currencyService, BankAccountTypeService bankAccountTypeService, CountryService countryService) {
        BankAccount bankAccount;
    	if(bankModel.getBankAccountId()!=null) {
        	bankAccount = bankAccountService.getBankAccountById(bankModel.getBankAccountId());
        	if (bankModel.getBankCountry() != null) {
                bankAccount.setBankCountry(countryService.getCountry(bankModel.getBankCountry()));
            }
            bankAccount.setAccountNumber(bankModel.getAccountNumber());
            bankAccount.setBankAccountName(bankModel.getBankAccountName());
            bankAccount.setBankName(bankModel.getBankName());
            bankAccount.setDeleteFlag(Boolean.FALSE);
            bankAccount.setIbanNumber(bankModel.getIbanNumber());
            bankAccount.setIsprimaryAccountFlag(bankModel.getIsprimaryAccountFlag());
            bankAccount.setOpeningBalance(bankModel.getOpeningBalance());
            bankAccount.setPersonalCorporateAccountInd(bankModel.getPersonalCorporateAccountInd().charAt(0));
            bankAccount.setSwiftCode(bankModel.getSwiftCode());
            bankAccount.setVersionNumber(1);
            
            if (bankModel.getBankAccountStatus() != null) {
                BankAccountStatus bankAccountStatus = bankAccountStatusService
                        .getBankAccountStatus(bankModel.getBankAccountStatus());
                bankAccount.setBankAccountStatus(bankAccountStatus);
            }
            if (bankModel.getBankAccountCurrency() != null) {
                Currency currency = currencyService
                        .getCurrency(Integer.valueOf(bankModel.getBankAccountCurrency()));
                bankAccount.setBankAccountCurrency(currency);
            }
            
            if (bankModel.getBankAccountType() != null) {
                BankAccountType bankAccountType = bankAccountTypeService.getBankAccountType(bankModel.getBankAccountType());
                bankAccount.setBankAccountType(bankAccountType);
            }
            
            if (bankModel.getBankAccountId() == null || bankModel.getBankAccountId() == 0) {
                bankAccount.setCurrentBalance(bankModel.getOpeningBalance());
                BankAccountStatus bankAccountStatus = bankAccountStatusService.getBankAccountStatusByName("ACTIVE");
                bankAccount.setBankAccountStatus(bankAccountStatus);
            }
        }else {
        	return null;
        }
        return bankAccount;
    }
    
    
}

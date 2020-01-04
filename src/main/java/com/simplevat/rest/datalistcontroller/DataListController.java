/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.datalistcontroller;

import com.simplevat.entity.Country;
import com.simplevat.entity.Currency;
import com.simplevat.entity.IndustryType;
import com.simplevat.entity.bankaccount.BankAccountType;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.enums.ContactTypeEnum;
import com.simplevat.enums.InvoiceStatusEnum;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.EnumDropdownModel;
import com.simplevat.service.BankAccountTypeService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.IndustryTypeService;
import com.simplevat.service.bankaccount.TransactionTypeService;
import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/datalist")
public class DataListController implements Serializable {

    @Autowired
    private CountryService countryService;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private BankAccountTypeService bankAccountTypeService;

    @Autowired
    private TransactionTypeService transactionTypeService;

    @Autowired
    private IndustryTypeService industryTypeService;

    @GetMapping(value = "/getcountry")
    public ResponseEntity getCountry() {
        try {
            List<Country> countryList = countryService.getCountries();
            if (countryList != null && !countryList.isEmpty()) {
                return new ResponseEntity<>(countryList, HttpStatus.OK);
            } else {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Deprecated
    @GetMapping(value = "/getcurrenncy")
    public ResponseEntity getCurrency() {
        try {
            List<Currency> currencies = currencyService.getCurrencies();
            if (currencies != null && !currencies.isEmpty()) {
                return new ResponseEntity<>(currencies, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiOperation(value = "All Transaction Types")
    @GetMapping(value = "/getTransactionTypes")
    public ResponseEntity getTransactionTypes() {
        try {
            List<TransactionType> transactionTypes = transactionTypeService.findAll();
            if (transactionTypes != null && !transactionTypes.isEmpty()) {
                return new ResponseEntity<>(transactionTypes, HttpStatus.OK);
            } else {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiOperation(value = "All Invoice Status Types")
    @GetMapping(value = "/getInvoiceStatusTypes")
    public ResponseEntity getInvoiceStatusTypes() {
        try {
            List<InvoiceStatusEnum> statusEnums = InvoiceStatusEnum.getInvoiceStatusList();
            List<EnumDropdownModel> dropdownModels = new ArrayList<>();
            if (statusEnums != null && !statusEnums.isEmpty()) {
                for (InvoiceStatusEnum statusEnum : statusEnums) {
                    dropdownModels.add(new EnumDropdownModel(statusEnum.name(), statusEnum.getDesc()));
                }
                return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
            } else {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiOperation(value = "All Contact Types")
    @GetMapping(value = "/getContactTypes")
    public ResponseEntity getContactTypes() {
        try {
            List<ContactTypeEnum> typeEnums = Arrays.asList(ContactTypeEnum.values());
            List<DropdownModel> dropdownModels = new ArrayList<>();
            if (typeEnums != null && !typeEnums.isEmpty()) {
                for (ContactTypeEnum typeEnum : typeEnums) {
                    dropdownModels.add(new DropdownModel(typeEnum.getValue(), typeEnum.getDesc()));
                }
                return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
            } else {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiOperation(value = "All Industry Types")
    @GetMapping(value = "/getIndustryTypes")
    public ResponseEntity getIndustryTypes() {
        try {
            List<DropdownModel> dropdownModels = new ArrayList<>();
            List<IndustryType> industryTypes = industryTypeService.getIndustryTypes();
            if (industryTypes != null && !industryTypes.isEmpty()) {
                for (IndustryType type : industryTypes) {
                    dropdownModels.add(new DropdownModel(type.getId(), type.getIndustryTypeName()));
                }
                return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
            } else {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

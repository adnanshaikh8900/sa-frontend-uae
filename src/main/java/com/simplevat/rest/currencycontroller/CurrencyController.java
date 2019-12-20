/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.currencycontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.helper.BankHelper;
import com.simplevat.security.JwtAuthenticationController;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.contact.model.BankModel;
import com.simplevat.entity.Country;
import com.simplevat.entity.Currency;
import com.simplevat.entity.User;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.BankAccountStatus;
import com.simplevat.entity.bankaccount.BankAccountType;
import com.simplevat.exceptions.ServiceException;
import com.simplevat.service.BankAccountTypeService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.UserServiceNew;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.BankAccountStatusService;
import com.simplevat.service.bankaccount.TransactionStatusService;

import io.jsonwebtoken.JwtException;
import io.swagger.annotations.ApiOperation;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Rupesh - 29/Nov/2019
 */
@RestController
@RequestMapping(value = "/rest/currency")
public class CurrencyController implements Serializable {

    @Autowired
    private CurrencyService currencyService;
    
    @Autowired
    JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    UserServiceNew userServiceNew;
    
    @ApiOperation(value = "Get Currency List", response = List.class)
    @GetMapping
    public ResponseEntity getCurrencies() {
        try {
            List<Currency> currencies = currencyService.getCurrencies();
            if (currencies != null && !currencies.isEmpty()) {
                return new ResponseEntity<>(currencies, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ApiOperation(value = "Get Currency by Currency Code", response = Currency.class)
    @GetMapping("/{currencyCode}")
    public ResponseEntity getCurrency(@RequestParam("currencyCode") Integer currencyCode) {
        try {
            Currency currency = currencyService.findByPK(currencyCode);
            if (currency != null) {
                return new ResponseEntity<>(currency, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } catch (ServiceException se) {
        	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ApiOperation(value = "Save Currency Code", response = Currency.class)
    @PostMapping
    public ResponseEntity createCurrency(@RequestBody Currency currency, HttpServletRequest request) {
        try {
        	Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        	currency.setCreatedBy(userId);
        	currency.setCreatedDate(new Date());
            currencyService.persist(currency);
            return new ResponseEntity<>(currency, HttpStatus.CREATED);            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ApiOperation(value = "Update Currency by Currency Code", response = Currency.class)
    @PutMapping(value = "/{currencyCode}")
    public ResponseEntity editCurrency(@RequestBody Currency currency, @RequestParam("currencyCode") Integer currencyCode, HttpServletRequest request) {
    	try {
    		
            Currency existingCurrency = currencyService.findByPK(currencyCode);

            if (existingCurrency != null) {
            	Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            	currency.setCurrencyCode(existingCurrency.getCurrencyCode());
            	currency.setLastUpdateDate(new Date());
            	currency.setLastUpdateBy(userId);
            	currency.setCreatedBy(existingCurrency.getCreatedBy());
            	currency.setCreatedDate(existingCurrency.getCreatedDate());
            	currencyService.update(currency);
                return new ResponseEntity<>(currency, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ApiOperation(value = "Delete Currency by Currency Code", response = Currency.class)
    @DeleteMapping(value = "/{currencyCode}")
    public ResponseEntity deleteCurrency(@RequestParam("currencyCode") Integer currencyCode,HttpServletRequest request) {
        try {
            Currency currency = currencyService.findByPK(currencyCode);
            if (currency != null) {
            	Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            	currency.setLastUpdateDate(new Date());
            	currency.setLastUpdateBy(userId);
            	currency.setDeleteFlag(true);
            	currencyService.update(currency);
                return new ResponseEntity<>(currency, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /*
    @DeleteMapping
    public ResponseEntity deleteCurrencies(HttpServletRequest request) {
        try {
            List<Currency> currencies = currencyService.getCurrencies();
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            for (Currency currency : currencies) {
            	if (currency != null) {
                	currency.setLastUpdateDate(new Date());
                	currency.setLastUpdateBy(userId);
                	currency.setDeleteFlag(true);
                	currencyService.update(currency);
                    return new ResponseEntity<>(currency, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                }
			}
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    */
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.currencycontroller;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.simplevat.constant.ErrorConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.entity.Currency;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.UserService;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author Rupesh - 29/Nov/2019
 */
@RestController
@RequestMapping(value = "/rest/currency")
public class CurrencyController {

	private final Logger logger = LoggerFactory.getLogger(CurrencyController.class);

	@Autowired
	private CurrencyService currencyService;

	@Autowired
	JwtTokenUtil jwtTokenUtil;

	@Autowired
	UserService userServiceNew;

	@ApiOperation(value = "Get Currency List", response = List.class)
	@GetMapping
	public ResponseEntity<List<Currency>> getCurrencies() {
		try {
			List<Currency> currencies = currencyService.getCurrencies();
			if (currencies != null && !currencies.isEmpty()) {
				return new ResponseEntity<>(currencies, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
		} catch (Exception e) {
			logger.error(ErrorConstant.ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Currency by Currency Code", response = Currency.class)
	@GetMapping("/{currencyCode}")
	public ResponseEntity<Currency> getCurrency(@RequestParam("currencyCode") Integer currencyCode) {
		try {
			Currency currency = currencyService.findByPK(currencyCode);
			if (currency != null) {
				return new ResponseEntity<>(currency, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Save Currency Code", response = Currency.class)
	@PostMapping(value = "/save")
	public ResponseEntity<String> createCurrency(@RequestBody Currency currency, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			currency.setCreatedBy(userId);
			currency.setCreatedDate(new Date());
			currencyService.persist(currency);
			return new ResponseEntity<>("Saved Successfully",HttpStatus.CREATED);
		} catch (Exception e) {
			logger.error(ErrorConstant.ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Update Currency by Currency Code", response = Currency.class)
	@PutMapping(value = "/{currencyCode}")
	public ResponseEntity<Currency> editCurrency(@RequestBody Currency currency,
			@RequestParam("currencyCode") Integer currencyCode, HttpServletRequest request) {
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
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Delete Currency by Currency Code", response = Currency.class)
	@DeleteMapping(value = "/{currencyCode}")
	public ResponseEntity<Currency> deleteCurrency(@RequestParam("currencyCode") Integer currencyCode,
			HttpServletRequest request) {
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
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

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
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.constant.ContactTypeEnum;
import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.dbfilter.CurrencyFilterEnum;
import com.simplevat.constant.dbfilter.ExpenseFIlterEnum;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.EnumDropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.BankAccountTypeService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.IndustryTypeService;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	private ChartOfAccountService transactionTypeService;

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
	public ResponseEntity getCurrency(PaginationModel paginationModel) {
		try {
			Map<CurrencyFilterEnum, Object> filterDataMap = new HashMap<CurrencyFilterEnum, Object>();
			filterDataMap.put(CurrencyFilterEnum.ORDER_BY, ORDERBYENUM.DESC);
			filterDataMap.put(CurrencyFilterEnum.DELETE_FLAG, false);

			PaginationResponseModel response = currencyService.getCurrencies(filterDataMap, paginationModel);
			if (response != null) {
				return new ResponseEntity<>(response, HttpStatus.OK);
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
			List<ChartOfAccount> transactionTypes = transactionTypeService.findAll();
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
			List<DropdownModel> dropdownModels = new ArrayList<>();
			if (statusEnums != null && !statusEnums.isEmpty()) {
				for (InvoiceStatusEnum statusEnum : statusEnums) {
					dropdownModels.add(new DropdownModel(statusEnum.getValue(), statusEnum.getDesc()));
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

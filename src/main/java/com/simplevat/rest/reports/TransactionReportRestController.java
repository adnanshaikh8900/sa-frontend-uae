/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.reports;

import com.simplevat.model.TransactionRestModel;
import com.simplevat.model.FinancialPeriodRestModel;
import com.simplevat.model.InvoiceReportRestModel;
import com.simplevat.model.TransactionReportRestModel;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.simplevat.constant.ErrorConstant.*;

/**
 *
 * @author daynil
 */
@RestController
@RequestMapping("/rest/transactionreport")
public class TransactionReportRestController {
	private final Logger logger = LoggerFactory.getLogger(TransactionReportRestController.class);

	@Autowired
	private ChartOfAccountService transactionTypeService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	InvoiceService invoiceService;

	@ApiOperation(value = "Get All Financial Periods")
	@GetMapping(value = "/getFinancialPeriods")
	public ResponseEntity<List<FinancialPeriodRestModel>> completeFinancialPeriods() {
		try {
			return new ResponseEntity(FinancialPeriodHolderRest.getFinancialPeriodList(), HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation(value = "Get All Transaction Type")
	@GetMapping(value = "/getTransactionTypes")
	public ResponseEntity<List<ChartOfAccount>> transactionTypes(){
		try {
			List<ChartOfAccount> transactionTypeList = transactionTypeService.findAllChild();
			return new ResponseEntity(transactionTypeList, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation(value = "Get All Transaction Category")
	@GetMapping(value = "/getTransactionCategories")
	public ResponseEntity<List<TransactionCategory>> transactionCategories(
			@RequestParam("chartOfAccountId") Integer chartOfAccountId){
		try {
			ChartOfAccount chartOfAccount = transactionTypeService.findByPK(chartOfAccountId);
			String name = "";
			List<TransactionCategory> transactionCategoryParentList = new ArrayList<>();
			List<TransactionCategory> transactionCategoryList = new ArrayList<>();
			transactionCategoryList.clear();
			if (chartOfAccount != null) {
				transactionCategoryList = transactionCategoryService
						.findAllTransactionCategoryByChartOfAccountIdAndName(chartOfAccount.getChartOfAccountId(),
								name);
				for (TransactionCategory transactionCategory : transactionCategoryList) {
					if (transactionCategory.getParentTransactionCategory() != null) {
						transactionCategoryParentList.add(transactionCategory.getParentTransactionCategory());
					}
				}
				transactionCategoryList.removeAll(transactionCategoryParentList);
				return new ResponseEntity(transactionCategoryList, HttpStatus.OK);
			}
			return new ResponseEntity(transactionCategoryList, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation(value = "Get Account Balance Report")
	@PostMapping(value = "/accountBalanceReport")
	public ResponseEntity<List<TransactionRestModel>> view(
			@RequestParam(value = "transactionTypeCode", required = false) Integer transactionTypeCode,
			@RequestParam(value = "transactionCategoryId", required = false) Integer transactionCategoryId,
			@RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "MM.dd.yyyy") Date startDate,
			@RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "MM.dd.yyyy") Date endDate,
			@RequestParam(value = "accountId", required = false) Integer accountId,
			@RequestParam(value = "pageNo", required = false) Integer pageNo,
			@RequestParam(value = "pageSize", required = false) Integer pageSize) {
		try {
			List<TransactionReportRestModel> transactionRestModels = transactionService.getTransactionsReport(
					transactionTypeCode, transactionCategoryId, startDate, endDate, accountId, pageNo, pageSize);
			return new ResponseEntity(transactionRestModels, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation(value = "Get Customet Invoice Report")
	@PostMapping(value = "/customerInvoiceReport")
	public ResponseEntity<List<InvoiceReportRestModel>> view(
			@RequestParam(value = "refNumber", required = false) String refNumber,
			@RequestParam(value = "contactId", required = false) Integer contactId,
			@RequestParam(value = "invoiceStartDate", required = false) @DateTimeFormat(pattern = "MM.dd.yyyy") Date invoiceStartDate,
			@RequestParam(value = "invoiceEndDate", required = false) @DateTimeFormat(pattern = "MM.dd.yyyy") Date invoiceEndDate,
			@RequestParam(value = "invoiceDueStartDate", required = false) @DateTimeFormat(pattern = "MM.dd.yyyy") Date invoiceDueStartDate,
			@RequestParam(value = "invoiceDueEndDate", required = false) @DateTimeFormat(pattern = "MM.dd.yyyy") Date invoiceDueEndDate,
			@RequestParam(value = "pageNo", required = false) Integer pageNo,
			@RequestParam(value = "pageSize", required = false) Integer pageSize) {
		try {
			if (invoiceStartDate != null && invoiceEndDate == null) {
				invoiceDueEndDate = invoiceStartDate;
			}
			if (invoiceDueStartDate != null && invoiceDueEndDate == null) {
				invoiceDueEndDate = invoiceStartDate;
			}
			return new ResponseEntity(
					HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}

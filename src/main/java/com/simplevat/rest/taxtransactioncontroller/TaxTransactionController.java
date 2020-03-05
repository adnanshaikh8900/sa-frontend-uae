/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.taxtransactioncontroller;

import com.simplevat.entity.Purchase;
import com.simplevat.entity.PurchaseLineItem;
import com.simplevat.entity.TaxTransaction;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.rest.PaginationModel;
import com.simplevat.service.PurchaseService;
import com.simplevat.service.TaxTransactionService;
import com.simplevat.service.bankaccount.TransactionService;

import io.swagger.annotations.ApiOperation;

import com.simplevat.constant.TaxTransactionStatusConstant;
import com.simplevat.constant.TransactionCreditDebitConstant;
import com.simplevat.constant.TransactionRefrenceTypeConstant;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.InvoiceLineItem;
import com.simplevat.service.InvoiceService;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/taxtransaction")
public class TaxTransactionController implements Serializable {

	@Autowired
	private TaxTransactionService taxTransactionService;

	@Autowired
	private TaxTranscationRestHelper taxTranscationRestHelper;

	@ApiOperation(value = "Get Open Tax Transaction List")
	@GetMapping(value = "/getOpenTaxTransaction")
	public ResponseEntity<List<TaxTransaction>> getOpenTaxTranscation(PaginationModel paginationModel) {
		List<TaxTransaction> taxTransactionList = taxTransactionService.getOpenTaxTransactionList();
		Date startDate = taxTranscationRestHelper.getStartDate();
		Date endDate = taxTranscationRestHelper.getEndDate();
		if (!taxTranscationRestHelper.isTaxTransactionExist(startDate, endDate, taxTransactionList)) {
			taxTransactionList = taxTranscationRestHelper.separateTransactionCrediTAndDebit(startDate, endDate);
//            calculateTaxPerMonth(startDate, endDate,);
		}
		if (taxTransactionList != null) {
			return new ResponseEntity(taxTransactionList, HttpStatus.OK);
		} else {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}

	}

	@ApiOperation(value = "Get Close Tax Transcation List")
	@GetMapping(value = "/getCloseTaxTranscation")
	public ResponseEntity<List<TaxTransaction>> getCloseTaxTranscation() {
		List<TaxTransaction> taxTransactionList = taxTransactionService.getClosedTaxTransactionList();
		if (taxTransactionList != null) {
			return new ResponseEntity(taxTransactionList, HttpStatus.OK);
		} else {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}

	}

	@ApiOperation(value = "Save Tax Transaction")
	@PostMapping(value = "/saveTaxTransaction")
	public ResponseEntity save(@RequestParam(value = "id") Integer id) {
		TaxTransaction taxTransaction = taxTransactionService.findByPK(id);

		TaxTransaction taxTransaction1 = null;
		BigDecimal dueAmountBeforePayment;
		if (taxTransaction.getDueAmount() == null) {
			dueAmountBeforePayment = taxTransaction.getVatIn().subtract(taxTransaction.getVatOut());
		} else {
			dueAmountBeforePayment = taxTransaction.getDueAmount();
		}
		if (taxTransaction.getPaidAmount().doubleValue() < dueAmountBeforePayment.doubleValue()) {
			taxTransaction1 = new TaxTransaction();
			BigDecimal dueAmount = dueAmountBeforePayment.subtract(taxTransaction.getPaidAmount());
			taxTransaction1 = createNewTaxTransaction(taxTransaction1, dueAmount, taxTransaction, id);
		} else {
			taxTransaction.setStatus(TaxTransactionStatusConstant.CLOSE);
			taxTransaction.setDueAmount(new BigDecimal(0));
			taxTransaction.setPaymentDate(new Date());
		}
		if (taxTransaction1 != null) {
			taxTransactionService.persist(taxTransaction1);
		}
		if (taxTransaction.getTaxTransactionId() == null) {
			taxTransaction.setCreatedBy(id);
			taxTransaction.setCreatedDate(LocalDateTime.now());
			taxTransactionService.persist(taxTransaction);
		} else {
			taxTransactionService.update(taxTransaction);
		}
		return new ResponseEntity(HttpStatus.OK);
	}

	private TaxTransaction createNewTaxTransaction(TaxTransaction taxTransaction1, BigDecimal dueAmount,
			TaxTransaction taxTransaction, Integer id) {
		taxTransaction1.setStartDate(taxTransaction.getStartDate());
		taxTransaction1.setEndDate(taxTransaction.getEndDate());
		taxTransaction1.setVatIn(taxTransaction.getVatIn());
		taxTransaction1.setVatOut(taxTransaction.getVatOut());
		taxTransaction1.setStatus(TaxTransactionStatusConstant.CLOSE);
		taxTransaction1.setDueAmount(dueAmount);
		taxTransaction1.setPaidAmount(taxTransaction.getPaidAmount());
		taxTransaction1.setPaymentDate(new Date());
		taxTransaction1.setCreatedBy(id);
		taxTransaction1.setCreatedDate(LocalDateTime.now());
//        taxTransaction.setDueAmount(dueAmount);
//        taxTransaction.setPaymentDate(new Date());
//        taxTransaction.setStatus(TaxTransactionStatusConstant.OPEN);
		return taxTransaction1;
	}

}

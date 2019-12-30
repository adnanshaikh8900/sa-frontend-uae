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
import com.simplevat.service.PurchaseService;
import com.simplevat.service.TaxTransactionService;
import com.simplevat.service.bankaccount.TransactionService;
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
    private TransactionService transactionService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PurchaseService purchaseService;

    private BigDecimal vatIn = new BigDecimal(0);
    private BigDecimal vatOut = new BigDecimal(0);

    @GetMapping(value = "/getopentaxtransaction")
    public ResponseEntity<List<TaxTransaction>> getOpenTaxTranscation() {
        List<TaxTransaction> taxTransactionList = taxTransactionService.getOpenTaxTransactionList();
        Date startDate = getStartDate();
        Date endDate = getEndDate();
        if (!isTaxTransactionExist(startDate, endDate, taxTransactionList)) {
            taxTransactionList = separateTransactionCrediTAndDebit(startDate, endDate);
//            calculateTaxPerMonth(startDate, endDate,);
        }
        if (taxTransactionList != null) {
            return new ResponseEntity(taxTransactionList, HttpStatus.OK);
        } else {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping(value = "/getclosetaxtransaction")
    public ResponseEntity<List<TaxTransaction>> getCloseTaxTranscation() {
        List<TaxTransaction> taxTransactionList = taxTransactionService.getClosedTaxTransactionList();
        if (taxTransactionList != null) {
            return new ResponseEntity(taxTransactionList, HttpStatus.OK);
        } else {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

    }

    private boolean isTaxTransactionExist(Date startDate, Date endDate, List<TaxTransaction> taxTransactionList) {
        for (TaxTransaction tax : taxTransactionList) {
            if (tax.getStartDate().compareTo(startDate) == 0 && tax.getEndDate().compareTo(endDate) == 0) {
                return true;
            }
        }
        for (TaxTransaction tax : taxTransactionService.getClosedTaxTransactionList()) {
            if (tax.getStartDate().compareTo(startDate) == 0 && tax.getEndDate().compareTo(endDate) == 0) {
                if (tax.getDueAmount().doubleValue() == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    private List<TaxTransaction> separateTransactionCrediTAndDebit(Date startDate, Date endDate) {
        List<Transaction> transactionList = transactionService.getAllTransactions();
        List<Transaction> creditList = null;
        List<Transaction> debitList = null;
        if (transactionList != null) {
            List<Transaction> parentList = new ArrayList<>();

            for (Transaction transaction : transactionList) {
                if (transaction.getParentTransaction() != null) {
                    parentList.add(transaction);
                }
            }
            transactionList.removeAll(parentList);
            creditList = getCreditTransactionList(transactionList);
            debitList = getDebitTransactionList(transactionList);

        }
        return calculateTaxPerMonth(startDate, endDate, creditList, debitList);

    }

    private List<TaxTransaction> calculateTaxPerMonth(Date startDate, Date endDate, List<Transaction> creditTransactionList, List<Transaction> debitTransactionList) {
        List<TaxTransaction> taxTransactionList = new ArrayList<>();

        TaxTransaction taxTransaction = new TaxTransaction();

        taxTransaction.setStartDate(startDate);

        taxTransaction.setEndDate(endDate);
        for (Transaction transaction : creditTransactionList) {
            Date transDate = Date.from(transaction.getTransactionDate().atZone(ZoneId.systemDefault()).toInstant());
            if (transDate.compareTo(startDate) >= 0 && transDate.compareTo(endDate) <= 0) {
                if (transaction.getReferenceId() != null) {
                    vatIn = vatIn.add(getVatFromTransaction(transaction));
                }
            }
        }
        for (Transaction transaction : debitTransactionList) {
            Date transactionDate = Date.from(transaction.getTransactionDate().atZone(ZoneId.systemDefault()).toInstant());
            if (transactionDate.compareTo(startDate) >= 0 && transactionDate.compareTo(endDate) <= 0) {
                if (transaction.getReferenceId() != null) {
                    vatOut = vatOut.add(getVatFromTransaction(transaction));
                }
            }
        }

        taxTransaction.setVatIn(vatIn);

        taxTransaction.setVatOut(vatOut);

        taxTransaction.setStatus(TaxTransactionStatusConstant.OPEN);

        taxTransactionList.add(taxTransaction);
        return taxTransactionList;
        // TODO Invoice Vat Calculation Depending on Vat percentage
    }

    private List<Transaction> getCreditTransactionList(List<Transaction> transactionList) {

        List<Transaction> creditTransactionList = new ArrayList<>();
        for (Transaction transaction : transactionList) {
            if (transaction.getDebitCreditFlag() == TransactionCreditDebitConstant.CREDIT) {
                creditTransactionList.add(transaction);
            }
        }
        return creditTransactionList;
    }

    private List<Transaction> getDebitTransactionList(List<Transaction> transactionList) {
        List<Transaction> debitTransactionList = new ArrayList<>();
        for (Transaction transaction : transactionList) {
            if (transaction.getDebitCreditFlag() == TransactionCreditDebitConstant.DEBIT) {
                debitTransactionList.add(transaction);
            }
        }
        return debitTransactionList;
    }

    private Date getStartDate() {
        try {
            Calendar prevYear = Calendar.getInstance();
            prevYear.set(Calendar.DAY_OF_MONTH, 1);
            prevYear.set(Calendar.HOUR_OF_DAY, 0);
            prevYear.set(Calendar.MINUTE, 0);
            prevYear.set(Calendar.SECOND, 0);
            prevYear.set(Calendar.MILLISECOND, 0);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date dateWithoutTime = sdf.parse(sdf.format(prevYear.getTime()));
            return dateWithoutTime;

        } catch (ParseException ex) {
            Logger.getLogger(TaxTransactionController.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
        return new Date();
    }

    private Date getEndDate() {
        try {
            Calendar preMonth = Calendar.getInstance();
            preMonth.set(Calendar.DAY_OF_MONTH, 1);
            preMonth.add(Calendar.MONTH, 1);
            preMonth.add(Calendar.DAY_OF_MONTH, -1);
            preMonth.set(Calendar.HOUR_OF_DAY, 0);
            preMonth.set(Calendar.MINUTE, 0);
            preMonth.set(Calendar.SECOND, 0);
            preMonth.set(Calendar.MILLISECOND, 0);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date dateWithoutTime = sdf.parse(sdf.format(preMonth.getTime()));
            return dateWithoutTime;

        } catch (ParseException ex) {
            Logger.getLogger(TaxTransactionController.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
        return new Date();
    }

    private BigDecimal getVatFromTransaction(Transaction transaction) {
        Integer refId = transaction.getReferenceId();
        BigDecimal totalVat = BigDecimal.ZERO;
        BigDecimal vatPercent = BigDecimal.ZERO;
        if (transaction.getReferenceType() == TransactionRefrenceTypeConstant.INVOICE) {
            Invoice invoice = invoiceService.findByPK(refId);
//            for (InvoiceLineItem invoiceLineItem : invoice.getInvoiceLineItems()) {
//                BigDecimal totalAmount = invoiceLineItem.getInvoiceLineItemUnitPrice().multiply(new BigDecimal(invoiceLineItem.getInvoiceLineItemQuantity()));
//                if (invoiceLineItem.getInvoiceLineItemVat() != null) {
//                    vatPercent = invoiceLineItem.getInvoiceLineItemVat().getVat();
//                }
//                totalVat = (totalAmount.multiply(vatPercent)).divide(new BigDecimal(100), 5, RoundingMode.HALF_UP);
//            }
        }
        if (transaction.getReferenceType() == TransactionRefrenceTypeConstant.PURCHASE) {
            Purchase purchase = purchaseService.findByPK(refId);
            for (PurchaseLineItem purchaseLineItem : purchase.getPurchaseLineItems()) {
                BigDecimal totalAmount = purchaseLineItem.getPurchaseLineItemUnitPrice().multiply(new BigDecimal(purchaseLineItem.getPurchaseLineItemQuantity()));
                if (purchaseLineItem.getPurchaseLineItemVat() != null) {
                    vatPercent = purchaseLineItem.getPurchaseLineItemVat().getVat();
                }
                totalVat = (totalAmount.multiply(vatPercent)).divide(new BigDecimal(100), 5, RoundingMode.HALF_UP);
            }
        }
        return totalVat;
    }

    @PostMapping(value = "/savetaxtransaction")
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

    private TaxTransaction createNewTaxTransaction(TaxTransaction taxTransaction1, BigDecimal dueAmount, TaxTransaction taxTransaction, Integer id) {
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

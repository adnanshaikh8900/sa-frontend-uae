/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.paymentcontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Payment;
import com.simplevat.entity.Project;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.invoice.Invoice;
import com.simplevat.helper.PaymentModelHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.rest.payment.model.PaymentPersistModel;
import com.simplevat.rest.payment.model.PaymentViewModel;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.PaymentService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.invoice.InvoiceService;

import io.swagger.annotations.ApiOperation;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ashish
 */
@RestController
@RequestMapping(value = "/rest/payment")
public class PaymentController implements Serializable {

    private final PaymentService paymentService;

    private final ContactService contactService;

    private final InvoiceService invoiceService;

    private final CurrencyService currencyService;

    private final ProjectService projectService;

    private final BankAccountService bankAccountService;

    private final PaymentModelHelper paymentModelHelper;

    @Autowired
    public PaymentController(PaymentService paymentService,
            ContactService contactService, InvoiceService invoiceService,
            CurrencyService currencyService, ProjectService projectService,
            BankAccountService bankAccountService) {
        this.paymentService = paymentService;
        this.contactService = contactService;
        this.invoiceService = invoiceService;
        this.currencyService = currencyService;
        this.projectService = projectService;
        this.bankAccountService = bankAccountService;
        this.paymentModelHelper = new PaymentModelHelper();
    }

    @ApiOperation(value = "Get All Payments")
    @GetMapping(value = "/getlist")
    public ResponseEntity getPaymentList() {
        List<Payment> payments = paymentService.getPayments();
        List<PaymentViewModel> paymentModels = new ArrayList<>();
        for (Payment payment : payments) {
            PaymentViewModel paymentModel = paymentModelHelper.convertToPaymentViewModel(payment);
            paymentModels.add(paymentModel);
        }
        if (paymentModels != null) {
            return new ResponseEntity<>(paymentModels, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/save")
    public ResponseEntity save(@ModelAttribute PaymentPersistModel paymentModel) {
        try {
            Payment payment = paymentModelHelper.convertToPayment(paymentModel);
            if (paymentModel.getBankAccountId() != null) {
                BankAccount bankAccount = bankAccountService.findByPK(paymentModel.getBankAccountId());
                if (bankAccount != null) {
                    payment.setBankAccount(bankAccount);
                }
            }
            if (paymentModel.getAttachmentFile() != null) {
                System.out.println("=======" + paymentModel.getAttachmentFile().getOriginalFilename());
            }
            if (paymentModel.getSupplierId() != null) {
                Contact supplier = contactService.findByPK(paymentModel.getSupplierId());
                if (supplier != null) {
                    payment.setSupplier(supplier);
                }
            }
            if (paymentModel.getCurrencyCode() != null) {
                Currency currency = currencyService.findByPK(paymentModel.getCurrencyCode());
                if (currency != null) {
                    payment.setCurrency(currency);
                }
            }
            if (paymentModel.getProjectId() != null) {
                Project project = projectService.findByPK(paymentModel.getProjectId());
                if (project != null) {
                    payment.setProject(project);
                }
            }
            paymentService.persist(payment);
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity deletePayment(@RequestParam(value = "id") Integer id) {
        Payment payment = paymentService.findByPK(id);
        if (payment != null) {
            payment.setDeleteFlag(Boolean.TRUE);
            paymentService.update(payment, payment.getPaymentId());
        }
        return new ResponseEntity(HttpStatus.OK);

    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/deletes")
    public ResponseEntity deleteExpenses(@RequestBody DeleteModel expenseIds) {
        try {
            System.out.println("paymentIds=" + expenseIds);
            paymentModelHelper.deletePayments(expenseIds, paymentService);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

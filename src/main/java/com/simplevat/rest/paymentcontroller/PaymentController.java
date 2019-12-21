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
import com.simplevat.entity.User;
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
import com.simplevat.service.UserServiceNew;
import com.simplevat.service.invoice.InvoiceService;

import io.swagger.annotations.ApiOperation;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

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

    private final UserServiceNew userServiceNew;

    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public PaymentController(PaymentService paymentService,
            ContactService contactService, InvoiceService invoiceService,
            CurrencyService currencyService, ProjectService projectService,
            BankAccountService bankAccountService, JwtTokenUtil jwtTokenUtil, UserServiceNew userServiceNew) {
        this.paymentService = paymentService;
        this.contactService = contactService;
        this.invoiceService = invoiceService;
        this.currencyService = currencyService;
        this.projectService = projectService;
        this.bankAccountService = bankAccountService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userServiceNew = userServiceNew;
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

    @ApiOperation(value = "Get Payment By Id")
    @GetMapping(value = "/getPaymentById")
    public ResponseEntity getPaymentById(@RequestParam("paymentId") Integer paymentId) {
        try {
            PaymentPersistModel paymentModel = new PaymentPersistModel();
            if (paymentId != null) {
                Payment payment = paymentService.findByPK(paymentId);
                paymentModel = paymentModelHelper.convertToPaymentPersistModel(payment);
            }
            return new ResponseEntity<>(paymentModel, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Save a Payment")
    @PostMapping(value = "/save")
    public ResponseEntity save(@RequestBody PaymentPersistModel paymentModel, HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            User user = userServiceNew.findByPK(userId);
            Payment payment = paymentModelHelper.convertToPayment(paymentModel);
            if (paymentModel.getBankAccountId() != null) {
                payment.setBankAccount(bankAccountService.findByPK(paymentModel.getBankAccountId()));
            }
            if (paymentModel.getSupplierId() != null) {
                payment.setSupplier(contactService.findByPK(paymentModel.getSupplierId()));
            }
            if (paymentModel.getCurrencyCode() != null) {
                payment.setCurrency(currencyService.findByPK(paymentModel.getCurrencyCode()));
            }
            if (paymentModel.getProjectId() != null) {
                payment.setProject(projectService.findByPK(paymentModel.getProjectId()));
            }
            if (paymentModel.getInvoiceId() != null) {
                payment.setInvoice(invoiceService.findByPK(paymentModel.getInvoiceId()));
            }
            payment.setCreatedBy(user.getUserId());
            payment.setCreatedDate(LocalDateTime.now());
            paymentService.persist(payment);
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Update Payment")
    @PostMapping(value = "/update")
    public ResponseEntity update(@RequestBody PaymentPersistModel paymentModel, HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            User user = userServiceNew.findByPK(userId);
            if (paymentModel.getPaymentId() != null) {
                Payment payment = paymentService.findByPK(paymentModel.getPaymentId());
                if (paymentModel.getBankAccountId() != null) {
                    payment.setBankAccount(bankAccountService.findByPK(paymentModel.getBankAccountId()));
                }
                if (paymentModel.getSupplierId() != null) {
                    payment.setSupplier(contactService.findByPK(paymentModel.getSupplierId()));
                }
                if (paymentModel.getCurrencyCode() != null) {
                    payment.setCurrency(currencyService.findByPK(paymentModel.getCurrencyCode()));
                }
                if (paymentModel.getProjectId() != null) {
                    payment.setProject(projectService.findByPK(paymentModel.getProjectId()));
                }
                if (paymentModel.getInvoiceId() != null) {
                    payment.setInvoice(invoiceService.findByPK(paymentModel.getInvoiceId()));
                }
                payment.setInvoiceAmount(paymentModel.getInvoiceAmount());
                payment.setPaymentDate(paymentModel.getPaymentDate());
                payment.setDescription(paymentModel.getDescription());
                payment.setLastUpdateBy(user.getUserId());
                payment.setLastUpdateDate(LocalDateTime.now());
                paymentService.update(payment);
            }
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Delete Payment")
    @DeleteMapping(value = "/delete")
    public ResponseEntity deletePayment(@RequestParam(value = "id") Integer id) {
        Payment payment = paymentService.findByPK(id);
        if (payment != null) {
            payment.setDeleteFlag(Boolean.TRUE);
            paymentService.update(payment, payment.getPaymentId());
        }
        return new ResponseEntity(HttpStatus.OK);

    }

    @ApiOperation(value = "Delete Multiple Payments")
    @RequestMapping(method = RequestMethod.DELETE, value = "/deletes")
    public ResponseEntity deleteExpenses(@RequestBody DeleteModel expenseIds) {
        try {
            paymentModelHelper.deletePayments(expenseIds, paymentService);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

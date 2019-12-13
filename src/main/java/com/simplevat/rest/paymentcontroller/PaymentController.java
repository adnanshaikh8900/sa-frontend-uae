/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.paymentcontroller;

import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Payment;
import com.simplevat.entity.Project;
import com.simplevat.entity.invoice.Invoice;
import com.simplevat.helper.PaymentModelHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.rest.payment.model.PaymentModel;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.PaymentService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.invoice.InvoiceService;

import io.swagger.annotations.ApiOperation;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ashish
 */
@RestController
@RequestMapping(value = "/rest/payment")
public class PaymentController implements Serializable {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    private PaymentModelHelper paymentModelHelper = new PaymentModelHelper();

    @ApiOperation(value = "Get All Payments")
    @GetMapping(value = "/getlist")
    public ResponseEntity getPaymentList() {
        List<Payment> payments = paymentService.getPayments();
        if (payments != null) {
            return new ResponseEntity<>(payments, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/save")
    public ResponseEntity save(@ModelAttribute PaymentModel paymentModel) {
        try {
            Payment payment = paymentModelHelper.convertToPayment(paymentModel);
            if (paymentModel.getSupplierId() != null) {
                Contact supplier = contactService.findByPK(paymentModel.getSupplierId());
                if (supplier != null) {
                    payment.setSupplier(supplier);
                }
            }
            if (paymentModel.getInvoiceId() != null) {
                Invoice invoice = invoiceService.findByPK(paymentModel.getInvoiceId());
                if (invoice != null) {
                    payment.setInvoice(invoice);
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

}

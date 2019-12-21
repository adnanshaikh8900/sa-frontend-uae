package com.simplevat.helper;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.entity.Payment;
import com.simplevat.rest.payment.model.PaymentPersistModel;
import com.simplevat.rest.payment.model.PaymentViewModel;
import com.simplevat.service.PaymentService;
import java.text.ParseException;

public class PaymentModelHelper {

    public Payment convertToPayment(PaymentPersistModel paymentModel) throws ParseException {
        Payment payment = new Payment();
        if (paymentModel.getPaymentId() != null) {
            payment.setPaymentId(paymentModel.getPaymentId());
        }
        if (paymentModel.getPaymentDate() != null) {
            payment.setPaymentDate(paymentModel.getPaymentDate());
        }
        payment.setDescription(paymentModel.getDescription());
        payment.setInvoiceAmount(paymentModel.getInvoiceAmount());
        return payment;
    }

    public PaymentViewModel convertToPaymentViewModel(Payment payment) {
        PaymentViewModel paymentModel = new PaymentViewModel();
        paymentModel.setPaymentId(payment.getPaymentId());
        paymentModel.setInvoiceAmount(payment.getInvoiceAmount());
        if (payment.getBankAccount() != null) {
            paymentModel.setBankName(payment.getBankAccount().getBankAccountName());
        }
        if (payment.getSupplier() != null) {
            paymentModel.setSupplierName(payment.getSupplier().getFirstName());
        }
        if (payment.getInvoice() != null) {
            paymentModel.setInvoiceReferenceNo(payment.getInvoice().getInvoiceReferenceNumber());
        }
        paymentModel.setPaymentDate(payment.getPaymentDate());
        paymentModel.setDescription(payment.getDescription());
        paymentModel.setDeleteFlag(payment.getDeleteFlag());
        return paymentModel;
    }

    public PaymentPersistModel convertToPaymentPersistModel(Payment payment) {
        PaymentPersistModel paymentModel = new PaymentPersistModel();
        paymentModel.setPaymentId(payment.getPaymentId());
        paymentModel.setInvoiceAmount(payment.getInvoiceAmount());
        if (payment.getBankAccount() != null) {
            paymentModel.setBankAccountId(payment.getBankAccount().getBankAccountId());
        }
        if (payment.getSupplier() != null) {
            paymentModel.setSupplierId(payment.getSupplier().getContactId());
        }
        if (payment.getInvoice() != null) {
            paymentModel.setInvoiceId(payment.getInvoice().getInvoiceId());
        }
        if (payment.getCurrency() != null) {
            paymentModel.setCurrencyCode(payment.getCurrency().getCurrencyCode());
        }
        if (payment.getProject() != null) {
            paymentModel.setProjectId(payment.getProject().getProjectId());
        }
        paymentModel.setPaymentDate(payment.getPaymentDate());
        paymentModel.setDescription(payment.getDescription());
        paymentModel.setDeleteFlag(payment.getDeleteFlag());
        return paymentModel;
    }

    public void deletePayments(DeleteModel paymentIds, PaymentService paymentService) throws Exception {
        try {
            paymentService.deleteByIds(paymentIds.getIds());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

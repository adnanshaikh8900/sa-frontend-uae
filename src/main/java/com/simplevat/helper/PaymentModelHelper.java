package com.simplevat.helper;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.entity.Payment;
import com.simplevat.rest.payment.model.PaymentPersistModel;
import com.simplevat.rest.payment.model.PaymentViewModel;
import com.simplevat.service.PaymentService;
import java.math.BigDecimal;
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
        if (paymentModel.getPaymentDueDate() != null) {
            payment.setPaymentDueDate(paymentModel.getPaymentDueDate());
        }
        payment.setDescription(paymentModel.getDescription());
        payment.setInvoiceReferenceNo(paymentModel.getInvoiceReferenceNo());
        if (paymentModel.getAmount() != null) {
            payment.setInvoiceAmount(new BigDecimal(paymentModel.getAmount()));
        }
        payment.setReceiptNo(paymentModel.getReceiptNo());
        payment.setReceiptAttachmentDescription(paymentModel.getReceiptAttachmentDescription());
        return payment;
    }

    public PaymentViewModel convertToPaymentViewModel(Payment payment) {
        PaymentViewModel paymentModel = new PaymentViewModel();
        paymentModel.setPaymentId(payment.getPaymentId());
        paymentModel.setAmount(payment.getInvoiceAmount());
        paymentModel.setInvoiceReferenceNo(payment.getInvoiceReferenceNo());
        paymentModel.setPaymentDate(payment.getPaymentDate());
        if (payment.getBankAccount() != null) {
            paymentModel.setBankName(payment.getBankAccount().getBankAccountName());
        }
        if (payment.getSupplier() != null) {
            paymentModel.setSupplierName(payment.getSupplier().getFirstName());
        }
        paymentModel.setPaymentDueDate(payment.getPaymentDueDate());
        paymentModel.setDescription(payment.getDescription());
        paymentModel.setReceiptNo(payment.getReceiptNo());
        paymentModel.setReceiptAttachmentPath(payment.getReceiptAttachmentPath());
        paymentModel.setReceiptAttachmentDescription(payment.getReceiptAttachmentDescription());
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

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
        if (paymentModel.getPaymentDueDate() != null) {
            payment.setPaymentDueDate(paymentModel.getPaymentDueDate());
        }
        payment.setDescription(paymentModel.getDescription());
        payment.setReferenceNo(paymentModel.getReferenceNo());
        payment.setReceiptNo(paymentModel.getReceiptNo());
        payment.setReceiptAttachmentDescription(paymentModel.getReceiptAttachmentDescription());
        return payment;
    }

    public PaymentViewModel convertToPaymentViewModel(Payment payment) {
        PaymentViewModel paymentModel = new PaymentViewModel();
        paymentModel.setPaymentId(payment.getPaymentId());
//        paymentModel.setPaymentNo(payment.get);
        paymentModel.setReferenceNo(payment.getReferenceNo());
        if (payment.getInvoice() != null) {
            paymentModel.setInvoiceNo(payment.getInvoice().getInvoiceReferenceNumber());
            if (payment.getInvoice().getInvoiceAmount() != null) {
                paymentModel.setAmount(payment.getInvoice().getInvoiceAmount().intValue());
            }
        }
        paymentModel.setPaymentDate(payment.getPaymentDate());
        if (payment.getBankAccount() != null) {
            paymentModel.setBankName(payment.getBankAccount().getBankAccountName());
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

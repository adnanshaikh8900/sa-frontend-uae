package com.simplevat.helper;

import com.simplevat.entity.Payment;
import com.simplevat.rest.payment.model.PaymentModel;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class PaymentModelHelper {

    public Payment convertToPayment(PaymentModel paymentModel) throws ParseException {
        Payment payment = new Payment();
        if (paymentModel.getPaymentId() != null) {
            payment.setPaymentId(paymentModel.getPaymentId());
        }       
        if (paymentModel.getPaymentDate() != null ) {
            payment.setPaymentDate(paymentModel.getPaymentDate());
        }       
        if (paymentModel.getPaymentDueDate() != null ) {
            payment.setPaymentDueDate(paymentModel.getPaymentDueDate());
        }       
        payment.setDescription(paymentModel.getDescription());
        payment.setReceiptNo(paymentModel.getReceiptNo());
        payment.setReceiptAttachmentPath(paymentModel.getReceiptAttachmentPath());
        payment.setReceiptAttachmentDescription(paymentModel.getReceiptAttachmentDescription());
        return payment;
    }

    public PaymentModel convertToPaymentModel(Payment payment) {
        PaymentModel paymentModel = new PaymentModel();
        return paymentModel;
    }
}

package com.simplevat.rest.taxescontroller;

import com.simplevat.entity.*;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.PaymentService;
import com.simplevat.service.ReceiptService;
import com.simplevat.service.bankaccount.TransactionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class TaxesRestHelper {

@Autowired
    InvoiceService invoiceService;

    @Autowired
    ExpenseService expenseService;

    @Autowired
    PaymentService paymentService;

    @Autowired
    ReceiptService receiptService;

    @Autowired
    TransactionService transactionService;

    public  List<VatListModel> getListModel(Object vatTransation) {
        List<VatListModel> vatListModels = new ArrayList<>();
        if (vatTransation != null) {
            for (JournalLineItem journalLineItem : (List<JournalLineItem>) vatTransation) {
                VatListModel model = new VatListModel();
                model.setVatType(journalLineItem.getTransactionCategory().getTransactionCategoryName());
                model.setReferenceType(journalLineItem.getReferenceType().getDisplayName());
                model.setDate(journalLineItem.getCreatedDate());
                switch (journalLineItem.getReferenceType()) {
                    case INVOICE:
                        Invoice invoice = invoiceService.findByPK(journalLineItem.getReferenceId());
                        if (invoice != null){
                            model.setAmount(invoice.getTotalAmount());
                            model.setVatAmount(invoice.getTotalVatAmount());
                        }
                        break;
                    case EXPENSE:
                        Expense expense = expenseService.findByPK(journalLineItem.getReferenceId());
                        if(expense != null){
                            model.setAmount(expense.getExpenseAmount());
                            model.setVatAmount(
                                    journalLineItem.getDebitAmount() != null ? journalLineItem.getDebitAmount() :
                                            journalLineItem.getCreditAmount());
                        }
                        break;
                        case PAYMENT:
                        Payment payment = paymentService.findByPK(journalLineItem.getReferenceId());
                        if (payment != null){
                            model.setAmount(payment.getInvoiceAmount());
                            model.setVatAmount(
                                    journalLineItem.getDebitAmount() != null ? journalLineItem.getDebitAmount() :
                                            journalLineItem.getCreditAmount());
                        }
                          break;
                    case RECEIPT:
                        Receipt receipt = receiptService.findByPK(journalLineItem.getReferenceId());
                        if (receipt != null){
                            model.setAmount(receipt.getAmount());
                            model.setVatAmount(
                                    journalLineItem.getDebitAmount() != null ? journalLineItem.getDebitAmount() :
                                            journalLineItem.getCreditAmount());
                        }
                        break;
                    case TRANSACTION_RECONSILE:
                        Transaction transaction = transactionService.findByPK(journalLineItem.getReferenceId());
                        if(transaction != null){
                            model.setAmount(transaction.getTransactionAmount());
                            model.setVatAmount( journalLineItem.getDebitAmount() != null ? journalLineItem.getDebitAmount() :
                                    journalLineItem.getCreditAmount());
                        }
                    default:
                        break;
                }
                vatListModels.add(model);

            }
        }
        return vatListModels;
    }

}
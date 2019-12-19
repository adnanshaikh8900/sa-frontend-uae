/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.entity.Project;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.rest.transactioncontroller.TransactionPresistModel;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.bankaccount.TransactionTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Uday
 */
@Service
public class TransactionHelper {

    @Autowired
    private TransactionTypeService transactionTypeService;

    @Autowired
    private TransactionCategoryService transactionCategoryService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private BankAccountService bankAccountService;

    public Transaction getEntity(TransactionPresistModel transactionModel) {
        Transaction transaction = new Transaction();
        if (transactionModel.getBankAccountId() != null) {
            BankAccount bankAccount = bankAccountService.getBankAccountById(transactionModel.getBankAccountId());
            bankAccount.setBankAccountId(transactionModel.getBankAccountId());
            transaction.setBankAccount(bankAccount);
        }
        if (transactionModel.getTransactionTypeCode() != null) {
            TransactionType transactionType = transactionTypeService.getTransactionType(transactionModel.getTransactionTypeCode());
            transactionType.setTransactionTypeCode(transactionModel.getTransactionTypeCode());
            transaction.setTransactionType(transactionType);
            transaction.setDebitCreditFlag(transactionType.getDebitCreditFlag());
        }

        transaction.setTransactionDate(transactionModel.getTransactionDate());
        if (transactionModel.getTransactionCategoryId() != null) {
            TransactionCategory transactionCategory = transactionCategoryService.findByPK(transactionModel.getTransactionCategoryId());
            transaction.setExplainedTransactionCategory(transactionCategory);
        }
        transaction.setTransactionDescription(transactionModel.getTransactionDescription());
        if (transactionModel.getProjectId() != null) {
            Project project = projectService.findByPK(transactionModel.getProjectId());
            transaction.setProject(project);
        }
        transaction.setTransactionAmount(transactionModel.getTransactionAmount());
        transaction.setReceiptNumber(transactionModel.getReceiptNumber());
        transaction.setExplainedTransactionAttachementDescription(transactionModel.getAttachementDescription());
        transaction.setExplainedTransactionAttachement(transactionModel.getAttachment());

        return transaction;
    }

}

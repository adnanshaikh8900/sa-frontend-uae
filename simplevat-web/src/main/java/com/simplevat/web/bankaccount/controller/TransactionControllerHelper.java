package com.simplevat.web.bankaccount.controller;

import com.simplevat.entity.Purchase;
import com.simplevat.entity.bankaccount.BankAccount;
import java.io.InputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;

import org.primefaces.model.DefaultStreamedContent;
import com.simplevat.web.bankaccount.model.TransactionModel;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionView;
import com.simplevat.entity.invoice.Invoice;
import com.simplevat.service.PurchaseService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.service.invoice.InvoiceService;
import com.simplevat.web.bankaccount.model.BankAccountModel;
import com.simplevat.web.bankaccount.model.TransactionViewModel;
import com.simplevat.web.constant.TransactionRefrenceTypeConstant;
import com.simplevat.web.constant.TransactionStatusConstant;
import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TransactionControllerHelper {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionStatusService transactionStatusService;

    @Getter
    @Setter
    private List<TransactionViewModel> childTransactions = new ArrayList<>();

    public Transaction getTransactionEntity(TransactionModel model) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(model.getTransactionId());
        if (model.getTransactionDate() != null) {
            LocalDateTime transactionDate = Instant.ofEpochMilli(model.getTransactionDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
            transaction.setTransactionDate(transactionDate);
        }
        transaction.setTransactionDescription(model.getTransactionDescription());
        transaction.setTransactionAmount(model.getTransactionAmount());
        transaction.setTransactionType(model.getTransactionType());
        transaction.setReceiptNumber(model.getReceiptNumber());
        transaction.setDebitCreditFlag(model.getDebitCreditFlag());
        transaction.setProject(model.getProject());
        transaction.setExplainedTransactionCategory(model.getExplainedTransactionCategory());
        transaction.setExplainedTransactionDescription(model.getExplainedTransactionDescription());
        transaction.setExplainedTransactionAttachementDescription(model.getExplainedTransactionAttachementDescription());
        transaction.setExplainedTransactionAttachement(model.getExplainedTransactionAttachement());
        transaction.setBankAccount(model.getBankAccount());
        transaction.setTransactionStatus(model.getTransactionStatus());
        transaction.setCurrentBalance(model.getCurrentBalance());
        transaction.setCreatedBy(model.getCreatedBy());
        transaction.setCreatedDate(model.getCreatedDate());
        transaction.setLastUpdateBy(model.getLastUpdatedBy());
        transaction.setLastUpdateDate(model.getLastUpdateDate());
        transaction.setDeleteFlag(model.getDeleteFlag());
        transaction.setVersionNumber(model.getVersionNumber());
        transaction.setEntryType(model.getEntryType());
        transaction.setParentTransaction(model.getParentTransaction());
        transaction.setReferenceId(model.getReferenceId());
        transaction.setReferenceType(model.getReferenceType());
        if (model.getChildTransactionList() != null && !model.getChildTransactionList().isEmpty()) {
            model.getChildTransactionList().remove(model.getChildTransactionList().size() - 1);
        }

        transaction.setChildTransactionList(getChildTransactionList(model.getChildTransactionList()));
        return transaction;
    }

    public TransactionModel getTransactionModel(Transaction entity) {
        TransactionModel transactionModel = new TransactionModel();
        transactionModel.setTransactionId(entity.getTransactionId());

        if (entity.getTransactionDate() != null) {
            Date transactionDate = Date.from(entity.getTransactionDate().atZone(ZoneId.systemDefault()).toInstant());
            transactionModel.setTransactionDate(transactionDate);
        }

        transactionModel.setTransactionDescription(entity.getTransactionDescription());
        transactionModel.setTransactionAmount(entity.getTransactionAmount());
        transactionModel.setTransactionType(entity.getTransactionType());
        transactionModel.setReceiptNumber(entity.getReceiptNumber());
        transactionModel.setDebitCreditFlag(entity.getDebitCreditFlag());
        transactionModel.setProject(entity.getProject());
        transactionModel.setExplainedTransactionCategory(entity.getExplainedTransactionCategory());
        transactionModel.setExplainedTransactionDescription(entity.getExplainedTransactionDescription());
        transactionModel.setExplainedTransactionAttachementDescription(entity.getExplainedTransactionAttachementDescription());
        transactionModel.setExplainedTransactionAttachement(entity.getExplainedTransactionAttachement());
        transactionModel.setTransactionStatus(entity.getTransactionStatus());
        transactionModel.setBankAccount(entity.getBankAccount());
        transactionModel.setCurrentBalance(entity.getCurrentBalance());
        transactionModel.setCreatedBy(entity.getCreatedBy());
        transactionModel.setCreatedDate(entity.getCreatedDate());
        transactionModel.setLastUpdatedBy(entity.getLastUpdateBy());
        transactionModel.setLastUpdateDate(entity.getLastUpdateDate());
        transactionModel.setDeleteFlag(entity.getDeleteFlag());
        transactionModel.setVersionNumber(entity.getVersionNumber());
        transactionModel.setEntryType(entity.getEntryType());
        transactionModel.setParentTransaction(entity.getParentTransaction());
        transactionModel.setReferenceId(entity.getReferenceId());
        transactionModel.setReferenceType(entity.getReferenceType());
        transactionModel.setChildTransactionList(getChildTransactionModelList(entity.getChildTransactionList()));
        if (entity.getReferenceType() != null) {
            if (entity.getReferenceType() == TransactionRefrenceTypeConstant.INVOICE) {
                transactionModel.setReferenceTypeName("Invoice");
                Invoice invoice = invoiceService.findByPK(entity.getReferenceId());
                transactionModel.setRefObject(invoice);
                transactionModel.setReferenceName("Invoice : " + invoice.getInvoiceReferenceNumber());
            } else if (entity.getReferenceType() == TransactionRefrenceTypeConstant.PURCHASE) {
                transactionModel.setReferenceTypeName("Purchase");
                Purchase purchase = purchaseService.findByPK(entity.getReferenceId());
                transactionModel.setRefObject(purchase);
                transactionModel.setReferenceName("Purchase : " + purchase.getReceiptNumber());
            }
        }

        byte[] attachmentPath = entity.getExplainedTransactionAttachement();
        if (attachmentPath != null) {
            InputStream inputStream = new ByteArrayInputStream(attachmentPath);
            transactionModel.setAttachmentFileContent(new DefaultStreamedContent(inputStream));
        }

        return transactionModel;
    }

    public BankAccount getBankAccount(BankAccountModel model) {
        BankAccount bankAccount = new BankAccount();
        bankAccount.setBankAccountId(model.getBankAccountId());
        bankAccount.setAccountNumber(model.getAccountNumber());
        bankAccount.setBankAccountCurrency(model.getBankAccountCurrency());
        bankAccount.setBankAccountName(model.getBankAccountName());
        bankAccount.setBankAccountStatus(model.getBankAccountStatus());
        bankAccount.setBankCountry(model.getBankCountry());
        bankAccount.setBankFeedStatusCode(model.getBankFeedStatusCode());
        bankAccount.setBankName(model.getBankName());
        bankAccount.setCreatedBy(model.getCreatedBy());
        bankAccount.setCreatedDate(model.getCreatedDate());
        bankAccount.setCurrentBalance(model.getCurrentBalance());
        bankAccount.setDeleteFlag(model.getDeleteFlag());
        bankAccount.setIbanNumber(model.getIbanNumber());
        bankAccount.setIsprimaryAccountFlag(model.getIsprimaryAccountFlag());
        bankAccount.setLastUpdateDate(model.getLastUpdateDate());
        bankAccount.setLastUpdatedBy(model.getLastUpdatedBy());
        bankAccount.setOpeningBalance(model.getOpeningBalance());
        bankAccount.setPersonalCorporateAccountInd(model.getPersonalCorporateAccountInd());
        bankAccount.setSwiftCode(model.getSwiftCode());
        bankAccount.setVersionNumber(model.getVersionNumber());
        return bankAccount;
    }

    private Collection<Transaction> getChildTransactionList(Collection<TransactionModel> childTransactionModelList) {
        Collection<Transaction> transactionList = new ArrayList<>();
        if (childTransactionModelList != null && !childTransactionModelList.isEmpty()) {
            for (TransactionModel model : childTransactionModelList) {
                Transaction transaction = new Transaction();
                transaction.setTransactionId(model.getTransactionId());
                if (model.getTransactionDate() != null) {
                    LocalDateTime transactionDate = Instant.ofEpochMilli(model.getTransactionDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
                    transaction.setTransactionDate(transactionDate);
                }
                transaction.setTransactionDescription(model.getTransactionDescription());
                transaction.setTransactionAmount(model.getTransactionAmount());
                transaction.setTransactionType(model.getTransactionType());
                transaction.setReceiptNumber(model.getReceiptNumber());
                transaction.setDebitCreditFlag(model.getDebitCreditFlag());
                transaction.setProject(model.getProject());
                transaction.setExplainedTransactionCategory(model.getExplainedTransactionCategory());
                transaction.setExplainedTransactionDescription(model.getExplainedTransactionDescription());
                transaction.setExplainedTransactionAttachementDescription(model.getExplainedTransactionAttachementDescription());
                transaction.setExplainedTransactionAttachement(model.getExplainedTransactionAttachement());
                transaction.setBankAccount(model.getBankAccount());
                transaction.setTransactionStatus(model.getTransactionStatus());
                transaction.setCurrentBalance(model.getCurrentBalance());
                transaction.setCreatedBy(model.getCreatedBy());
                transaction.setCreatedDate(model.getCreatedDate());
                transaction.setLastUpdateBy(model.getLastUpdatedBy());
                transaction.setLastUpdateDate(model.getLastUpdateDate());
                transaction.setDeleteFlag(model.getDeleteFlag());
                transaction.setVersionNumber(model.getVersionNumber());
                transaction.setEntryType(model.getEntryType());
                transaction.setParentTransaction(model.getParentTransaction());
                transaction.setReferenceId(model.getReferenceId());
                transaction.setReferenceType(model.getReferenceType());

                transactionList.add(transaction);
            }
        }
        return transactionList;
    }

    private List<TransactionModel> getChildTransactionModelList(Collection<Transaction> childTransactionList) {
        List<TransactionModel> transactionModelList = new ArrayList<>();
        if (childTransactionList != null && !childTransactionList.isEmpty()) {
            for (Transaction transaction : childTransactionList) {
                TransactionModel transactionModel = new TransactionModel();
                transactionModel.setTransactionId(transaction.getTransactionId());

                if (transaction.getTransactionDate() != null) {
                    Date transactionDate = Date.from(transaction.getTransactionDate().atZone(ZoneId.systemDefault()).toInstant());
                    transactionModel.setTransactionDate(transactionDate);
                }

                transactionModel.setTransactionDescription(transaction.getTransactionDescription());
                transactionModel.setTransactionAmount(transaction.getTransactionAmount());
                transactionModel.setTransactionType(transaction.getTransactionType());
                transactionModel.setReceiptNumber(transaction.getReceiptNumber());
                transactionModel.setDebitCreditFlag(transaction.getDebitCreditFlag());
                transactionModel.setProject(transaction.getProject());
                transactionModel.setExplainedTransactionCategory(transaction.getExplainedTransactionCategory());
                transactionModel.setExplainedTransactionDescription(transaction.getExplainedTransactionDescription());
                transactionModel.setExplainedTransactionAttachementDescription(transaction.getExplainedTransactionAttachementDescription());
                transactionModel.setExplainedTransactionAttachement(transaction.getExplainedTransactionAttachement());
                transactionModel.setTransactionStatus(transaction.getTransactionStatus());
                transactionModel.setBankAccount(transaction.getBankAccount());
                transactionModel.setCurrentBalance(transaction.getCurrentBalance());
                transactionModel.setCreatedBy(transaction.getCreatedBy());
                transactionModel.setCreatedDate(transaction.getCreatedDate());
                transactionModel.setLastUpdatedBy(transaction.getLastUpdateBy());
                transactionModel.setLastUpdateDate(transaction.getLastUpdateDate());
                transactionModel.setDeleteFlag(transaction.getDeleteFlag());
                transactionModel.setVersionNumber(transaction.getVersionNumber());
                transactionModel.setEntryType(transaction.getEntryType());
                transactionModel.setParentTransaction(transaction.getParentTransaction());
                transactionModel.setReferenceId(transaction.getReferenceId());
                transactionModel.setReferenceType(transaction.getReferenceType());
                if (transaction.getReferenceType() != null) {
                    if (transaction.getReferenceType() == TransactionRefrenceTypeConstant.INVOICE) {
                        transactionModel.setReferenceTypeName("Invoice");
                        Invoice invoice = invoiceService.findByPK(transaction.getReferenceId());
                        transactionModel.setRefObject(invoice);
                        transactionModel.setReferenceName("Invoice : " + invoice.getInvoiceReferenceNumber());
                    } else if (transaction.getReferenceType() == TransactionRefrenceTypeConstant.PURCHASE) {
                        transactionModel.setReferenceTypeName("Purchase");
                        Purchase purchase = purchaseService.findByPK(transaction.getReferenceId());
                        transactionModel.setRefObject(purchase);
                        transactionModel.setReferenceName("Purchase : " + purchase.getReceiptNumber());
                    }
                }
                transactionModelList.add(transactionModel);
            }
        }
        return transactionModelList;
    }

    public TransactionView getTransactionView(TransactionViewModel transactionViewModel) {
        TransactionView transactionView = new TransactionView();
        transactionView.setTransactionId(transactionViewModel.getTransactionId());
        transactionView.setTransactionDate(transactionViewModel.getTransactionDate());
        transactionView.setTransactionDescription(transactionViewModel.getTransactionDescription());
        transactionView.setTransactionAmount(transactionViewModel.getTransactionAmount());
        transactionView.setTransactionTypeName(transactionViewModel.getTransactionTypeName());
        transactionView.setDebitCreditFlag(transactionViewModel.getDebitCreditFlag());
        transactionView.setTransactionCategoryName(transactionViewModel.getTransactionCategoryName());
        transactionView.setExplanationStatusCode(transactionViewModel.getExplanationStatusCode());
        transactionView.setExplanationStatusName(transactionViewModel.getExplanationStatusName());
        transactionView.setBankAccountId(transactionViewModel.getBankAccountId());
        transactionView.setCurrentBalance(transactionViewModel.getCurrentBalance());
        transactionView.setEntryType(transactionViewModel.getEntryType());
        transactionView.setParentTransaction(transactionViewModel.getParentTransaction());
        transactionView.setReferenceId(transactionViewModel.getReferenceId());
        transactionView.setReferenceType(transactionViewModel.getReferenceType());
        transactionView.setContactName(transactionViewModel.getContactName());
        transactionView.setReferenceName(transactionViewModel.getReferenceName());
        transactionView.setDueAmount(transactionViewModel.getDueAmount());
        transactionView.setCurrencySymbol(transactionViewModel.getCurrencySymbol());
        transactionView.setDueOn(transactionViewModel.getDueOn());
        return transactionView;
    }

    public TransactionViewModel getTransactionViewModel(TransactionView transactionView) {
        TransactionViewModel transactionViewModel = new TransactionViewModel();
        transactionViewModel.setTransactionId(transactionView.getTransactionId());
        transactionViewModel.setTransactionDate(transactionView.getTransactionDate());
        transactionViewModel.setTransactionDescription(transactionView.getTransactionDescription());
        transactionViewModel.setTransactionAmount(transactionView.getTransactionAmount());
        transactionViewModel.setTransactionTypeName(transactionView.getTransactionTypeName());
        transactionViewModel.setDebitCreditFlag(transactionView.getDebitCreditFlag());
        transactionViewModel.setTransactionCategoryName(transactionView.getTransactionCategoryName());
        transactionViewModel.setExplanationStatusCode(transactionView.getExplanationStatusCode());
        transactionViewModel.setExplanationStatusName(transactionView.getExplanationStatusName());
        transactionViewModel.setBankAccountId(transactionView.getBankAccountId());
        transactionViewModel.setCurrentBalance(transactionView.getCurrentBalance());
        transactionViewModel.setEntryType(transactionView.getEntryType());
        transactionViewModel.setParentTransaction(transactionView.getParentTransaction());
        transactionViewModel.setReferenceId(transactionView.getReferenceId());
        transactionViewModel.setReferenceType(transactionView.getReferenceType());
        transactionViewModel.setContactName(transactionView.getContactName());
        transactionViewModel.setReferenceName(transactionView.getReferenceName());
        transactionViewModel.setDueAmount(transactionView.getDueAmount());
        transactionViewModel.setCurrencySymbol(transactionView.getCurrencySymbol());
        transactionViewModel.setDueOn(transactionView.getDueOn());
        if (transactionViewModel.isParent()) {
            transactionViewModel.setChildTransactionList(getChildTransactionViewModelList(childTransactions, transactionView.getTransactionId()));
        }
        BigDecimal remainingUnExplainedAmount = transactionViewModel.getTransactionAmount();
        for (TransactionViewModel childTransactionViewModel : transactionViewModel.getChildTransactionList()) {
            remainingUnExplainedAmount = remainingUnExplainedAmount.subtract(childTransactionViewModel.getTransactionAmount());
        }
        if (remainingUnExplainedAmount.doubleValue() > 0.00) {
            if (transactionViewModel.getChildTransactionList() != null && !transactionViewModel.getChildTransactionList().isEmpty()) {
                TransactionViewModel remainingUnExplainedTransactionModel = new TransactionViewModel();
                remainingUnExplainedTransactionModel.setTransactionId(0);
                remainingUnExplainedTransactionModel.setDebitCreditFlag(transactionView.getDebitCreditFlag());
                remainingUnExplainedTransactionModel.setExplanationStatusCode(TransactionStatusConstant.UNEXPLAINED);
                remainingUnExplainedTransactionModel.setExplanationStatusName("UNEXPLAINED");
                remainingUnExplainedTransactionModel.setTransactionAmount(remainingUnExplainedAmount);
                remainingUnExplainedTransactionModel.setParentTransaction(transactionView.getTransactionId());
                transactionViewModel.getChildTransactionList().add(remainingUnExplainedTransactionModel);
            }
        }
        return transactionViewModel;
    }

    private List<TransactionViewModel> getChildTransactionViewModelList(Collection<TransactionViewModel> childTransactionList, Integer parentTransactionViewModelId) {
        List<TransactionViewModel> transactionModelList = new ArrayList<>();
        if (childTransactionList != null && !childTransactionList.isEmpty()) {
            childTransactionList.stream().filter((transactionViewModel) -> (transactionViewModel.getParentTransaction() == parentTransactionViewModelId)).forEachOrdered((transactionViewModel) -> {
                transactionModelList.add(transactionViewModel);
            });
        }
        return transactionModelList;
    }

}

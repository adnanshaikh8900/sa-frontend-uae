/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest;

import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryService;
import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 *
 * @author uday
 */
public abstract class AbstractDoubleEntryRestController {

    @Autowired
    TransactionCategoryService transactionCategoryService;

    @Autowired
    JournalService journalService;

    @ApiOperation(value = "Post Journal Entry")
    @PostMapping(value = "/posting")
    public ResponseEntity posting(@RequestBody PostingRequestModel postingRequestModel, HttpServletRequest request) {
        Journal journal = null;
        if (postingRequestModel.getPostingRefType().equalsIgnoreCase(PostingReferenceTypeEnum.INVOICE.name())) {
            journal = invoicePosting(postingRequestModel);
        }

        if (journal != null) {
            journalService.persist(journal);
        }

        return null;
    }

    private Journal invoicePosting(PostingRequestModel postingRequestModel) {
        List<JournalLineItem> journalLineItemList = new ArrayList();

        Journal journal = new Journal();
        JournalLineItem journalLineItem1 = new JournalLineItem();
        TransactionCategory transactionCategory = transactionCategoryService.findTransactionCategoryByTransactionCategoryCode(TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode());
        journalLineItem1.setTransactionCategory(transactionCategory);
        journalLineItem1.setDebitAmount(postingRequestModel.getAmount());
        journalLineItem1.setReferenceType(PostingReferenceTypeEnum.INVOICE);
        journalLineItem1.setReferenceId(postingRequestModel.getPostingRefId());
        journalLineItemList.add(journalLineItem1);

        JournalLineItem journalLineItem2 = new JournalLineItem();
        TransactionCategory saleTransactionCategory = transactionCategoryService.findTransactionCategoryByTransactionCategoryCode(TransactionCategoryCodeEnum.SALE.getCode());
        journalLineItem2.setTransactionCategory(saleTransactionCategory);
        journalLineItem2.setCreditAmount(postingRequestModel.getAmount());
        journalLineItem2.setReferenceType(PostingReferenceTypeEnum.INVOICE);
        journalLineItem2.setReferenceId(postingRequestModel.getPostingRefId());
        journalLineItemList.add(journalLineItem2);
        journal.setJournalLineItems(journalLineItemList);
        return journal;
    }
}

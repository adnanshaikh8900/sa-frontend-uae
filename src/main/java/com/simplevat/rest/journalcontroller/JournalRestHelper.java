package com.simplevat.rest.journalcontroller;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.User;
import com.simplevat.rest.invoicecontroller.InvoiceRestHelper;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.UserService;
import com.simplevat.service.VatCategoryService;
import java.util.Date;

@Component
public class JournalRestHelper {

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private JournalService journalService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private UserService userService;

    @Autowired
    private VatCategoryService vatCategoryService;

    @Autowired
    private TransactionCategoryService transactionCategoryService;

    public Journal getEntity(JournalRequestModel journalRequestModel, Integer userId) {
        Journal journal = new Journal();
        if (journalRequestModel.getId() != null) {
            journal = journalService.findByPK(journalRequestModel.getId());
        }
        if (journalRequestModel.getCurrencyCode() != null) {
            journal.setCurrency(currencyService.getCurrency(journalRequestModel.getCurrencyCode()));
        }
        journal.setReferenceCode(journalRequestModel.getReferenceCode());
        if (journalRequestModel.getJournalDate() != null) {
            LocalDateTime journalDate = Instant.ofEpochMilli(journalRequestModel.getJournalDate().getTime())
                    .atZone(ZoneId.systemDefault()).toLocalDateTime();
            journal.setJournalDate(journalDate);
        }
        journal.setDescription(journalRequestModel.getDescription());
        if (journalRequestModel.getSubTotalCreditAmount() != null) {
            journal.setSubTotalCreditAmount(journalRequestModel.getSubTotalCreditAmount());
        }
        if (journalRequestModel.getSubTotalDebitAmount() != null) {
            journal.setSubTotalDebitAmount(journalRequestModel.getSubTotalDebitAmount());
        }
        if (journalRequestModel.getTotalCreditAmount() != null) {
            journal.setTotalCreditAmount(journalRequestModel.getTotalCreditAmount());
        }
        if (journalRequestModel.getTotalDebitAmount() != null) {
            journal.setTotalDebitAmount(journalRequestModel.getTotalDebitAmount());
        }
        List<JournalLineItemRequestModel> itemModels = new ArrayList<>();
        if (journalRequestModel.getJournalLineItems() != null
                && !journalRequestModel.getJournalLineItems().isEmpty()) {
            itemModels = journalRequestModel.getJournalLineItems();
            if (itemModels.size() > 0) {
                journal.setJournalLineItems(getLineItems(itemModels, journal, userId));
            }
        }
        return journal;
    }

    public List<JournalLineItem> getLineItems(List<JournalLineItemRequestModel> itemModels, Journal journal,
            Integer userId) {
        List<JournalLineItem> lineItems = new ArrayList<>();
        for (JournalLineItemRequestModel model : itemModels) {
            try {
                JournalLineItem lineItem = new JournalLineItem();
                lineItem.setCreatedBy(userId);
                lineItem.setCreatedDate(LocalDateTime.now());
                lineItem.setDeleteFlag(false);
                lineItem.setDescription(model.getDescription());
                if (model.getContactId() != null) {
                    lineItem.setContact(contactService.findByPK(model.getContactId()));
                }
                if (model.getVatCategoryId() != null) {
                    lineItem.setVatCategory(vatCategoryService.findByPK(model.getVatCategoryId()));
                }
                if (model.getCreditAmount() != null) {
                    lineItem.setCreditAmount(model.getCreditAmount());
                }
                lineItem.setDebitAmount(model.getDebitAmount());

                if (model.getTransactionCategoryId() != null) {
                    lineItem.setTransactionCategory(
                            transactionCategoryService.findByPK(model.getTransactionCategoryId()));
                }
                lineItem.setJournal(journal);
                lineItems.add(lineItem);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        return lineItems;
    }

    public List<JournalModel> getListModel(List<Journal> journals) {

        if (journals != null && journals.size() > 0) {

            List<JournalModel> journalModelList = new ArrayList<JournalModel>();

            for (Journal journal : journals) {
                journalModelList.add(getModel(journal));
            }
            return journalModelList;
        }
        return null;
    }

    public JournalModel getModel(Journal journal) {

        if (journal != null) {
            JournalModel model = new JournalModel();
            // XXX: need to add attribute accordingly
            model.setJournalId(journal.getId());
            model.setDescription(journal.getDescription());
            model.setReferenceCode(journal.getReferenceCode());
            model.setSubTotalCreditAmount(journal.getSubTotalCreditAmount());
            model.setSubTotalDebitAmount(journal.getSubTotalDebitAmount());
            model.setTotalCreditAmount(journal.getTotalCreditAmount());
            model.setTotalDebitAmount(journal.getTotalDebitAmount());
            if (journal.getJournalDate() != null) {
                Date journalDate = Date.from(journal.getJournalDate().atZone(ZoneId.systemDefault()).toInstant());
                model.setJournalDate(journalDate);
            }
            if (journal.getCurrency() != null) {
                model.setCurrencyId(journal.getCurrency().getCurrencyCode());
            }
            if (journal.getCreatedBy() != null) {
                User user = userService.findByPK(journal.getCreatedBy());
                if (user != null) {
                    model.setCreatedByName(user.getFirstName() + " " + user.getLastName());
                }
            }
            return model;
        }
        return null;
    }
}

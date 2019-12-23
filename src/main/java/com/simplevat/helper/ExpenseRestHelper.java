/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.contact.model.ExpenseItemModel;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.entity.Expense;
import com.simplevat.entity.User;
import com.simplevat.entity.VatCategory;
import com.simplevat.rest.expenses.ExpenseRestModel;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author daynil
 */
@Component
public class ExpenseRestHelper implements Serializable {

    private final static Logger LOGGER = LoggerFactory.getLogger(ExpenseRestHelper.class);

    @Autowired
    private VatCategoryService vatCategoryService;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private ProjectService projectService;

    public Expense getExpenseEntity(ExpenseRestModel model, User user) throws Exception {

        Expense.ExpenseBuilder expenseBuilder = Expense.builder()
                .expenseId(model.getExpenseId() != null ? model.getExpenseId() : null)
                .createdBy(model.getCreatedBy())
                .createdDate(model.getCreatedDate())
                .deleteFlag(model.isDeleteFlag())
                .expenseAmount(model.getExpenseAmount())
                .payee(model.getPayee());
        if (model.getExpenseDate() != null) {
            LocalDateTime expenseDate = Instant.ofEpochMilli(model.getExpenseDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
            expenseBuilder.expenseDate(expenseDate);
        }
        expenseBuilder.expenseDescription(model.getExpenseDescription())
                .lastUpdateBy(model.getLastUpdatedBy())
                .lastUpdateDate(model.getLastUpdateDate())
                .receiptAttachmentDescription(model.getReceiptAttachmentDescription())
                .receiptAttachmentPath(model.getReceiptAttachmentPath())
                .receiptNumber(model.getReceiptNumber())
                .versionNumber(model.getVersionNumber());
        if (model.getCurrencyCode() != null) {
            expenseBuilder.currency(currencyService.findByPK(model.getCurrencyCode()));
        }
        if (model.getProjectId() != null) {
            expenseBuilder.project(projectService.findByPK(model.getProjectId()));
        }

        if (model.getExpenseId() == null || model.getExpenseId() == 0) {
            expenseBuilder.deleteFlag(false);
            expenseBuilder.createdBy(user.getUserId());
            expenseBuilder.createdDate(LocalDateTime.now());
        } else {
            expenseBuilder.lastUpdateDate(LocalDateTime.now());
            expenseBuilder.lastUpdateBy(user.getUserId());
        }

        Expense expense = expenseBuilder.build();
        return expense;
    }

    public ExpenseRestModel getExpenseModel(Expense entity) {
        try {
            ExpenseRestModel expenseModel = new ExpenseRestModel();
            expenseModel.setExpenseId(entity.getExpenseId());
            expenseModel.setCreatedBy(entity.getCreatedBy());
            expenseModel.setCreatedDate(entity.getCreatedDate());
            if (entity.getCurrency() != null) {
                expenseModel.setCurrencyCode(entity.getCurrency().getCurrencyCode());
            }
            expenseModel.setDeleteFlag(entity.getDeleteFlag());
            expenseModel.setExpenseAmount(entity.getExpenseAmount());
            expenseModel.setPayee(entity.getPayee());
            if (entity.getExpenseDate() != null) {
                Date expenseDate = Date.from(entity.getExpenseDate().atZone(ZoneId.systemDefault()).toInstant());
                expenseModel.setExpenseDate(expenseDate);
            }
            expenseModel.setExpenseDescription(entity.getExpenseDescription());
            expenseModel.setLastUpdateDate(entity.getLastUpdateDate());
            expenseModel.setLastUpdatedBy(entity.getLastUpdateBy());
            expenseModel.setLastUpdatedBy(entity.getLastUpdateBy());
            if (entity.getProject() != null) {
                expenseModel.setProjectId(entity.getProject().getProjectId());
            }
            expenseModel.setReceiptAttachmentDescription(entity.getReceiptAttachmentDescription());
            expenseModel.setReceiptAttachmentPath(entity.getReceiptAttachmentPath());
            expenseModel.setReceiptNumber(entity.getReceiptNumber());
            if (entity.getTransactionCategory() != null) {
                expenseModel.setTransactionCategory(entity.getTransactionCategory().getTransactionCategoryId());
            }

            expenseModel.setVersionNumber(entity.getVersionNumber());

            return expenseModel;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private void updateSubTotal(@NonNull final ExpenseItemModel expenseItemModel) {
        final BigDecimal unitPrice = expenseItemModel.getUnitPrice();
        VatCategory vatCategory = vatCategoryService.findByPK(expenseItemModel.getVatCategoryId());
        if (null != unitPrice) {
            final BigDecimal amountWithoutTax = unitPrice.add(unitPrice.multiply(vatCategory.getVat()).divide(new BigDecimal(100)));
            expenseItemModel.setSubTotal(amountWithoutTax);
        }
    }

}

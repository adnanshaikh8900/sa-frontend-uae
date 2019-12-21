/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.contact.model.ExpenseItemModel;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.entity.Expense;
import com.simplevat.entity.ExpenseLineItem;
import com.simplevat.entity.User;
import com.simplevat.entity.VatCategory;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.expenses.ExpenseRestModel;
import com.simplevat.service.CurrencyService;
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
    private TransactionCategoryService transactionCategoryService;

    @Autowired
    private CurrencyService currencyService;

    public Expense getExpenseEntity(ExpenseRestModel model, User user) throws Exception {

        Expense.ExpenseBuilder expenseBuilder = Expense.builder()
                .expenseId(model.getExpenseId() != null ? model.getExpenseId() : null)
                .user(user)
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
                .versionNumber(model.getVersionNumber())
                .receiptAttachmentName(model.getReceiptAttachmentName())
                .receiptAttachmentContentType(model.getReceiptAttachmentContentType())
                .expenseAmount(model.getTotalAmount())
                .expenseVATAmount(model.getExpenseVATAmount());

        CurrencyConversion currencyConversion = currencyService.getCurrencyRateFromCurrencyConversion(model.getCurrencyCode());
        if (currencyConversion != null) {
            expenseBuilder.expencyAmountCompanyCurrency(model.getTotalAmount().divide(currencyConversion.getExchangeRate(), 9, RoundingMode.HALF_UP));
        } else {
            expenseBuilder.expencyAmountCompanyCurrency(model.getTotalAmount());
        }
        if (model.getReceiptAttachmentBinary() != null) {
            expenseBuilder.receiptAttachmentBinary(model.getReceiptAttachmentBinary());
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
        final Collection<ExpenseLineItem> items = model
                .getExpenseItems()
                .stream()
                .map((item) -> convertToLineItem(item, expense))
                .collect(Collectors.toList());

        expense.setExpenseLineItems(items);
        return expense;
    }

    public ExpenseRestModel getExpenseModel(Expense entity) {
        try {
            ExpenseRestModel expenseModel = new ExpenseRestModel();
            expenseModel.setExpenseId(entity.getExpenseId());
            if (entity.getUser() != null) {
                expenseModel.setUserId(entity.getUser().getUserId());
            }
            expenseModel.setCreatedBy(entity.getCreatedBy());
            expenseModel.setCreatedDate(entity.getCreatedDate());
            if (entity.getCurrency() != null) {
                expenseModel.setCurrency(entity.getCurrency().getCurrencyCode());
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
            if (entity.getProject() != null) {
                expenseModel.setProject(entity.getProject().getProjectId());
            }
            if (entity.getBankAccount() != null) {
                expenseModel.setBankAccountId(entity.getBankAccount().getBankAccountId());
            }
            expenseModel.setReceiptAttachmentDescription(entity.getReceiptAttachmentDescription());
            expenseModel.setReceiptAttachmentPath(entity.getReceiptAttachmentPath());
            expenseModel.setReceiptNumber(entity.getReceiptNumber());
            if (entity.getTransactionCategory() != null) {
                expenseModel.setTransactionCategory(entity.getTransactionCategory().getTransactionCategoryId());
            }
            if (entity.getExpenseContact() != null) {
                expenseModel.setExpenseContact(entity.getExpenseContact());
                expenseModel.setExpenseContactId(entity.getExpenseContact().getContactId());
            }
            if (entity.getTransactionType() != null) {
                expenseModel.setTransactionType(entity.getTransactionType().getTransactionTypeCode());
            }
            expenseModel.setVersionNumber(entity.getVersionNumber());
            expenseModel.setReceiptAttachmentBinary(entity.getReceiptAttachmentBinary());
            expenseModel.setReceiptAttachmentName(entity.getReceiptAttachmentName());
            expenseModel.setReceiptAttachmentContentType(entity.getReceiptAttachmentContentType());
            expenseModel.setExpenseAmountCompanyCurrency(entity.getExpencyAmountCompanyCurrency());
            if (entity.getExpenseLineItems() != null && entity.getExpenseLineItems().size() > 0) {
                List<ExpenseLineItem> expenseLineItems = new ArrayList<>(entity.getExpenseLineItems());
                if (expenseLineItems.get(0) != null) {
                    VatCategory vatCategory = expenseLineItems.get(0).getExpenseLineItemVat();
                    if (vatCategory != null) {
                        expenseModel.setVat(vatCategory.getVat());
                    }
                }
                final List<ExpenseItemModel> items = expenseLineItems.stream()
                        .map((lineItem) -> convertToItemModel(lineItem)).collect(Collectors.toList());
                expenseModel.setExpenseItems(items);
            }
            return expenseModel;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @NonNull
    private ExpenseItemModel convertToItemModel(@NonNull final ExpenseLineItem expenseLineItem) {

        final ExpenseItemModel model = new ExpenseItemModel();
        model.setId(expenseLineItem.getExpenseLineItemId());
        model.setQuantity(expenseLineItem.getExpenseLineItemQuantity());
        model.setUnitPrice(expenseLineItem.getExpenseLineItemUnitPrice());
        model.setSubTotal(expenseLineItem.getExpenseLineItemTotalPrice());
        if (expenseLineItem.getExpenseLineItemVat() != null) {
            model.setVatCategoryId(expenseLineItem.getExpenseLineItemVat().getId());
        }
        model.setVersionNumber(expenseLineItem.getVersionNumber());
        updateSubTotal(model);
        return model;
    }

    @NonNull
    private ExpenseLineItem convertToLineItem(@NonNull final ExpenseItemModel expenseItemModel, @NonNull final Expense expense) {
        final ExpenseLineItem item = new ExpenseLineItem();
        if (expenseItemModel.getId() > 0) {
            item.setExpenseLineItemId(expenseItemModel.getId());
        }
        item.setExpenseLineItemQuantity(expenseItemModel.getQuantity());
        item.setExpenseLineItemUnitPrice(expenseItemModel.getUnitPrice());
        item.setExpenseLineItemTotalPrice(expenseItemModel.getSubTotal());
        item.setExpenseLineItemVat(vatCategoryService.findByPK(expenseItemModel.getVatCategoryId()));
        item.setTransactionCategory(transactionCategoryService.findByPK(expenseItemModel.getTransactionCategoryId()));
        item.setVersionNumber(expenseItemModel.getVersionNumber());
        item.setExpense(expense);
        return item;
    }

    private void updateSubTotal(@NonNull final ExpenseItemModel expenseItemModel) {
        final BigDecimal unitPrice = expenseItemModel.getUnitPrice();
        VatCategory vatCategory = vatCategoryService.findByPK(expenseItemModel.getVatCategoryId());
        if (null != unitPrice) {
            final BigDecimal amountWithoutTax = unitPrice.multiply(vatCategory.getVat()).divide(new BigDecimal(100));
            expenseItemModel.setSubTotal(amountWithoutTax);
        }
    }

}

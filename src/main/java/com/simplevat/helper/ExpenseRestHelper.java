/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.bank.model.DeleteModel;
import com.simplevat.contact.model.ExpenseItemModel;
import com.simplevat.criteria.ProjectCriteria;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.entity.Expense;
import com.simplevat.entity.ExpenseLineItem;
import com.simplevat.entity.Project;
import com.simplevat.entity.User;
import com.simplevat.entity.VatCategory;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.expenses.ExpenseRestModel;
import com.simplevat.service.CompanyService;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.UserServiceNew;
import com.simplevat.service.VatCategoryService;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
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

    private final VatCategoryService vatCategoryService;

    private final CurrencyService currencyService;

    private final ExpenseService expenseService;

    private final ProjectService projectService;

    private final CompanyService companyService;

    private final ContactService contactService;

    private final UserServiceNew userServiceNew;

    private final TransactionCategoryService transactionCategoryServiceNew;

    @Autowired
    public ExpenseRestHelper(VatCategoryService vatCategoryService, CurrencyService currencyService, ExpenseService expenseService,
            ProjectService projectService, CompanyService companyService, ContactService contactService,
            UserServiceNew userServiceNew, TransactionCategoryService transactionCategoryServiceNew) {
        this.vatCategoryService = vatCategoryService;
        this.currencyService = currencyService;
        this.expenseService = expenseService;
        this.projectService = projectService;
        this.companyService = companyService;
        this.contactService = contactService;
        this.userServiceNew = userServiceNew;
        this.transactionCategoryServiceNew = transactionCategoryServiceNew;
    }

    public List<User> users(UserServiceNew userServiceNew) throws Exception {
        return userServiceNew.executeNamedQuery("findAllUsers");
    }

    public List<TransactionCategory> completeCategory(List<TransactionCategory> transactionCategoryList) {
        try {
            List<TransactionCategory> transactionCategoryParentList = new ArrayList<>();
            System.out.println("transactionCategoryList=" + transactionCategoryList);
            if (transactionCategoryList != null && !transactionCategoryList.isEmpty()) {
                for (TransactionCategory transactionCategory : transactionCategoryList) {
                    if (transactionCategory.getParentTransactionCategory() != null) {
                        transactionCategoryParentList.add(transactionCategory.getParentTransactionCategory());
                    }
//                    transactionCategoryModels.add(convertTransactionCategoryModel(transactionCategory));
                }
//            selectedExpenseModel.setTransactionType(transactionCategoryList.get(0).getTransactionType());
                transactionCategoryList.removeAll(transactionCategoryParentList);
            }
            return transactionCategoryList;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

//    public TransactionCategoryModel convertTransactionCategoryModel(TransactionCategory transactionCategory) {
//        TransactionCategoryModel transactionCategoryModel = new TransactionCategoryModel();
//        transactionCategoryModel.setCreatedBy(transactionCategory.getCreatedBy());
//        transactionCategoryModel.setCreatedDate(transactionCategory.getCreatedDate());
//        transactionCategoryModel.setDefaltFlag(transactionCategory.getDefaltFlag().toString());
//        transactionCategoryModel.setDeleteFlag(transactionCategory.getDeleteFlag());
//        transactionCategoryModel.setLastUpdateBy(transactionCategory.getLastUpdateBy());
//        transactionCategoryModel.setLastUpdateDate(transactionCategory.getLastUpdateDate());
//        transactionCategoryModel.setOrderSequence(transactionCategory.getOrderSequence());
//        if (transactionCategory.getParentTransactionCategory() != null) {
//            transactionCategoryModel.setParentTransactionCategory(transactionCategory.getParentTransactionCategory().getTransactionCategoryId());
//        }
//        transactionCategoryModel.setTransactionCategoryCode(transactionCategory.getTransactionCategoryCode());
//        transactionCategoryModel.setTransactionCategoryDescription(transactionCategory.getTransactionCategoryDescription());
//        transactionCategoryModel.setTransactionCategoryId(transactionCategory.getTransactionCategoryId());
//        transactionCategoryModel.setTransactionCategoryName(transactionCategory.getTransactionCategoryName());
//        if (transactionCategory.getTransactionType() != null) {
//        }
//        transactionCategoryModel.setTransactionType(transactionCategory.getTransactionType().getTransactionTypeCode());
//        if (transactionCategory.getVatCategory() != null) {
//            transactionCategoryModel.setVatCategory(transactionCategory.getVatCategory().getId());
//        }
//        transactionCategoryModel.setVersionNumber(transactionCategory.getVersionNumber());
//        return transactionCategoryModel;
//    }
    public List<Currency> completeCurrency(String currencyStr) {
        List<Currency> currencies = currencyService.getCurrencies();
        List<Currency> currencySuggestion = new ArrayList<>();
        Iterator<Currency> currencyIterator = currencies.iterator();
        LOGGER.debug(" Size :" + currencies.size());
        while (currencyIterator.hasNext()) {
            Currency currency = currencyIterator.next();
            if (currency.getCurrencyName() != null && !currency.getCurrencyName().isEmpty()
                    && currency.getCurrencyName().toUpperCase().contains(currencyStr.toUpperCase())) {
                LOGGER.debug(" currency :" + currency.getCurrencyDescription());
                currencySuggestion.add(currency);
            } else if (currency.getCurrencyDescription() != null && !currency.getCurrencyDescription().isEmpty()
                    && currency.getCurrencyDescription().toUpperCase().contains(currencyStr.toUpperCase())) {
                currencySuggestion.add(currency);
                LOGGER.debug(" currency :" + currency.getCurrencyDescription());
            } else if (currency.getCurrencyIsoCode() != null && !currency.getCurrencyIsoCode().isEmpty()
                    && currency.getCurrencyIsoCode().toUpperCase().contains(currencyStr.toUpperCase())) {
                currencySuggestion.add(currency);
                LOGGER.debug(" currency :" + currency.getCurrencyIsoCode());
            }
        }

        LOGGER.debug(" Size :" + currencySuggestion.size());
        return currencySuggestion;
    }

    public List<Project> projects(final String searchQuery) {
        try {
            ProjectCriteria criteria = new ProjectCriteria();
            criteria.setActive(Boolean.TRUE);
            if (searchQuery != null && !searchQuery.isEmpty()) {
                criteria.setProjectName(searchQuery);
            }
            return projectService.getProjectsByCriteria(criteria);
        } catch (Exception ex) {
            ex.printStackTrace();
            java.util.logging.Logger.getLogger(ExpenseRestHelper.class.getName()).log(Level.SEVERE, null, ex);
            return new ArrayList<>();
        }
    }

    public ExpenseRestModel getExpenseById(Integer expenseId) throws Exception {
        Expense expense = expenseService.findByPK(expenseId);
        ExpenseRestModel expenseModel = getExpenseModel(expense);
        return expenseModel;
    }

    public void deleteExpense(Integer expenseId) throws Exception {
        Expense expense = expenseService.findByPK(expenseId);
        expense.setDeleteFlag(true);
        expenseService.update(expense);
    }

    public void deleteExpenses(DeleteModel expenseIds) throws Exception {
        try {
            expenseService.deleteByIds(expenseIds.getIds());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Expense getExpense(ExpenseRestModel model, User user,
            Expense expense) throws Exception {
        Expense.ExpenseBuilder expenseBuilder = Expense.builder().expenseId(model.getExpenseId() != null ? model.getExpenseId() : null)
                .user(user).createdBy(model.getCreatedBy()).createdDate(model.getCreatedDate())
                .deleteFlag(model.isDeleteFlag()).expenseAmount(model.getExpenseAmount())
                .payee(model.getPayee());
        if (model.getExpenseDate() != null) {
            LocalDateTime expenseDate = Instant.ofEpochMilli(model.getExpenseDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
            expenseBuilder.expenseDate(expenseDate);
        }
        expenseBuilder.expenseDescription(model.getExpenseDescription()).lastUpdateBy(model.getLastUpdatedBy())
                .lastUpdateDate(model.getLastUpdateDate())
                .receiptAttachmentDescription(model.getReceiptAttachmentDescription())
                .receiptAttachmentPath(model.getReceiptAttachmentPath()).receiptNumber(model.getReceiptNumber())
                .versionNumber(model.getVersionNumber()).receiptAttachmentName(model.getReceiptAttachmentName())
                .receiptAttachmentContentType(model.getReceiptAttachmentContentType());
        final Collection<ExpenseLineItem> items = model
                .getExpenseItems()
                .stream()
                .map((item) -> convertToLineItem(item, expense))
                .collect(Collectors.toList());

        expenseBuilder.expenseLineItems(items);
        return expenseBuilder.build();
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
        VatCategory vatCategory = new VatCategory();
        vatCategory.setId(expenseItemModel.getVatCategoryId());
        item.setExpenseLineItemVat(vatCategory);
        TransactionCategory transactionCategory = new TransactionCategory();
        transactionCategory.setTransactionCategoryId(expenseItemModel.getTransactionCategoryId());
        item.setTransactionCategory(transactionCategory);
        item.setVersionNumber(expenseItemModel.getVersionNumber());
        item.setExpense(expense);
        return item;
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
    public ExpenseItemModel convertToItemModel(@NonNull final ExpenseLineItem expenseLineItem) {

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

    private void updateSubTotal(@NonNull final ExpenseItemModel expenseItemModel) {
        final int quantity = expenseItemModel.getQuantity();
        final BigDecimal unitPrice = expenseItemModel.getUnitPrice();
        BigDecimal vatPer = new BigDecimal(BigInteger.ZERO);
        if (expenseItemModel.getVatCategoryId() != null) {
            VatCategory vatCategory = vatCategoryService.findByPK(expenseItemModel.getVatCategoryId());
            if (vatCategory != null) {
                vatPer = vatCategory.getVat();
            }
        }
        if (null != unitPrice) {
            final BigDecimal amountWithoutTax = unitPrice.multiply(new BigDecimal(quantity));
            expenseItemModel.setSubTotal(amountWithoutTax);
        }
    }

    public String saveExpense(ExpenseRestModel expenseRestModel) throws Exception {
        List<ExpenseItemModel> items = new ArrayList<>();
        if (expenseRestModel.getExpenseItemsString() != null && !expenseRestModel.getExpenseItemsString().isEmpty()) {
           ObjectMapper mapper = new ObjectMapper();
            items = mapper.readValue(expenseRestModel.getExpenseItemsString(), new TypeReference<ArrayList<ExpenseItemModel>>() {
            });
             expenseRestModel.setExpenseItems(items);
        }
//        removeEmptyRow(expenseRestModel);
//        if (!validateInvoiceLineItems(expenseRestModel) || !validateAtLeastOneItem(expenseRestModel)) {
//            return "";
//        }
        save(expenseRestModel);
//        FacesContext context = FacesContext.getCurrentInstance();
//        context.getExternalContext().getFlash().setKeepMessages(true);
//        context.addMessage(null, new FacesMessage("", "Expense saved successfully"));
//        return "/pages/secure/expense/list.xhtml?faces-redirect=true";
        return "Success";
    }

//    private ExpenseRestModel removeEmptyRow(ExpenseRestModel expenseRestModel) {
//        if (expenseRestModel.getExpenseItems() != null && expenseRestModel.getExpenseItems().size() > 1) {
//            List<ExpenseItemModel> expenseItemModels = expenseRestModel.getExpenseItems();
////                       expenseRestModel.getExpenseItems().removeAll(expenseItemModels);
//        }
//        return expenseRestModel;
//    }
    private boolean validateInvoiceLineItems(ExpenseRestModel expenseRestModel) {
        boolean validated = true;
        if (expenseRestModel.getExpenseItems() != null && expenseRestModel.getExpenseItems().size() > 1) {
            for (ExpenseItemModel lastItem : expenseRestModel.getExpenseItems()) {
                StringBuilder validationMessage = new StringBuilder("Please Enter ");
                if (lastItem.getUnitPrice() == null) {
                    validationMessage.append("Unit Price ");
                    validated = false;
                }
                if (validated && lastItem.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
                    validationMessage = new StringBuilder("Unit price should be greater than 0 ");
                    validated = false;
                }
                if (lastItem.getQuantity() < 1) {
                    if (!validated) {
                        validationMessage.append("and ");
                    }
                    validationMessage.append("Quantity should be greater than 0 ");
                    validated = false;
                }
                if (!validated) {
                    validated = false;
                }

            }
        }
        return validated;
    }

    private boolean validateAtLeastOneItem(ExpenseRestModel expenseModel) {
        boolean validated = true;
        if (expenseModel.getExpenseItems() != null && expenseModel.getExpenseItems().size() >= 1) {
            validated = false;
//            FacesMessage message = new FacesMessage("Please add atleast one item to create Expense.");
//            message.setSeverity(FacesMessage.SEVERITY_ERROR);
//            FacesContext.getCurrentInstance().addMessage("validationId", message);
        }
        return validated;
    }

    private void save(ExpenseRestModel expenseRestModel) throws Exception {
        User loggedInUser = userServiceNew.findByPK(expenseRestModel.getUserId());
//        TransactionCategory transactionCategory = transactionCategoryServiceNew.findByPK(expenseRestModel.getTransactionCategory());
//        Currency currency = currencyService.findByPK(expenseRestModel.getCurrency());
//        Project project = projectService.findByPK(expenseRestModel.getProject());
//        Contact contact = contactService.findByPK(expenseRestModel.getExpenseContactId());
        Expense expense = new Expense();
        if (expenseRestModel.getExpenseId() != null) {
            expense = expenseService.findByPK(expenseRestModel.getExpenseId());
        } else {
            expense = getExpense(expenseRestModel, loggedInUser, expense);
        }
        expense.setExpenseAmount(expenseRestModel.getTotalAmount());
        expense.setExpenseVATAmount(expenseRestModel.getExpenseVATAmount());
        CurrencyConversion currencyConversion = currencyService.getCurrencyRateFromCurrencyConversion(expenseRestModel.getCurrencyCode());
        if (currencyConversion != null) {
            expense.setExpencyAmountCompanyCurrency(expenseRestModel.getTotalAmount().divide(currencyConversion.getExchangeRate(), 9, RoundingMode.HALF_UP));
        } else {
            expense.setExpencyAmountCompanyCurrency(expenseRestModel.getTotalAmount());
        }
        if (expenseRestModel.getReceiptAttachmentBinary() != null) {
            expense.setReceiptAttachmentBinary(expenseRestModel.getReceiptAttachmentBinary());
        }
        if (expense.getExpenseId() == null || expense.getExpenseId() == 0) {
            expense.setDeleteFlag(false);
            expense.setCreatedBy(loggedInUser.getUserId());
            expense.setCreatedDate(LocalDateTime.now());
            if (expense.getProject() != null) {
                projectService.updateProjectExpenseBudget(expense.getExpenseAmount(), expense.getProject());
            }
            companyService.updateCompanyExpenseBudget(expense.getExpenseAmount(), loggedInUser.getCompany());
            expenseService.persist(expense);
        } else {
            expense.setLastUpdateDate(LocalDateTime.now());
            expense.setLastUpdateBy(loggedInUser.getUserId());
            Expense prevExpense = expenseService.findByPK(expense.getExpenseId());
            BigDecimal defferenceAmount = expense.getExpenseAmount().subtract(prevExpense.getExpenseAmount());
            if (expense.getProject() != null) {
                projectService.updateProjectExpenseBudget(defferenceAmount, expense.getProject());
            }
            companyService.updateCompanyExpenseBudget(defferenceAmount, loggedInUser.getCompany());
            expenseService.update(expense);
        }
    }

}

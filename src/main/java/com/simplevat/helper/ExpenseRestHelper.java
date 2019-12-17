/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.contact.model.ExpenseItemModel;
import com.simplevat.criteria.ProjectCriteria;
import com.simplevat.entity.Company;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.entity.Expense;
import com.simplevat.entity.ExpenseLineItem;
import com.simplevat.entity.Payment;
import com.simplevat.entity.Product;
import com.simplevat.entity.Project;
import com.simplevat.entity.User;
import com.simplevat.entity.VatCategory;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.rest.expenses.ExpenseRestModel;
import com.simplevat.service.CompanyService;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.PaymentService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryServiceNew;
import com.simplevat.service.UserServiceNew;
import com.simplevat.service.VatCategoryService;
import com.simplevat.service.bankaccount.TransactionTypeService;
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

    @Autowired
    private VatCategoryService vatCategoryService;

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
    public List<Currency> completeCurrency(String currencyStr, CurrencyService currencyService) {
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

    public List<Project> projects(final String searchQuery, ProjectService projectService) {
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

    public ExpenseRestModel getExpenseById(Integer expenseId, ExpenseService expenseService) throws Exception {
        Expense expense = expenseService.findByPK(expenseId);
        ExpenseRestModel expenseModel = getExpenseModel(expense);
        return expenseModel;
    }

    public void deleteExpense(Integer expenseId, ExpenseService expenseService) throws Exception {
        Expense expense = expenseService.findByPK(expenseId);
        expense.setDeleteFlag(true);
        expenseService.update(expense);
    }

    public void deleteExpenses(DeleteModel expenseIds, ExpenseService expenseService) throws Exception {
        try {
            expenseService.deleteByIds(expenseIds.getIds());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Expense getExpense(ExpenseRestModel model, UserServiceNew userServiceNew, CurrencyService currencyService, ProjectService projectService, ExpenseService expenseService, TransactionCategoryServiceNew transactionCategoryServiceNew, TransactionTypeService transactionTypeService, ContactService contactService) throws Exception {
        Expense expense = new Expense();
        expense.setExpenseId(model.getExpenseId());
        if (model.getUser() != null) {
            User user = userServiceNew.findByPK(model.getUser());
            if (user != null) {
                expense.setUser(user);
            }
        }
        expense.setCreatedBy(model.getCreatedBy());
        expense.setCreatedDate(model.getCreatedDate());
        if (model.getCurrency() != null) {
            Currency currency = currencyService.findByPK(model.getCurrency());
            if (currency != null) {
                expense.setCurrency(currency);
            }
        }
        expense.setDeleteFlag(model.isDeleteFlag());
        expense.setExpenseAmount(model.getExpenseAmount());
        expense.setPayee(model.getPayee());
        if (model.getExpenseDate() != null) {
            LocalDateTime expenseDate = Instant.ofEpochMilli(model.getExpenseDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
            expense.setExpenseDate(expenseDate);
        }
        expense.setExpenseDescription(model.getExpenseDescription());
        expense.setLastUpdateDate(model.getLastUpdateDate());
        expense.setLastUpdateBy(model.getLastUpdatedBy());
        if (model.getProject() != null) {
            Project project = projectService.findByPK(model.getProject());
            if (project != null) {
                expense.setProject(project);
            }
        }
        expense.setReceiptAttachmentDescription(model.getReceiptAttachmentDescription());
        expense.setReceiptAttachmentPath(model.getReceiptAttachmentPath());
        expense.setReceiptNumber(model.getReceiptNumber());
        if (model.getExpenseContactId() != null) {
            Contact expenseContact = contactService.findByPK(model.getExpenseContactId());
            if (expenseContact != null) {
                expense.setExpenseContact(expenseContact);
            }
        }
        if (model.getTransactionCategory() != null) {
            TransactionCategory transactionCategory = transactionCategoryServiceNew.findByPK(model.getTransactionCategory());
            if (transactionCategory != null) {
                expense.setTransactionCategory(transactionCategory);
            }
        }
        if (model.getTransactionType() != null) {
            TransactionType transactionType = transactionTypeService.findByPK(model.getTransactionType());
            if (transactionType != null) {
                expense.setTransactionType(transactionType);
            }
        }
        expense.setVersionNumber(model.getVersionNumber());
        expense.setReceiptAttachmentName(model.getReceiptAttachmentName());
        expense.setReceiptAttachmentContentType(model.getReceiptAttachmentContentType());

//        expense.setRecurringFlag(model.getRecurringFlag());
//        expense.setRecurringInterval(model.getRecurringInterval().getValue());
//        expense.setRecurringMonth(model.getRecurringMonth().getValue());
//        expense.setRecurringWeekDays(model.getRecurringWeekDays().getValue());
//        expense.setRecurringFistToLast(model.getRecurringFistToLast().getValue());
//        expense.setRecurringDays(model.getRecurringDays().getValue());
//        expense.setRecurringByAfter(model.getRecurringByAfter().getValue());
        final Collection<ExpenseLineItem> items = model
                .getExpenseItem()
                .stream()
                .map((item) -> convertToLineItem(item, expense))
                .collect(Collectors.toList());

        expense.setExpenseLineItems(items);

        return expense;
    }

    @NonNull
    private ExpenseLineItem convertToLineItem(@NonNull final ExpenseItemModel expenseItemModel, @NonNull final Expense expense) {
        final ExpenseLineItem item = new ExpenseLineItem();
        if (expenseItemModel.getId() > 0) {
            item.setExpenseLineItemId(expenseItemModel.getId());
        }
        item.setExpenseLineItemDescription(expenseItemModel.getDescription());
        item.setExpenseLineItemQuantity(expenseItemModel.getQuatity());
        item.setExpenseLineItemUnitPrice(expenseItemModel.getUnitPrice());
        VatCategory vatCategory = new VatCategory();
        vatCategory.setId(expenseItemModel.getVatCategoryId());
        item.setExpenseLineItemVat(vatCategory);
        item.setVersionNumber(expenseItemModel.getVersionNumber());
        Product product = new Product();
        product.setProductID(expenseItemModel.getProductId());
        item.setExpenseLineItemProductService(product);
        item.setProductName(expenseItemModel.getProductName());
        item.setExpense(expense);
        return item;
    }

    public ExpenseRestModel getExpenseModel(Expense entity) {
        try {
            ExpenseRestModel expenseModel = new ExpenseRestModel();
            expenseModel.setExpenseId(entity.getExpenseId());
            if (entity.getUser() != null) {
                expenseModel.setUser(entity.getUser().getUserId());
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
            if (entity.getExpenseLineItems() != null) {
                List<ExpenseLineItem> expenseLineItems = new ArrayList<>(entity.getExpenseLineItems());
                if (expenseLineItems.get(0) != null) {
                    VatCategory vatCategory = expenseLineItems.get(0).getExpenseLineItemVat();
                    if(vatCategory != null){
                        expenseModel.setVat(vatCategory.getVat());
                    }
                }
                final List<ExpenseItemModel> items = expenseLineItems.stream()
                        .map((lineItem) -> convertToItemModel(lineItem)).collect(Collectors.toList());
                expenseModel.setExpenseItem(items);
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
        model.setDescription(expenseLineItem.getExpenseLineItemDescription());
        model.setQuatity(expenseLineItem.getExpenseLineItemQuantity());
        model.setUnitPrice(expenseLineItem.getExpenseLineItemUnitPrice());
        if (expenseLineItem.getExpenseLineItemVat() != null) {
            model.setVatCategoryId(expenseLineItem.getExpenseLineItemVat().getId());
        }
        model.setVersionNumber(expenseLineItem.getVersionNumber());
        model.setProductName(expenseLineItem.getProductName());
        if (expenseLineItem.getExpenseLineItemProductService() != null) {
            model.setProductId(expenseLineItem.getExpenseLineItemProductService().getProductID());
        }
        updateSubTotal(model);
        return model;
    }

    private void updateSubTotal(@NonNull final ExpenseItemModel expenseItemModel) {
        final int quantity = expenseItemModel.getQuatity();
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

    public String saveExpense(ExpenseRestModel expenseRestModel, CurrencyService currencyService, UserServiceNew userServiceNew, CompanyService companyService, ProjectService projectService, ExpenseService expenseService, TransactionCategoryServiceNew transactionCategoryServiceNew, TransactionTypeService transactionTypeService, ContactService contactService) throws Exception {
        removeEmptyRow(expenseRestModel);
        if (!validateInvoiceLineItems(expenseRestModel) || !validateAtLeastOneItem(expenseRestModel)) {
            return "";
        }
        save(expenseRestModel, currencyService, userServiceNew, companyService, projectService, expenseService, transactionCategoryServiceNew, transactionTypeService, contactService);
//        FacesContext context = FacesContext.getCurrentInstance();
//        context.getExternalContext().getFlash().setKeepMessages(true);
//        context.addMessage(null, new FacesMessage("", "Expense saved successfully"));
//        return "/pages/secure/expense/list.xhtml?faces-redirect=true";
        return "Success";
    }

    private ExpenseRestModel removeEmptyRow(ExpenseRestModel expenseRestModel) {
        if (expenseRestModel.getExpenseItem().size() > 1) {
            List<ExpenseItemModel> expenseItemModels = new ArrayList<>();
            for (ExpenseItemModel expenseItemModel : expenseRestModel.getExpenseItem()) {
                if ((expenseItemModel.getProductName() == null || expenseItemModel.getProductName().isEmpty()) || expenseItemModel.getQuatity() == 0) {
                    expenseItemModels.add(expenseItemModel);
                }
            }
            expenseRestModel.getExpenseItem().removeAll(expenseItemModels);
        }
        return expenseRestModel;
    }

    private boolean validateInvoiceLineItems(ExpenseRestModel expenseRestModel) { //---------------
        boolean validated = true;
        for (ExpenseItemModel lastItem : expenseRestModel.getExpenseItem()) {
            StringBuilder validationMessage = new StringBuilder("Please Enter ");
            if (lastItem.getUnitPrice() == null) {
                validationMessage.append("Unit Price ");
                validated = false;
            }
            if (validated && lastItem.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
                validationMessage = new StringBuilder("Unit price should be greater than 0 ");
                validated = false;
            }
            if (lastItem.getQuatity() < 1) {
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
        return validated;
    }

    private boolean validateAtLeastOneItem(ExpenseRestModel expenseModel) {
//            FacesMessage message = new FacesMessage("Please add atleast one item to create Expense.");
//            message.setSeverity(FacesMessage.SEVERITY_ERROR);
//            FacesContext.getCurrentInstance().addMessage("validationId", message);

        return expenseModel.getExpenseItem().size() >= 1;
    }

    private void save(ExpenseRestModel expenseRestModel, CurrencyService currencyService, UserServiceNew userServiceNew, CompanyService companyService, ProjectService projectService, ExpenseService expenseService, TransactionCategoryServiceNew transactionCategoryServiceNew, TransactionTypeService transactionTypeService, ContactService contactService) throws Exception {
        User loggedInUser = userServiceNew.findByPK(expenseRestModel.getUserId());
        Company company = companyService.findByPK(expenseRestModel.getCompanyId());
        TransactionCategory transactionCategory = transactionCategoryServiceNew.findByPK(expenseRestModel.getTransactionCategory());
        expenseRestModel.setTransactionType(transactionCategory.getTransactionType().getTransactionTypeCode());
        Expense expense = getExpense(expenseRestModel, userServiceNew, currencyService, projectService, expenseService, transactionCategoryServiceNew, transactionTypeService, contactService);
        expense.setExpenseAmount(expenseRestModel.getTotalAmount());
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
            companyService.updateCompanyExpenseBudget(expense.getExpenseAmount(), company);
            expenseService.persist(expense);
        } else {
            expense.setLastUpdateDate(LocalDateTime.now());
            expense.setLastUpdateBy(loggedInUser.getUserId());
            Expense prevExpense = expenseService.findByPK(expense.getExpenseId());
            BigDecimal defferenceAmount = expense.getExpenseAmount().subtract(prevExpense.getExpenseAmount());
            if (expense.getProject() != null) {
                projectService.updateProjectExpenseBudget(defferenceAmount, expense.getProject());
            }
            companyService.updateCompanyExpenseBudget(defferenceAmount, company);
            expenseService.update(expense);
        }
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.contact.model.ExpenseItemModel;
import com.simplevat.entity.Expense;
import com.simplevat.entity.User;
import com.simplevat.entity.VatCategory;
import com.simplevat.rest.expenses.ExpenseListModel;
import com.simplevat.rest.expenses.ExpenseModel;
import com.simplevat.rest.expenses.ExpenseRestModel;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	public Expense getExpenseEntity(ExpenseModel model, User user) throws Exception {
		Expense expense = new Expense();
		if (model.getExpenseId() != null) {
			expense = expenseService.findByPK(model.getExpenseId());
		}
		Expense.ExpenseBuilder expenseBuilder = expense.toBuilder();
		expenseBuilder.expenseAmount(model.getExpenseAmount()).payee(model.getPayee());
		if (model.getExpenseDate() != null) {
			LocalDateTime expenseDate = Instant.ofEpochMilli(model.getExpenseDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			expenseBuilder.expenseDate(expenseDate);
		}
		expenseBuilder.expenseDescription(model.getExpenseDescription())
				.receiptAttachmentDescription(model.getReceiptAttachmentDescription())
				.receiptNumber(model.getReceiptNumber());
		if (model.getCurrencyCode() != null) {
			expenseBuilder.currency(currencyService.findByPK(model.getCurrencyCode()));
		}
		if (model.getProjectId() != null) {
			expenseBuilder.project(projectService.findByPK(model.getProjectId()));
		}
		if (model.getExpenseCategory() != null) {
			expenseBuilder.transactionCategory(transactionCategoryService.findByPK(model.getExpenseCategory()));
		}

		return expenseBuilder.build();
	}

	public ExpenseModel getExpenseModel(Expense entity) {
		try {
			ExpenseModel expenseModel = new ExpenseModel();
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
			if (entity.getProject() != null) {
				expenseModel.setProjectId(entity.getProject().getProjectId());
			}
			expenseModel.setReceiptAttachmentDescription(entity.getReceiptAttachmentDescription());
			expenseModel.setReceiptNumber(entity.getReceiptNumber());
			if (entity.getTransactionCategory() != null) {
				expenseModel.setExpenseCategory(entity.getTransactionCategory().getTransactionCategoryId());
			}
			expenseModel.setVersionNumber(entity.getVersionNumber());

			return expenseModel;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public List<ExpenseListModel> getExpenseList(List<Expense> expenseList) {

		if (expenseList != null && expenseList.size() > 0) {

			List<ExpenseListModel> expenseDtoList = new ArrayList<ExpenseListModel>();

			for (Expense expense : expenseList) {

				ExpenseListModel expenseModel = new ExpenseListModel();

				expenseModel.setExpenseId(expense.getExpenseId());
				expenseModel.setPayee(expense.getPayee());
				expenseModel.setExpenseDescription(expense.getExpenseDescription());
				if (expense.getExpenseDate() != null) {
					Date date = Date.from(expense.getExpenseDate().atZone(ZoneId.systemDefault()).toInstant());
					expenseModel.setExpenseDate(date);
				}
				if (expense.getTransactionCategory() != null
						&& expense.getTransactionCategory().getTransactionCategoryName() != null) {
					expenseModel
							.setTransactionCategoryName(expense.getTransactionCategory().getTransactionCategoryName());
				}
				expenseModel.setExpenseAmount(expense.getExpenseAmount());
				expenseDtoList.add(expenseModel);
			}
			return expenseDtoList;
		}
		return null;

	}
	// private void updateSubTotal(@NonNull final ExpenseItemModel expenseItemModel)
	// {
//        final BigDecimal unitPrice = expenseItemModel.getUnitPrice();
//        VatCategory vatCategory = vatCategoryService.findByPK(expenseItemModel.getVatCategoryId());
//        if (null != unitPrice) {
//            final BigDecimal amountWithoutTax = unitPrice.add(unitPrice.multiply(vatCategory.getVat()).divide(new BigDecimal(100)));
//            expenseItemModel.setSubTotal(amountWithoutTax);
//        }
//    }
}

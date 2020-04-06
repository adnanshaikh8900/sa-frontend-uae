/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import com.simplevat.constant.ExpenseStatusEnum;
import com.simplevat.entity.Expense;
import com.simplevat.entity.User;
import com.simplevat.rest.expensescontroller.ExpenseListModel;
import com.simplevat.rest.expensescontroller.ExpenseModel;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.EmployeeService;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.utils.FileHelper;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

	private static final long serialVersionUID = 1L;

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
	private EmployeeService employeeService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;
	
	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private FileHelper fileHelper;

	public Expense getExpenseEntity(ExpenseModel model) {
		Expense expense = new Expense();
		expense.setStatus(ExpenseStatusEnum.SAVED.getValue());
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
		if (model.getEmployeeId() != null) {
			expenseBuilder.employee(employeeService.findByPK(model.getEmployeeId()));
		}
		if (model.getExpenseCategory() != null) {
			expenseBuilder.transactionCategory(transactionCategoryService.findByPK(model.getExpenseCategory()));
		}
		if (model.getVatCategoryId() != null) {
			expenseBuilder.vatCategory(vatCategoryService.findByPK(model.getVatCategoryId()));
		}
		expenseBuilder.payMode(model.getPayMode());

		if (model.getBankAccountId() != null) {
			expenseBuilder.bankAccount(bankAccountService.findByPK(model.getBankAccountId()));
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
			if (entity.getReceiptAttachmentFileName() != null) {
				expenseModel.setFileName(entity.getReceiptAttachmentFileName());
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
			if (entity.getEmployee() != null) {
				expenseModel.setEmployeeId(entity.getEmployee().getId());
			}
			expenseModel.setReceiptAttachmentDescription(entity.getReceiptAttachmentDescription());
			expenseModel.setReceiptNumber(entity.getReceiptNumber());
			if (entity.getTransactionCategory() != null) {
				expenseModel.setExpenseCategory(entity.getTransactionCategory().getTransactionCategoryId());
			}
			expenseModel.setVersionNumber(entity.getVersionNumber());
			if (entity.getReceiptAttachmentPath() != null) {
				expenseModel.setReceiptAttachmentPath(
						"/file/" + fileHelper.convertFilePthToUrl(entity.getReceiptAttachmentPath()));
			}

			if (entity.getVatCategory() != null) {
				expenseModel.setVatCategoryId(entity.getVatCategory().getId());
			}
			expenseModel.setPayMode(entity.getPayMode());

			if (entity.getBankAccount() != null) {
				expenseModel.setBankAccountId(entity.getBankAccount().getBankAccountId());
			}

			return expenseModel;
		} catch (Exception e) {
			LOGGER.error("Error = ", e);
		}
		return null;
	}

	public List<ExpenseListModel> getExpenseList(Object expenseList) {

		if (expenseList != null) {

			List<ExpenseListModel> expenseDtoList = new ArrayList<>();

			for (Expense expense : (List<Expense>) expenseList) {

				ExpenseListModel expenseModel = new ExpenseListModel();
				expenseModel.setReceiptNumber(expense.getReceiptNumber());
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
					expenseModel.setChartOfAccountId(expense.getTransactionCategory().getTransactionCategoryId());
				}
				expenseModel.setExpenseAmount(expense.getExpenseAmount());
				expenseModel.setExpenseStatus(ExpenseStatusEnum.getExpenseStatusByValue(expense.getStatus()));
				expenseDtoList.add(expenseModel);
			}
			return expenseDtoList;
		}
		return new ArrayList<>();

	}
}

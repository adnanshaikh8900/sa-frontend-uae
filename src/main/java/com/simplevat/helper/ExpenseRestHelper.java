/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.helper;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.*;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PostingRequestModel;
import com.simplevat.service.UserService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.EmployeeService;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.BankAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.ExpenseStatusEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.rest.InviceSingleLevelDropdownModel;
import com.simplevat.rest.expensescontroller.ExpenseListModel;
import com.simplevat.rest.expensescontroller.ExpenseModel;
import com.simplevat.utils.FileHelper;

/**
 *
 * @author daynil
 */
@Component
public class ExpenseRestHelper {

	private final Logger logger = LoggerFactory.getLogger(ExpenseRestHelper.class);

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
	private UserService userService;

	@Autowired
	private FileHelper fileHelper;

	public Expense getExpenseEntity(ExpenseModel model) {
		Expense expense = new Expense();
		expense.setStatus(ExpenseStatusEnum.SAVED.getValue());
		if (model.getExpenseId() != null) {
			expense = expenseService.findByPK(model.getExpenseId());
		}
		Expense.ExpenseBuilder expenseBuilder = expense.toBuilder();
		if (model.getPayee() != null) {

			 expenseBuilder.userId(userService.findByPK(Integer.parseInt(model.getPayee())));
		}
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
			VatCategory vatCategory = vatCategoryService.findByPK(model.getVatCategoryId());
			expenseBuilder.vatCategory(vatCategory);
			Float vatPercent = vatCategory.getVat().floatValue();
			Float expenseAmount = model.getExpenseAmount().floatValue();
			BigDecimal vatAmount = calculateVatAmount(vatPercent,expenseAmount);
			BigDecimal totalExpenseAmount = BigDecimal.valueOf(model.getExpenseAmount().floatValue() + vatAmount.floatValue());
			expenseBuilder.expenseAmount(totalExpenseAmount);
		}
		expenseBuilder.payMode(model.getPayMode());

		if (model.getBankAccountId() != null) {
			expenseBuilder.bankAccount(bankAccountService.findByPK(model.getBankAccountId()));
		}

		return expenseBuilder.build();
	}
	public Journal expensePosting(PostingRequestModel postingRequestModel, Integer userId)
	{
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		Expense expense = expenseService.findByPK(postingRequestModel.getPostingRefId());
		switch(expense.getPayMode())
		{
			case BANK:
				TransactionCategory transactionCategory = expense.getBankAccount().getTransactionCategory();
				journalLineItem1.setTransactionCategory(transactionCategory);
				break;
			case CASH:
				transactionCategory = transactionCategoryService
						.findTransactionCategoryByTransactionCategoryCode(TransactionCategoryCodeEnum.PETTY_CASH.getCode());
				journalLineItem1.setTransactionCategory(transactionCategory);
				break;
			default:
				transactionCategory = transactionCategoryService
						.findTransactionCategoryByTransactionCategoryCode(
								TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
				journalLineItem1.setTransactionCategory(transactionCategory);
				break;
		}
		journalLineItem1.setCreditAmount(postingRequestModel.getAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journalLineItem1.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		TransactionCategory saleTransactionCategory = transactionCategoryService
				.findByPK(postingRequestModel.getPostingChartOfAccountId());
		journalLineItem2.setTransactionCategory(saleTransactionCategory);
		journalLineItem2.setDebitAmount(postingRequestModel.getAmount());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journalLineItem2.setReferenceId(postingRequestModel.getPostingRefId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);
		if (expense.getVatCategory()!=null) {
			VatCategory vatCategory = expense.getVatCategory();
			BigDecimal vatPercent =  vatCategory.getVat();
			BigDecimal vatAmount = calculateActualVatAmount(vatPercent,expense.getExpenseAmount());
			BigDecimal actualDebitAmount = BigDecimal.valueOf(expense.getExpenseAmount().floatValue()-vatAmount.floatValue());
			journalLineItem2.setDebitAmount(actualDebitAmount);
			JournalLineItem journalLineItem = new JournalLineItem();
			TransactionCategory inputVatCategory = transactionCategoryService
					.findTransactionCategoryByTransactionCategoryCode(TransactionCategoryCodeEnum.INPUT_VAT.getCode());
			journalLineItem.setTransactionCategory(inputVatCategory);
			journalLineItem.setDebitAmount(vatAmount);
			journalLineItem.setReferenceType(PostingReferenceTypeEnum.EXPENSE);
			journalLineItem.setReferenceId(postingRequestModel.getPostingRefId());
			journalLineItem.setCreatedBy(userId);
			journalLineItem.setJournal(journal);
			journalLineItemList.add(journalLineItem);
		}
		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.EXPENSE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

	private BigDecimal calculateActualVatAmount(BigDecimal vatPercent, BigDecimal expenseAmount) {
		float vatPercentFloat = vatPercent.floatValue()+100;
		float expenseAmountFloat = expenseAmount.floatValue()/vatPercentFloat * 100;
		return BigDecimal.valueOf(expenseAmount.floatValue()-expenseAmountFloat);
	}

	private BigDecimal calculateVatAmount(Float vatPercent, Float expenseAmount) {
		return BigDecimal.valueOf(expenseAmount * (vatPercent/100));
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
			logger.error("Error = ", e);
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
				if(expense.getUserId() != null){
					expenseModel.setPayee(expense.getUserId().getFirstName() +" "+ expense.getUserId().getLastName());
				}
				else {
					expenseModel.setPayee("Company Expense");
				}
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

	public List<InviceSingleLevelDropdownModel> getDropDoenModelList(List<Expense> expenseList) {

		if (expenseList != null && !expenseList.isEmpty()) {
			List<InviceSingleLevelDropdownModel> modelList = new ArrayList<>();
			for (Expense expense : expenseList) {
				InviceSingleLevelDropdownModel model = new InviceSingleLevelDropdownModel(expense.getExpenseId(),
						" (" + expense.getExpenseAmount() + " " + expense.getCurrency().getCurrencyName() + ")",
						expense.getExpenseAmount(), PostingReferenceTypeEnum.EXPENSE);
				modelList.add(model);
			}
			return modelList;
		}

		return new ArrayList<>();

	}
}

package com.simplevat.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.dbfilter.ExpenseFIlterEnum;
import com.simplevat.dao.CompanyDao;
import com.simplevat.dao.Dao;
import com.simplevat.dao.ExpenseDao;
import com.simplevat.dao.ProjectDao;
import com.simplevat.entity.Expense;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.TransactionExpensesService;
import com.simplevat.service.report.model.BankAccountTransactionReportModel;
import com.simplevat.utils.ChartUtil;

@Service("expenseService")
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class ExpenseServiceImpl extends ExpenseService {

	@Autowired
	public ExpenseDao expenseDao;

	@Autowired
	public ProjectDao projectDao;

	@Autowired
	public CompanyDao companyDao;

	@Autowired
	ChartUtil util;

	@Autowired
	private TransactionExpensesService transactionExpensesService;

	@Override
	public List<Expense> getExpenses(Integer userId, List<Integer> statusList) {
		return expenseDao.getAllExpenses(userId, statusList);
	}

	@Override
	public Expense updateOrCreateExpense(Expense expense) {
		return this.update(expense, expense.getExpenseId());
	}

	@Override
	public Dao<Integer, Expense> getDao() {
		return expenseDao;
	}

	@Override
	public List<BankAccountTransactionReportModel> getExpensesForReport(Date startDate, Date endDate) {

		List<Object[]> rows = expenseDao.getExpenses(startDate, endDate);
		List<BankAccountTransactionReportModel> list = util.convertToTransactionReportModel(rows);
		for (BankAccountTransactionReportModel model : list) {
			model.setCredit(false);
		}
		return util.convertToTransactionReportModel(rows);

	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		expenseDao.deleteByIds(ids);
	}

	@Override
	public PaginationResponseModel getExpensesList(Map<ExpenseFIlterEnum, Object> filterMap,
			PaginationModel paginationModel) {
		return expenseDao.getExpenseList(filterMap, paginationModel);
	}

	@Override
	public List<Expense> getUnMappedExpenses(Integer userId) {
		List<Expense> responseList = new ArrayList<>();

		List<Expense> expList = getExpenses(userId, Arrays.asList(InvoiceStatusEnum.POST.getValue()));

		List<Expense> mappedExp = transactionExpensesService.getMappedExpenses();

		Set<Integer> mappedInvIdSet = new HashSet<>();
		if (mappedExp != null && !mappedExp.isEmpty())
			for (Expense expesne : mappedExp) {
				mappedInvIdSet.add(expesne.getExpenseId());
			}

		if (expList != null && !expList.isEmpty()) {
			for (Expense expense : expList) {
				if (!mappedInvIdSet.contains(expense.getExpenseId())) {
					responseList.add(expense);
				}
			}
		}
		return responseList;
	}
}

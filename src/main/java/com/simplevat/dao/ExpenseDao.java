package com.simplevat.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.ExpenseFIlterEnum;
import com.simplevat.entity.Expense;

public interface ExpenseDao extends Dao<Integer, Expense> {

    public List<Expense> getAllExpenses();

    public List<Object[]> getExpensePerMonth(Date startDate, Date endDate);

    public List<Object[]> getExpenses(Date startDate, Date endDate);

    public List<Object[]> getVatOutPerMonthWise(Date startDate, Date endDate);

    public List<Expense> getExpenseForReports(Date startDate, Date endDate);

    public void deleteByIds(List<Integer> ids);

	public List<Expense> getExpenseList(Map<ExpenseFIlterEnum, Object> filterMap);
}

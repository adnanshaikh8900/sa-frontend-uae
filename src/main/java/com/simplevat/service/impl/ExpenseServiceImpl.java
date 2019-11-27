package com.simplevat.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.dao.Dao;
import com.simplevat.dao.ExpenseDao;
import com.simplevat.entity.Expense;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.report.model.BankAccountTransactionReportModel;
import com.simplevat.util.ChartUtil;

@Service("expenseService")
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class ExpenseServiceImpl extends ExpenseService {

    @Autowired
    public ExpenseDao expenseDao;

    @Autowired
    ChartUtil util;

    @Override
    public List<Expense> getExpenses() {
        return expenseDao.getAllExpenses();
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
    public Map<Object, Number> getExpensePerMonth() {
        return getExpensePerMonth(null, null);
    }

    @Override
    public Map<Object, Number> getVatOutPerMonth() {
        List<Object[]> rows = expenseDao.getVatOutPerMonthWise(util.getStartDate(Calendar.YEAR, -1).getTime(), util.getEndDate().getTime());
        return util.getCashMap(rows);
    }

    @Override
    public int getMaxValue(Map<Object, Number> data) {
        return util.getMaxValue(data);
    }

    @Override
    public int getVatOutQuartly() {
        List<Object[]> rows = expenseDao.getVatOutPerMonthWise(util.getStartDate(Calendar.MONTH, -4).getTime(), util.getEndDate().getTime());
        return util.addAmount(rows);
    }

    @Override
    public Map<Object, Number> getExpensePerMonth(Date startDate, Date endDate) {
        if (startDate == null || endDate == null) {
            startDate = util.getStartDate(Calendar.YEAR, -1).getTime();
            endDate = util.getEndDate().getTime();
        }
        List<Object[]> rows = expenseDao.getExpensePerMonth(startDate, endDate);
        return util.getCashMap(rows);
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
    public List<Expense> getExpenseForReports(Date startDate, Date endDate) {
        return expenseDao.getExpenseForReports(startDate, endDate);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        expenseDao.deleteByIds(ids);
    }

}

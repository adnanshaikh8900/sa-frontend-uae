package com.simplevat.service;

import java.util.Date;
import java.util.List;

import com.simplevat.entity.Expense;
import com.simplevat.service.report.model.BankAccountTransactionReportModel;

public abstract class ExpenseService extends SimpleVatService<Integer, Expense> {

    public abstract List<Expense> getExpenses();

    public abstract Expense updateOrCreateExpense(Expense expense);

    public abstract List<BankAccountTransactionReportModel> getExpensesForReport(Date startDate, Date endDate);

    public abstract void deleteByIds(List<Integer> ids);
}

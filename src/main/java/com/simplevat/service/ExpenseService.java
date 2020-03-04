package com.simplevat.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.ExpenseFIlterEnum;
import com.simplevat.entity.Expense;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.report.model.BankAccountTransactionReportModel;

public abstract class ExpenseService extends SimpleVatService<Integer, Expense> {

    public abstract List<Expense> getExpenses();
    
    public abstract PaginationResponseModel getExpensesList(Map<ExpenseFIlterEnum, Object> filterMap,PaginationModel paginationMdel);
    public abstract Expense updateOrCreateExpense(Expense expense);

    public abstract List<BankAccountTransactionReportModel> getExpensesForReport(Date startDate, Date endDate);

    public abstract void deleteByIds(List<Integer> ids);
}

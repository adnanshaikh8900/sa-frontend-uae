/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.reports;

import com.simplevat.contact.model.FinancialPeriodRestModel;
import com.simplevat.entity.Expense;
import com.simplevat.helper.ExpenseRestHelper;
import com.simplevat.rest.expenses.ExpenseRestModel;
import com.simplevat.service.ExpenseService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author daynil
 */
@RestController
@RequestMapping("/rest/expensereport")
public class ExpenseReportRestController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ExpenseRestHelper controllerHelper;

    @RequestMapping(method = RequestMethod.POST, value = "/viewexpensereport")
    public ResponseEntity<List<ExpenseRestModel>> view(@RequestBody FinancialPeriodRestModel financialPeriod) {
        try {
            double totalExpenseAmount = 0.0;
            List<ExpenseRestModel> expenseList = new ArrayList<>();
            expenseList.clear();
            System.out.println("entered==" + financialPeriod.getLastDate());
            List<Expense> expenses = expenseService.getExpenseForReports(financialPeriod.getStartDate(), financialPeriod.getLastDate());
            if (expenses != null && !expenses.isEmpty()) {
                for (Expense expense : expenses) {
                    totalExpenseAmount = totalExpenseAmount + expense.getExpencyAmountCompanyCurrency().doubleValue();
                    expenseList.add(controllerHelper.getExpenseModel(expense));
                }
            }
            return new ResponseEntity(expenseList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

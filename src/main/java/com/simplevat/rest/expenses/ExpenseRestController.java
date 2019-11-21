/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.expenses;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.entity.Country;
import com.simplevat.helper.ExpenseRestHelper;
import com.simplevat.entity.Expense;
import com.simplevat.entity.bankaccount.TransactionCategory;
import static com.simplevat.helper.ExpenseRestHelper.TRANSACTION_TYPE_EXPENSE;
import com.simplevat.service.CompanyService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryServiceNew;
import com.simplevat.service.UserServiceNew;
import com.simplevat.service.bankaccount.TransactionTypeService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author daynil
 */
@RestController
@RequestMapping("/rest/expense")
public class ExpenseRestController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private TransactionCategoryServiceNew transactionCategoryService;

    @Autowired
    private UserServiceNew userServiceNew;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TransactionTypeService transactionTypeService;

    @Autowired
    private CountryService countryService;

    ExpenseRestHelper controllerHelper = new ExpenseRestHelper();

    @RequestMapping(method = RequestMethod.GET, value = "/retrieveExpenseList")
    public ResponseEntity expenseList() {
        try {
            List<ExpenseRestModel> expenses = new ArrayList<>();
            System.out.println("expenseService=" + expenseService);
            System.out.println("transactionCategoryService=" + transactionCategoryService);
            List<Expense> expenseList = expenseService.getExpenses();
            for (Expense expense : expenseList) {
                ExpenseRestModel model = controllerHelper.getExpenseModel(expense);
                model.setExpenseAmountCompanyCurrency(expense.getExpencyAmountCompanyCurrency());
                expenses.add(model);
            }
            return new ResponseEntity(expenses, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.POST, value = "/save")
    public ResponseEntity saveExpense(@RequestBody ExpenseRestModel expenseRestModel) {
        try {
            controllerHelper.saveExpense(expenseRestModel, currencyService, userServiceNew, companyService, projectService, expenseService, transactionCategoryService, transactionTypeService);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/vieworedit")
    public ResponseEntity viewExpense(@RequestParam("expenseId") Integer expenseId) {
        try {
            System.out.println("expenseId=" + expenseId);
            return new ResponseEntity(controllerHelper.viewOrEditExpense(expenseId, expenseService), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/delete")
    public ResponseEntity deleteExpense(@RequestParam("expenseId") Integer expenseId) {
        try {
            System.out.println("expenseId=" + expenseId);
            controllerHelper.deleteExpense(expenseId, expenseService);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/deletes")
    public ResponseEntity deleteExpenses(@RequestParam("expenseId") DeleteModel expenseIds) {
        try {
            System.out.println("expenseId=" + expenseIds);
            controllerHelper.deleteExpenses(expenseIds, expenseService);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/claimants")
    public ResponseEntity getClaimants() {
        try {
            return new ResponseEntity(controllerHelper.users(userServiceNew), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/categories")
    public ResponseEntity getCategorys(@RequestParam("categoryName") String queryString) {
        try {
            System.out.println("queryString=" + queryString);
            List<TransactionCategory> transactionCategoryList = transactionCategoryService.findAllTransactionCategoryByTransactionType(TRANSACTION_TYPE_EXPENSE, queryString);
            return new ResponseEntity(controllerHelper.completeCategory(transactionCategoryList), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Deprecated
    @RequestMapping(method = RequestMethod.GET, value = "/currencys")
    public ResponseEntity getCurrencys() {
        try {
            List<Country> countries = countryService.getCountries();
            if (countries != null && !countries.isEmpty()) {
                return new ResponseEntity<>(countries, HttpStatus.OK);
            } else {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/projects")
    public ResponseEntity getProjects(@RequestParam("projectName") String queryString) {
        try {
            return new ResponseEntity(controllerHelper.projects(queryString, projectService), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

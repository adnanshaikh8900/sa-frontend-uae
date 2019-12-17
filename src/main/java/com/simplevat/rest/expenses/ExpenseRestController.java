/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.expenses;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.TransactionTypeConstant;
import com.simplevat.helper.ExpenseRestHelper;
import com.simplevat.entity.Expense;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.CompanyService;
import com.simplevat.service.ContactService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.PaymentService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TransactionCategoryServiceNew;
import com.simplevat.service.UserServiceNew;
import com.simplevat.service.bankaccount.TransactionTypeService;
import io.swagger.annotations.ApiOperation;
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

    @Autowired
    private ContactService contactService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ExpenseRestHelper controllerHelper;

    @ApiOperation(value = "Get Expense List")
    @RequestMapping(method = RequestMethod.GET, value = "/retrieveExpenseList")

    public ResponseEntity expenseList() {
        try {
            List<ExpenseRestModel> expenses = new ArrayList<>();
            System.out.println("expenseService=" + expenseService);
            System.out.println("transactionCategoryService=" + transactionCategoryService);
            List<Expense> expenseList = expenseService.getExpenses();
            for (Expense expense : expenseList) {
                ExpenseRestModel model = controllerHelper.getExpenseModel(expense);
                if (expense.getExpencyAmountCompanyCurrency() != null) {
                    model.setExpenseAmountCompanyCurrency(expense.getExpencyAmountCompanyCurrency());
                }
                expenses.add(model);
            }
            return new ResponseEntity(expenses, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @ApiOperation(value = "Add New Expense")
    @RequestMapping(method = RequestMethod.POST, value = "/save")
    public ResponseEntity saveExpense(@RequestBody ExpenseRestModel expenseRestModel) {
        try {
            controllerHelper.saveExpense(expenseRestModel, currencyService, userServiceNew, companyService, projectService, expenseService, transactionCategoryService, transactionTypeService, contactService);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @ApiOperation(value = "Get Expense Detail by Expanse Id")
    @RequestMapping(method = RequestMethod.GET, value = "/getExpenseById")
    public ResponseEntity viewExpense(@RequestParam("expenseId") Integer expenseId) {
        try {
            System.out.println("expenseId=" + expenseId);
            return new ResponseEntity(controllerHelper.getExpenseById(expenseId, expenseService), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/delete")
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

    @RequestMapping(method = RequestMethod.DELETE, value = "/deletes")
    public ResponseEntity deleteExpenses(@RequestBody DeleteModel expenseIds) {
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
            List<TransactionCategory> transactionCategoryList = transactionCategoryService.findAllTransactionCategoryByTransactionType(TransactionTypeConstant.TRANSACTION_TYPE_EXPENSE, queryString);
            return new ResponseEntity(controllerHelper.completeCategory(transactionCategoryList), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

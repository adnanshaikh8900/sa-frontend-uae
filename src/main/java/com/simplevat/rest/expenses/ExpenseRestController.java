/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.expenses;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.bank.model.DeleteModel;
import com.simplevat.contact.model.ExpenseItemModel;
import com.simplevat.helper.ExpenseRestHelper;
import com.simplevat.entity.Expense;
import com.simplevat.entity.User;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.UserServiceNew;
import io.swagger.annotations.ApiOperation;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
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
    private UserServiceNew userServiceNew;

    @Autowired
    private ExpenseRestHelper expenseRestHelper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @ApiOperation(value = "Get Expense List")
    @RequestMapping(method = RequestMethod.GET, value = "/getList")
    public ResponseEntity getExpenseList() {
        try {
            List<ExpenseModel> expenses = new ArrayList<>();
            List<Expense> expenseList = expenseService.getExpenses();
            for (Expense expense : expenseList) {
                ExpenseModel model = expenseRestHelper.getExpenseModel(expense);
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
    public ResponseEntity save(@ModelAttribute ExpenseModel expenseModel, HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            User loggedInUser = userServiceNew.findByPK(userId);
            Expense expense = expenseRestHelper.getExpenseEntity(expenseModel, loggedInUser);
            expense.setCreatedBy(userId);
            expense.setDeleteFlag(false);
            expense.setCreatedDate(LocalDateTime.now());
            expenseService.persist(expense);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @ApiOperation(value = "Update Expense")
    @RequestMapping(method = RequestMethod.POST, value = "/update")
    public ResponseEntity update(@ModelAttribute ExpenseModel expenseModel, HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            User loggedInUser = userServiceNew.findByPK(userId);
            if (expenseModel.getExpenseId() != null) {
                Expense expense = expenseService.findByPK(expenseModel.getExpenseId());
                expense = expenseRestHelper.getExpenseEntity(expenseModel, loggedInUser);
                expense.setLastUpdateBy(userId);
                expense.setLastUpdateDate(LocalDateTime.now());
                expenseService.persist(expense);
            }
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @ApiOperation(value = "Get Expense Detail by Expanse Id")
    @RequestMapping(method = RequestMethod.GET, value = "/getExpenseById")
    public ResponseEntity getExpenseById(@RequestParam("expenseId") Integer expenseId) {
        try {
            Expense expense = expenseService.findByPK(expenseId);
            ExpenseModel expenseModel = expenseRestHelper.getExpenseModel(expense);
            return new ResponseEntity(expenseModel, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/delete")
    public ResponseEntity delete(@RequestParam("expenseId") Integer expenseId) {
        try {
            Expense expense = expenseService.findByPK(expenseId);
            expense.setDeleteFlag(true);
            expenseService.update(expense);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/deletes")
    public ResponseEntity bulkDelete(@RequestBody DeleteModel expenseIds) {
        try {
            expenseService.deleteByIds(expenseIds.getIds());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
//
//    @RequestMapping(method = RequestMethod.GET, value = "/categories")
//    public ResponseEntity getCategorys(@RequestParam("categoryName") String queryString) {
//        try {
//            System.out.println("queryString=" + queryString);
//            List<TransactionCategory> transactionCategoryList = transactionCategoryService.findAllTransactionCategoryByTransactionType(TransactionTypeConstant.TRANSACTION_TYPE_EXPENSE, queryString);
//            return new ResponseEntity(expenseRestHelper.completeCategory(transactionCategoryList), HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
}

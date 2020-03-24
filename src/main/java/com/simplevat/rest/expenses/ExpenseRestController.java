/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.expenses;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.FileTypeEnum;
import com.simplevat.constant.dbfilter.ExpenseFIlterEnum;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.helper.ExpenseRestHelper;
import com.simplevat.rest.AbstractDoubleEntryRestController;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.entity.Expense;
import com.simplevat.entity.Product;
import com.simplevat.entity.User;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.UserService;
import com.simplevat.utils.FileHelper;
import io.swagger.annotations.ApiOperation;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
public class ExpenseRestController extends AbstractDoubleEntryRestController implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7383668014992304509L;

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private UserService userServiceNew;

	@Autowired
	private ExpenseRestHelper expenseRestHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private FileHelper fileHelper;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@ApiOperation(value = "Get Expense List")
	@RequestMapping(method = RequestMethod.GET, value = "/getList")
	public ResponseEntity getExpenseList(ExpenseRequestFilterModel expenseRequestFilterModel) {
		try {

			Map<ExpenseFIlterEnum, Object> filterDataMap = new HashMap<ExpenseFIlterEnum, Object>();
			filterDataMap.put(ExpenseFIlterEnum.PAYEE, expenseRequestFilterModel.getPayee());
			if (expenseRequestFilterModel.getExpenseDate() != null
					&& !expenseRequestFilterModel.getExpenseDate().isEmpty()) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
				LocalDateTime dateTime = Instant
						.ofEpochMilli(dateFormat.parse(expenseRequestFilterModel.getExpenseDate()).getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
				filterDataMap.put(ExpenseFIlterEnum.EXPENSE_DATE, dateTime);
			}
			if (expenseRequestFilterModel.getTransactionCategoryId() != null) {
				filterDataMap.put(ExpenseFIlterEnum.TRANSACTION_CATEGORY,
						transactionCategoryService.findByPK(expenseRequestFilterModel.getTransactionCategoryId()));
			}
			filterDataMap.put(ExpenseFIlterEnum.PAYEE, expenseRequestFilterModel.getPayee());
			filterDataMap.put(ExpenseFIlterEnum.DELETE_FLAG, false);
			//filterDataMap.put(ExpenseFIlterEnum.ORDER_BY, ORDERBYENUM.DESC); 
			PaginationResponseModel response = expenseService.getExpensesList(filterDataMap,expenseRequestFilterModel);
			if (response == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			response.setData(expenseRestHelper.getExpenseList(response.getData()));
			return new ResponseEntity(response, HttpStatus.OK);
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
			expense.setCreatedDate(LocalDateTime.now());
			if (expenseModel.getAttachmentFile() != null && !expenseModel.getAttachmentFile().isEmpty()) {
				String fileName = fileHelper.saveFile(expenseModel.getAttachmentFile(), FileTypeEnum.EXPENSE);
				expense.setReceiptAttachmentFileName(expenseModel.getAttachmentFile().getOriginalFilename());
				expense.setReceiptAttachmentPath(fileName);
			}
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
				Expense expense = expenseRestHelper.getExpenseEntity(expenseModel, loggedInUser);
				if (expenseModel.getAttachmentFile() != null && !expenseModel.getAttachmentFile().isEmpty()) {
					String fileName = fileHelper.saveFile(expenseModel.getAttachmentFile(), FileTypeEnum.EXPENSE);
					expense.setReceiptAttachmentFileName(expenseModel.getAttachmentFile().getOriginalFilename());
					expense.setReceiptAttachmentPath(fileName);
				}
				expense.setLastUpdateBy(userId);
				expense.setLastUpdateDate(LocalDateTime.now());
				expenseService.update(expense);
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

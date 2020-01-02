/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncategorycontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.TransactionTypeConstant;
import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.constant.dbfilter.TransactionCategoryFilterEnum;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.entity.Product;
import com.simplevat.entity.User;
import com.simplevat.entity.VatCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.rest.productcontroller.ProductRequestFilterModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.UserService;
import com.simplevat.service.bankaccount.TransactionTypeService;
import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/transactioncategory")
public class TransactionCategoryRestController implements Serializable {

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private TransactionTypeService transactionTypeService;

	@Autowired
	private UserService userServiceNew;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TranscationCategoryHelper transcationCategoryHelper;

	@ApiOperation(value = "Get All Transaction Categories for the Loggedin User and the Master data")
	@GetMapping(value = "/gettransactioncategory")
	public ResponseEntity getAllTransactionCategory(HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		User user = userServiceNew.findByPK(userId);
		List<TransactionCategory> transactionCategories = transactionCategoryService
				.findAllTransactionCategoryByUserId(userId);
		if (transactionCategories != null) {
			return new ResponseEntity(transactionCategories, HttpStatus.OK);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get All Transaction Categories for the Loggedin User and the Master data by filter")
	@GetMapping(value = "/getList")
	public ResponseEntity getAllTransactionCategoryListByFilter(TransactionCategoryRequestFilterModel filterModel, HttpServletRequest request) {
		
		Map<TransactionCategoryFilterEnum, Object> filterDataMap = new HashMap();
		filterDataMap.put(TransactionCategoryFilterEnum.TRANSACTION_CATEGORY_CODE, filterModel.getTransactionCategoryCode());
		filterDataMap.put(TransactionCategoryFilterEnum.TRANSACTION_CATEGORY_NAME, filterModel.getTransactionCategoryName());
		
		if(filterModel.getTransactionType() != null) {
			filterDataMap.put(TransactionCategoryFilterEnum.TRANSACTION_TYPE, transactionTypeService.findByPK(filterModel.getTransactionType()));
		}
		
		List<TransactionCategory> transactionCategories = transactionCategoryService.getTransactionCategoryList(filterDataMap);
		if (transactionCategories == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity(transcationCategoryHelper.getListModel(transactionCategories), HttpStatus.OK);
	}

	@ApiOperation(value = "Get Transaction Category By ID")
	@GetMapping(value = "/getTransactionCategoryById")
	public ResponseEntity getTransactionCategoryById(@RequestParam("id") Integer id) {
		TransactionCategory transactionCategories = transactionCategoryService.findByPK(id);
		if (transactionCategories != null) {
			return new ResponseEntity(transactionCategories, HttpStatus.OK);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Delete Transaction Category")
	@DeleteMapping(value = "/deleteTransactionCategory")
	public ResponseEntity deleteTransactionCategory(@RequestParam("id") Integer id) {
		TransactionCategory transactionCategories = transactionCategoryService.findByPK(id);
		if (transactionCategories == null) {
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		transactionCategories.setDeleteFlag(Boolean.TRUE);
		transactionCategoryService.update(transactionCategories, id);
		return new ResponseEntity(HttpStatus.OK);
	}

	@ApiOperation(value = "Delete Transaction Category In Bulk")
	@DeleteMapping(value = "/deleteTransactionCategories")
	public ResponseEntity deleteTransactionCategories(@RequestBody DeleteModel ids) {
		try {
			transactionCategoryService.deleteByIds(ids.getIds());
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Add New Transaction Category")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody TransactionCategoryBean transactionCategoryBean,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategory selectedTransactionCategory = transcationCategoryHelper
					.getEntity(transactionCategoryBean);
			selectedTransactionCategory.setCreatedBy(user.getUserId());
			selectedTransactionCategory.setCreatedDate(LocalDateTime.now());
			transactionCategoryService.persist(selectedTransactionCategory);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Update Transaction Category")
	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody TransactionCategoryBean transactionCategoryBean,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategory selectedTransactionCategory = transactionCategoryService
					.findByPK(transactionCategoryBean.getTransactionCategoryId());
			selectedTransactionCategory
					.setTransactionCategoryCode(transactionCategoryBean.getTransactionCategoryCode());
			selectedTransactionCategory
					.setTransactionCategoryName(transactionCategoryBean.getTransactionCategoryName());
			if (transactionCategoryBean.getTransactionType() != null) {
				selectedTransactionCategory.setTransactionType(
						transactionTypeService.findByPK(transactionCategoryBean.getTransactionType()));
			}
			selectedTransactionCategory.setLastUpdateBy(user.getUserId());
			selectedTransactionCategory.setLastUpdateDate(LocalDateTime.now());
			transactionCategoryService.update(selectedTransactionCategory);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get All Transaction Categories for Expense")
	@GetMapping(value = "/getForExpenses")
	public ResponseEntity getTransactionCatgeoriesForExpenses(HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		User user = userServiceNew.findByPK(userId);
		List<TransactionCategory> transactionCategories = transactionCategoryService
				.findAllTransactionCategoryByTransactionType(TransactionTypeConstant.TRANSACTION_TYPE_EXPENSE);
		if (transactionCategories != null) {
			return new ResponseEntity(transactionCategories, HttpStatus.OK);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

}

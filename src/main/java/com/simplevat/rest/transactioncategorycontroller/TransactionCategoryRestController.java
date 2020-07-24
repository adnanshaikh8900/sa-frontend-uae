/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncategorycontroller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.ChartOfAccountConstant;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.TransactionCategoryFilterEnum;
import com.simplevat.entity.User;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.UserService;
import com.simplevat.service.bankaccount.ChartOfAccountService;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/transactioncategory")
public class TransactionCategoryRestController{
	private final Logger logger = LoggerFactory.getLogger(TransactionCategoryRestController.class);
	@Autowired
	private  TransactionCategoryService transactionCategoryService;

	@Autowired
	private  ChartOfAccountService chartOfAccountService;

	@Autowired
	private  UserService userServiceNew;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TranscationCategoryHelper transcationCategoryHelper;

	@ApiOperation(value = "Get All Transaction Categories for the Loggedin User and the Master data")
	@GetMapping(value = "/gettransactioncategory")
	public ResponseEntity<List<TransactionCategoryModel>> getAllTransactionCategory(HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		List<TransactionCategory> transactionCategories = transactionCategoryService.findAllTransactionCategory();
			//	.findAllTransactionCategoryByUserId(userId);
		if (transactionCategories != null) {
			return new ResponseEntity<>(transcationCategoryHelper.getListModel(transactionCategories), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get All Transaction Categories for the Loggedin User and the Master data by filter")
	@GetMapping(value = "/getList")
	public ResponseEntity<PaginationResponseModel> getAllTransactionCategoryListByFilter(TransactionCategoryRequestFilterModel filterModel,
			HttpServletRequest request) {

		Map<TransactionCategoryFilterEnum, Object> filterDataMap = new HashMap();
		filterDataMap.put(TransactionCategoryFilterEnum.TRANSACTION_CATEGORY_CODE,
				filterModel.getTransactionCategoryCode());
		filterDataMap.put(TransactionCategoryFilterEnum.TRANSACTION_CATEGORY_NAME,
				filterModel.getTransactionCategoryName());
		filterDataMap.put(TransactionCategoryFilterEnum.DELETE_FLAG, false);

		if (filterModel.getChartOfAccountId() != null) {
			filterDataMap.put(TransactionCategoryFilterEnum.CHART_OF_ACCOUNT,
					chartOfAccountService.findByPK(filterModel.getChartOfAccountId()));
		}
		filterDataMap.put(TransactionCategoryFilterEnum.ORDER_BY, ORDERBYENUM.DESC);

		PaginationResponseModel response = transactionCategoryService.getTransactionCategoryList(filterDataMap,
				filterModel);
		if (response == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		response.setData(transcationCategoryHelper.getListModel(response.getData()));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@ApiOperation(value = "Get All Transaction Categories for export")
	@GetMapping(value = "/getExportList")
	public ResponseEntity<List<TransactionCategoryExportModel>> getAllTransactionCategoryForExport(HttpServletRequest request) {
		List<TransactionCategory> response = transactionCategoryService.findAllTransactionCategory();
		if (response == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		List<TransactionCategoryExportModel> exportList  = transcationCategoryHelper.getExportListModel(response);

		return new ResponseEntity(exportList, HttpStatus.OK);
	}

	@ApiOperation(value = "Get Transaction Category By ID")
	@GetMapping(value = "/getTransactionCategoryById")
	public ResponseEntity<TransactionCategoryModel> getTransactionCategoryById(@RequestParam("id") Integer id) {
		TransactionCategory transactionCategories = transactionCategoryService.findByPK(id);
		if (transactionCategories != null) {
			return new ResponseEntity<>(transcationCategoryHelper.getModel(transactionCategories), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Delete Transaction Category")
	@DeleteMapping(value = "/deleteTransactionCategory")
	public ResponseEntity<String> deleteTransactionCategory(@RequestParam("id") Integer id) {
		TransactionCategory transactionCategories = transactionCategoryService.findByPK(id);
		if (transactionCategories == null) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		transactionCategories.setDeleteFlag(Boolean.TRUE);
		transactionCategoryService.update(transactionCategories, id);
		return new ResponseEntity<>("Deleted successfull",HttpStatus.OK);
	}

	@ApiOperation(value = "Delete Transaction Category In Bulk")
	@DeleteMapping(value = "/deleteTransactionCategories")
	public ResponseEntity<String> deleteTransactionCategories(@RequestBody DeleteModel ids) {
		try {
			transactionCategoryService.deleteByIds(ids.getIds());
			return new ResponseEntity<>("Deleted successful",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Add New Transaction Category")
	@PostMapping(value = "/save")
	public ResponseEntity<String> save(@RequestBody TransactionCategoryBean transactionCategoryBean,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategory selectedTransactionCategory = transcationCategoryHelper
					.getEntity(transactionCategoryBean);

			selectedTransactionCategory.setCreatedBy(user.getUserId());
			selectedTransactionCategory.setCreatedDate(LocalDateTime.now());
			transactionCategoryService.persist(selectedTransactionCategory);
			return new ResponseEntity<>("Saved successful",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Update Transaction Category")
	@PostMapping(value = "/update")
	public ResponseEntity<String> update(@RequestBody TransactionCategoryBean transactionCategoryBean,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategory selectedTransactionCategory = transactionCategoryService
					.findByPK(transactionCategoryBean.getTransactionCategoryId());
			selectedTransactionCategory
					.setTransactionCategoryName(transactionCategoryBean.getTransactionCategoryName());
			if (!transactionCategoryBean.getChartOfAccount()
					.equals(selectedTransactionCategory.getChartOfAccount().getChartOfAccountId())) {
				ChartOfAccount chartOfAccount = chartOfAccountService
						.findByPK(transactionCategoryBean.getChartOfAccount());
				selectedTransactionCategory.setChartOfAccount(chartOfAccount);
				selectedTransactionCategory.setTransactionCategoryCode(
						transactionCategoryService.getNxtTransactionCatCodeByChartOfAccount(chartOfAccount));
			}
			selectedTransactionCategory.setLastUpdateBy(user.getUserId());
			selectedTransactionCategory.setLastUpdateDate(LocalDateTime.now());
			transactionCategoryService.update(selectedTransactionCategory);
			return new ResponseEntity<>("Updated successfull",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get All Transaction Categories for Expense")
	@GetMapping(value = "/getForExpenses")
	public ResponseEntity<List<TransactionCategory>> getTransactionCatgeoriesForExpenses(HttpServletRequest request) {
		List<TransactionCategory> transactionCategories = transactionCategoryService
				.findAllTransactionCategoryByChartOfAccount(ChartOfAccountConstant.EXPENSE);
		if (transactionCategories != null) {
			for (TransactionCategory cat : transactionCategories) {
				cat.setChartOfAccount(null);
			}
			return new ResponseEntity<>(transactionCategories, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

	}

}

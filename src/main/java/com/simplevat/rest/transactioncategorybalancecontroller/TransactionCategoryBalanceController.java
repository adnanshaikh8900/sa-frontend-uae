package com.simplevat.rest.transactioncategorybalancecontroller;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.User;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.transactioncategorycontroller.TransactionCategoryRestController;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.TransactionCategoryBalanceService;
import com.simplevat.service.UserService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value = "/rest/transactionCategoryBalance")
public class TransactionCategoryBalanceController {
	private final Logger logger = LoggerFactory.getLogger(TransactionCategoryRestController.class);

	@Autowired
	private UserService userServiceNew;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TransactionCategoryBalanceService transactionCategoryBalanceService;

	@Autowired
	private TransactionCategoryBalanceRestHelper transactionCategoryBalanceRestHelper;

	@ApiOperation(value = "Save")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody TransactioncategoryBalancePersistModel persistmodel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategoryBalance openingBalance = transactionCategoryBalanceRestHelper.getEntity(persistmodel);
			openingBalance.setCreatedBy(user.getUserId());
			transactionCategoryBalanceService.persist(openingBalance);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "/Update")
	@PostMapping(value = "update")
	public ResponseEntity update(@RequestBody TransactioncategoryBalancePersistModel persistmodel, HttpServletRequest request)  {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategoryBalance openingBalance = transactionCategoryBalanceRestHelper.getEntity(persistmodel);
			openingBalance.setLastUpdateBy(user.getUserId());
			transactionCategoryBalanceService.persist(openingBalance);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Transaction List")
	@GetMapping(value = "/list")
	public ResponseEntity getAll(HttpServletRequest request) {

		Map<TransactionCategoryBalanceFilterEnum, Object> dataMap = new EnumMap<>(
				TransactionCategoryBalanceFilterEnum.class);
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		dataMap.put(TransactionCategoryBalanceFilterEnum.USER_ID, userId);

		PaginationResponseModel response = transactionCategoryBalanceService.getAll(dataMap);
		if (response == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		response.setData(
				transactionCategoryBalanceRestHelper.getList((List<TransactionCategoryBalance>) response.getData()));
		return new ResponseEntity(response, HttpStatus.OK);
	}

}

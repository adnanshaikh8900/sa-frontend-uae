package com.simplevat.rest.transactioncategorybalancecontroller;

import java.time.LocalDateTime;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.User;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.transactioncategorycontroller.TransactionCategoryRestController;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.TransactionCategoryBalanceService;
import com.simplevat.service.UserService;

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

	@PostMapping(value = "save")
	public ResponseEntity save(TransactioncategoryBalancePersistModel persistmodel, HttpServletRequest request) {
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
}

package com.simplevat.rest.expensescontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.FileTypeEnum;
import com.simplevat.constant.dbfilter.ExpenseFIlterEnum;
import com.simplevat.helper.ExpenseRestHelper;
import com.simplevat.rest.AbstractDoubleEntryRestController;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.entity.Expense;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.utils.FileHelper;
import io.swagger.annotations.ApiOperation;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.EnumMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
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
public class ExpenseRestController extends AbstractDoubleEntryRestController {
	private final Logger LOGGER = LoggerFactory.getLogger(ExpenseRestController.class);

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private ExpenseRestHelper expenseRestHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private FileHelper fileHelper;

	@Autowired
	private TransactionCategoryService expenseTransactionCategoryService;

	@ApiOperation(value = "Get Expense List")
	@GetMapping(value = "/getList")
	public ResponseEntity getExpenseList(ExpenseRequestFilterModel expenseRequestFilterModel) {
		try {

			Map<ExpenseFIlterEnum, Object> filterDataMap = new EnumMap<>(ExpenseFIlterEnum.class);
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
						expenseTransactionCategoryService.findByPK(expenseRequestFilterModel.getTransactionCategoryId()));
			}
			filterDataMap.put(ExpenseFIlterEnum.PAYEE, expenseRequestFilterModel.getPayee());
			filterDataMap.put(ExpenseFIlterEnum.DELETE_FLAG, false);
			PaginationResponseModel response = expenseService.getExpensesList(filterDataMap, expenseRequestFilterModel);
			if (response == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			response.setData(expenseRestHelper.getExpenseList(response.getData()));
			return new ResponseEntity(response, HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Error", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation(value = "Add New Expense")
	@PostMapping(value = "/save")
	public ResponseEntity save(@ModelAttribute ExpenseModel expenseModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

			Expense expense = expenseRestHelper.getExpenseEntity(expenseModel);
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
			LOGGER.error("Error", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation(value = "Update Expense")
	@PostMapping(value = "/update")
	public ResponseEntity update(@ModelAttribute ExpenseModel expenseModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

			if (expenseModel.getExpenseId() != null) {
				Expense expense = expenseRestHelper.getExpenseEntity(expenseModel);
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
			LOGGER.error("Error", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation(value = "Get Expense Detail by Expanse Id")
	@GetMapping(value = "/getExpenseById")
	public ResponseEntity getExpenseById(@RequestParam("expenseId") Integer expenseId) {
		try {
			Expense expense = expenseService.findByPK(expenseId);
			ExpenseModel expenseModel = expenseRestHelper.getExpenseModel(expense);
			return new ResponseEntity(expenseModel, HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Error", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@DeleteMapping(value = "/delete")
	public ResponseEntity delete(@RequestParam("expenseId") Integer expenseId) {
		try {
			Expense expense = expenseService.findByPK(expenseId);
			expense.setDeleteFlag(true);
			expenseService.update(expense);
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (Exception e) {
			LOGGER.error("Error", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/deletes")
	public ResponseEntity bulkDelete(@RequestBody DeleteModel expenseIds) {
		try {
			expenseService.deleteByIds(expenseIds.getIds());
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (Exception e) {
			LOGGER.error("Error", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}

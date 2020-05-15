package com.simplevat.rest.paymentcontroller;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.EnumMap;
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
import com.simplevat.constant.dbfilter.PaymentFilterEnum;
import com.simplevat.entity.Payment;
import com.simplevat.entity.User;
import com.simplevat.helper.PaymentModelHelper;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.PaymentService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.UserService;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author Ashish
 */
@RestController
@RequestMapping(value = "/rest/payment")
public class PaymentController {

	private final Logger logger = LoggerFactory.getLogger(PaymentController.class);

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private CurrencyService currencyService;

	@Autowired
	private ProjectService projectService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private PaymentModelHelper paymentModelHelper;

	@Autowired
	private UserService userServiceNew;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@ApiOperation(value = "Get All Payments")
	@GetMapping(value = "/getlist")
	public ResponseEntity getPaymentList(PaymentRequestFilterModel filterModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Map<PaymentFilterEnum, Object> filterDataMap = new EnumMap<>(PaymentFilterEnum.class);
			if (filterModel.getSupplierId() != null) {
				filterDataMap.put(PaymentFilterEnum.SUPPLIER, contactService.findByPK(filterModel.getSupplierId()));
			}
			if (filterModel.getInvoiceAmount() != null) {
				filterDataMap.put(PaymentFilterEnum.INVOICE_AMOUNT, filterModel.getInvoiceAmount());
			}
			if (filterModel.getPaymentDate() != null && !filterModel.getPaymentDate().isEmpty()) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
				LocalDateTime dateTime = Instant.ofEpochMilli(dateFormat.parse(filterModel.getPaymentDate()).getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
				filterDataMap.put(PaymentFilterEnum.PAYMENT_DATE, dateTime);
			}
			filterDataMap.put(PaymentFilterEnum.USER_ID, userId);
			filterDataMap.put(PaymentFilterEnum.DELETE_FLAG, false);
			PaginationResponseModel response = paymentService.getPayments(filterDataMap, filterModel);

			List<PaymentViewModel> paymentModels = new ArrayList<>();
			if (response != null && response.getData() != null) {
				for (Payment payment : (List<Payment>) response.getData()) {
					PaymentViewModel paymentModel = paymentModelHelper.convertToPaymentViewModel(payment);
					paymentModels.add(paymentModel);
				}
				response.setData(paymentModels);
			}
			if (response != null && response.getData() != null) {
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Get Payment By Id")
	@GetMapping(value = "/getpaymentbyid")
	public ResponseEntity getPaymentById(@RequestParam("paymentId") Integer paymentId) {
		try {
			PaymentPersistModel paymentModel = new PaymentPersistModel();
			if (paymentId != null) {
				Payment payment = paymentService.findByPK(paymentId);
				paymentModel = paymentModelHelper.convertToPaymentPersistModel(payment);
			}
			return new ResponseEntity<>(paymentModel, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Save a Payment")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody PaymentPersistModel paymentModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			Payment payment = paymentModelHelper.convertToPayment(paymentModel);
			if (paymentModel.getBankAccountId() != null) {
				payment.setBankAccount(bankAccountService.findByPK(paymentModel.getBankAccountId()));
			}
			if (paymentModel.getContactId() != null) {
				payment.setSupplier(contactService.findByPK(paymentModel.getContactId()));
			}
			if (paymentModel.getCurrencyCode() != null) {
				payment.setCurrency(currencyService.findByPK(paymentModel.getCurrencyCode()));
			}
			if (paymentModel.getProjectId() != null) {
				payment.setProject(projectService.findByPK(paymentModel.getProjectId()));
			}
			if (paymentModel.getInvoiceId() != null) {
				payment.setInvoice(invoiceService.findByPK(paymentModel.getInvoiceId()));
			}
			payment.setCreatedBy(user.getUserId());
			payment.setCreatedDate(LocalDateTime.now());
			paymentService.persist(payment);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Update Payment")
	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody PaymentPersistModel paymentModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			if (paymentModel.getPaymentId() != null) {
				Payment payment = paymentService.findByPK(paymentModel.getPaymentId());
				if (paymentModel.getBankAccountId() != null) {
					payment.setBankAccount(bankAccountService.findByPK(paymentModel.getBankAccountId()));
				}
				if (paymentModel.getContactId() != null) {
					payment.setSupplier(contactService.findByPK(paymentModel.getContactId()));
				}
				if (paymentModel.getCurrencyCode() != null) {
					payment.setCurrency(currencyService.findByPK(paymentModel.getCurrencyCode()));
				}
				if (paymentModel.getProjectId() != null) {
					payment.setProject(projectService.findByPK(paymentModel.getProjectId()));
				}
				if (paymentModel.getInvoiceId() != null) {
					payment.setInvoice(invoiceService.findByPK(paymentModel.getInvoiceId()));
				}
				payment.setInvoiceAmount(paymentModel.getInvoiceAmount());
				if (paymentModel.getPaymentDate() != null) {
					LocalDateTime paymentDate = Instant.ofEpochMilli(paymentModel.getPaymentDate().getTime())
							.atZone(ZoneId.systemDefault()).toLocalDateTime();
					payment.setPaymentDate(paymentDate);
				}
				payment.setDescription(paymentModel.getDescription());
				payment.setLastUpdateBy(user.getUserId());
				payment.setLastUpdateDate(LocalDateTime.now());
				paymentService.update(payment);
			}
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Payment")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deletePayment(@RequestParam(value = "id") Integer id) {
		Payment payment = paymentService.findByPK(id);
		if (payment != null) {
			payment.setDeleteFlag(Boolean.TRUE);
			paymentService.update(payment, payment.getPaymentId());
		}
		return new ResponseEntity(HttpStatus.OK);

	}

	@ApiOperation(value = "Delete Multiple Payments")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deleteExpenses(@RequestBody DeleteModel expenseIds) {
		try {
			paymentModelHelper.deletePayments(expenseIds, paymentService);
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}

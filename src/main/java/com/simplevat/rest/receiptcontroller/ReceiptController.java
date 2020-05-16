package com.simplevat.rest.receiptcontroller;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.ReceiptFilterEnum;
import com.simplevat.entity.Receipt;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ContactService;
import com.simplevat.service.CustomerInvoiceReceiptService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.ReceiptService;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 * @author $@urabh : For Customer invoice
 */
@RestController
@RequestMapping("/rest/receipt")
public class ReceiptController {

	private final Logger logger = LoggerFactory.getLogger(ReceiptController.class);

	@Autowired
	private ReceiptService receiptService;

	@Autowired
	private ReceiptRestHelper receiptRestHelper;

	@Autowired
	private ContactService contactService;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private CustomerInvoiceReceiptService customerInvoiceReceiptService;

	@ApiOperation(value = "Get receipt List")
	@GetMapping(value = "/getList")
	public ResponseEntity getList(ReceiptRequestFilterModel filterModel, HttpServletRequest request) {
		try {
			Map<ReceiptFilterEnum, Object> filterDataMap = new EnumMap<>(ReceiptFilterEnum.class);

			filterDataMap.put(ReceiptFilterEnum.USER_ID, filterModel.getUserId());
			if (filterModel.getContactId() != null) {
				filterDataMap.put(ReceiptFilterEnum.CONTACT, contactService.findByPK(filterModel.getContactId()));
			}
			if (filterModel.getInvoiceId() != null) {
				filterDataMap.put(ReceiptFilterEnum.INVOICE, invoiceService.findByPK(filterModel.getInvoiceId()));
			}
			filterDataMap.put(ReceiptFilterEnum.REFERENCE_CODE, filterModel.getReferenceCode());
			filterDataMap.put(ReceiptFilterEnum.DELETE, false);
			if (filterModel.getReceiptDate() != null && !filterModel.getReceiptDate().isEmpty()) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
				LocalDateTime dateTime = Instant.ofEpochMilli(dateFormat.parse(filterModel.getReceiptDate()).getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
				filterDataMap.put(ReceiptFilterEnum.RECEIPT_DATE, dateTime);
			}

			PaginationResponseModel response = receiptService.getReceiptList(filterDataMap, filterModel);
			if (response == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			response.setData(receiptRestHelper.getListModel(response.getData()));
			return new ResponseEntity(response, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Receipt By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deleteReceipt(@RequestParam(value = "id") Integer id) {
		try {
			Receipt receipt = receiptService.findByPK(id);
			if (receipt != null) {
				receipt.setDeleteFlag(Boolean.TRUE);
				receiptService.update(receipt, receipt.getId());
			}
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Reecipt in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deleteReceipts(@RequestBody DeleteModel ids) {
		try {
			receiptService.deleteByIds(ids.getIds());
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get Receipt By ID")
	@GetMapping(value = "/getReceiptById")
	public ResponseEntity getReceiptById(@RequestParam(value = "id") Integer id) {
		try {
			Receipt receipt = receiptService.findByPK(id);
			if (receipt == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			} else {
				return new ResponseEntity<>(receiptRestHelper.getRequestModel(receipt), HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Add New Receipt")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody ReceiptRequestModel receiptRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Receipt receipt = receiptRestHelper.getEntity(receiptRequestModel);
			receipt.setCreatedBy(userId);
			receipt.setCreatedDate(LocalDateTime.now());
			receipt.setDeleteFlag(Boolean.FALSE);
			receiptService.persist(receipt);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Update Receipt")
	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody ReceiptRequestModel receiptRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Receipt receipt = receiptRestHelper.getEntity(receiptRequestModel);
			receipt.setLastUpdateDate(LocalDateTime.now());
			receipt.setLastUpdatedBy(userId);
			receiptService.update(receipt);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Next Receipt No")
	@GetMapping(value = "/getNextReceiptNo")
	public ResponseEntity getNextReceiptNo(@RequestParam("id") Integer invoiceId) {
		try {
			Integer nxtInvoiceNo = customerInvoiceReceiptService.findNextReceiptNoForInvoice(invoiceId);
			if (nxtInvoiceNo == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity(nxtInvoiceNo, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

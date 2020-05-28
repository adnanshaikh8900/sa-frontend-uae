package com.simplevat.rest.receiptcontroller;

import static com.simplevat.constant.ErrorConstant.ERROR;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.FileTypeEnum;
import com.simplevat.constant.dbfilter.ReceiptFilterEnum;
import com.simplevat.entity.CustomerInvoiceReceipt;
import com.simplevat.entity.Journal;
import com.simplevat.entity.Receipt;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.PostingRequestModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ContactService;
import com.simplevat.service.CustomerInvoiceReceiptService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.JournalService;
import com.simplevat.service.ReceiptService;
import com.simplevat.utils.FileHelper;

import io.swagger.annotations.ApiOperation;

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

	@Autowired
	private JournalService journalService;

	@Autowired
	private FileHelper fileHelper;

	@ApiOperation(value = "Get receipt List")
	@GetMapping(value = "/getList")
	public ResponseEntity<PaginationResponseModel> getList(ReceiptRequestFilterModel filterModel, HttpServletRequest request) {
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
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
			response.setData(receiptRestHelper.getListModel(response.getData()));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Receipt By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity<String> deleteReceipt(@RequestParam(value = "id") Integer id) {
		try {
			Receipt receipt = receiptService.findByPK(id);
			if (receipt != null) {
				receipt.setDeleteFlag(Boolean.TRUE);
				receiptService.update(receipt, receipt.getId());
			}
			return new ResponseEntity<>("Deleted Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Reecipt in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity<String> deleteReceipts(@RequestBody DeleteModel ids) {
		try {
			receiptService.deleteByIds(ids.getIds());
			return new ResponseEntity<>("Deleted Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get Receipt By ID")
	@GetMapping(value = "/getReceiptById")
	public ResponseEntity<ReceiptRequestModel> getReceiptById(@RequestParam(value = "id") Integer id) {
		try {
			Receipt receipt = receiptService.findByPK(id);
			if (receipt == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			} else {
				return new ResponseEntity<>(receiptRestHelper.getRequestModel(receipt), HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Add New Receipt")
	@PostMapping(value = "/save")
	public ResponseEntity<String> save(@ModelAttribute ReceiptRequestModel receiptRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Receipt receipt = receiptRestHelper.getEntity(receiptRequestModel);

			// save Attcahement
			if (receiptRequestModel.getAttachmentFile() != null && !receiptRequestModel.getAttachmentFile().isEmpty()) {
				String fileName = fileHelper.saveFile(receiptRequestModel.getAttachmentFile(), FileTypeEnum.RECEIPT);
				receipt.setReceiptAttachmentFileName(receiptRequestModel.getAttachmentFile().getOriginalFilename());
				receipt.setReceiptAttachmentPath(fileName);
			}

			receipt.setCreatedBy(userId);
			receipt.setCreatedDate(LocalDateTime.now());
			receipt.setDeleteFlag(Boolean.FALSE);
			receiptService.persist(receipt);

			// save data in Mapping Table
			List<CustomerInvoiceReceipt> customerInvoiceReceiptList = receiptRestHelper
					.getCustomerInvoiceReceiptEntity(receiptRequestModel);
			for (CustomerInvoiceReceipt customerInvoiceReceipt : customerInvoiceReceiptList) {
				customerInvoiceReceipt.setReceipt(receipt);
				customerInvoiceReceipt.setCreatedBy(userId);
				customerInvoiceReceiptService.persist(customerInvoiceReceipt);
			}
			// Post journal
			Journal journal = receiptRestHelper.receiptPosting(
					new PostingRequestModel(receipt.getId(), receipt.getAmount()), userId,
					receipt.getDepositeToTransactionCategory());
			journalService.persist(journal);

			return new ResponseEntity<>("Saved Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Update Receipt")
	@PostMapping(value = "/update")
	public ResponseEntity<String> update(@ModelAttribute ReceiptRequestModel receiptRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Receipt receipt = receiptRestHelper.getEntity(receiptRequestModel);

			// save Attcahement
			if (receiptRequestModel.getAttachmentFile() != null && !receiptRequestModel.getAttachmentFile().isEmpty()) {
				String fileName = fileHelper.saveFile(receiptRequestModel.getAttachmentFile(), FileTypeEnum.RECEIPT);
				receipt.setReceiptAttachmentFileName(receiptRequestModel.getAttachmentFile().getOriginalFilename());
				receipt.setReceiptAttachmentPath(fileName);
			}

			// No need to Update data in Mapping Table

			// Update journal
			Journal journal = receiptRestHelper.receiptPosting(
					new PostingRequestModel(receipt.getId(), receipt.getAmount()), userId,
					receipt.getDepositeToTransactionCategory());
			journalService.update(journal);

			receipt.setLastUpdateDate(LocalDateTime.now());
			receipt.setLastUpdatedBy(userId);
			receiptService.update(receipt);
			return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Next Receipt No")
	@GetMapping(value = "/getNextReceiptNo")
	public ResponseEntity<Integer> getNextReceiptNo(@RequestParam("id") Integer invoiceId) {
		try {
			Integer nxtInvoiceNo = customerInvoiceReceiptService.findNextReceiptNoForInvoice(invoiceId);
			if (nxtInvoiceNo == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity<>(nxtInvoiceNo, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

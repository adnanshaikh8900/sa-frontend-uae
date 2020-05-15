package com.simplevat.rest.journalcontroller;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collection;
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
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.JournalLineItemService;
import com.simplevat.service.JournalService;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author saurabhg
 */
@RestController
@RequestMapping(value = "/rest/journal")
public class JournalRestController {
	private final Logger logger = LoggerFactory.getLogger(JournalRestController.class);
	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private JournalService journalService;

	@Autowired
	private JournalRestHelper journalRestHelper;

	@Autowired
	private JournalLineItemService journalLineItemService;

	@ApiOperation(value = "Get Journal List")
	@GetMapping(value = "/getList")
	public ResponseEntity getList(JournalRequestFilterModel filterModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Map<JournalFilterEnum, Object> filterDataMap = new EnumMap<>(JournalFilterEnum.class);
			filterDataMap.put(JournalFilterEnum.USER_ID, userId);
			if (filterModel.getDescription() != null && !filterModel.getDescription().equals(" "))
				filterDataMap.put(JournalFilterEnum.DESCRIPTION, filterModel.getDescription());
			filterDataMap.put(JournalFilterEnum.REFERENCE_NO, filterModel.getJournalReferenceNo());
			if (filterModel.getJournalDate() != null && !filterModel.getJournalDate().isEmpty()) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
				LocalDateTime dateTime = Instant.ofEpochMilli(dateFormat.parse(filterModel.getJournalDate()).getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
				filterDataMap.put(JournalFilterEnum.JOURNAL_DATE, dateTime);
			}
			filterDataMap.put(JournalFilterEnum.DELETE_FLAG, false);
			PaginationResponseModel responseModel = journalService.getJornalList(filterDataMap, filterModel);
			if (responseModel == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity(
					filterModel.isPaginationDisable() ? journalRestHelper.getCsvListModel(responseModel)
							: journalRestHelper.getListModel(responseModel),
					HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Journal By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deleteProduct(@RequestParam(value = "id") Integer id) {
		Journal journal = journalService.findByPK(id);
		if (journal != null) {
			if (journal.getJournalLineItems() != null) {
				for (JournalLineItem lineItem : journal.getJournalLineItems()) {
					lineItem.setDeleteFlag(Boolean.TRUE);
					journalLineItemService.update(lineItem);
				}
			}
			journal.setDeleteFlag(Boolean.TRUE);
			journalService.update(journal, journal.getId());
		}
		return new ResponseEntity(HttpStatus.OK);

	}

	@ApiOperation(value = "Delete Journal in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deleteProducts(@RequestBody DeleteModel ids) {
		try {
			for (Integer id : ids.getIds()) {
				deleteProduct(id);
			}
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get Journal By ID")
	@GetMapping(value = "/getById")
	public ResponseEntity getInvoiceById(@RequestParam(value = "id") Integer id) {
		Journal journal = journalService.findByPK(id);
		if (journal == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(journalRestHelper.getModel(journal, false), HttpStatus.OK);
		}
	}

	@ApiOperation(value = "Add New Journal Invoice")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody JournalRequestModel journalRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Journal journal = journalRestHelper.getEntity(journalRequestModel, userId);
			journal.setCreatedBy(userId);
			journal.setCreatedDate(LocalDateTime.now());
			journal.setDeleteFlag(Boolean.FALSE);
			journal.setPostingReferenceType(PostingReferenceTypeEnum.MANUAL);
			journalService.persist(journal);

			// add reference by in line item
			if (!journal.getJournalLineItems().isEmpty()) {
				Collection<JournalLineItem> journalLineItems = journalRestHelper
						.setReferenceId(journal.getJournalLineItems(), journal.getId());
				journal.setJournalLineItems(journalLineItems);
			}
			journalService.update(journal);

			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation(value = "Update Journal")
	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody JournalRequestModel jouralRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Journal journal = journalRestHelper.getEntity(jouralRequestModel, userId);
			journal.setLastUpdateDate(LocalDateTime.now());
			journal.setLastUpdateBy(userId);
			journalService.update(journal);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}

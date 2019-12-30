package com.simplevat.rest.journalcontroller;

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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.JournalFilterEnum;
import com.simplevat.entity.Journal;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.JournalService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author saurabhg
 */
@RestController
@RequestMapping(value = "/rest/journal")
public class JournalRestController {

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private JournalService journalService;

	@Autowired
	private JournalRestHelper journalRestHelper;

	@ApiOperation(value = "Get Journal List")
	@GetMapping(value = "/getList")
	public ResponseEntity getSupplierInvoiceList(JournalRequestFilterModel filterModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Map<JournalFilterEnum, Object> filterDataMap = new HashMap();
			// TODO : add filter param in num and set in filter datamap also add attribute
			// in JournalRequestFilterModel
			List<Journal> journals = journalService.getJornalList(filterDataMap);

			if (journals == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity(journalRestHelper.getListModel(journals), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Journal By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deleteProduct(@RequestParam(value = "id") Integer id) {
		Journal journal = journalService.findByPK(id);
		if (journal != null) {
			journal.setDeleteFlag(Boolean.TRUE);
			journalService.update(journal, journal.getId());
		}
		return new ResponseEntity(HttpStatus.OK);

	}

	@ApiOperation(value = "Delete Journal in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deleteProducts(@RequestBody DeleteModel ids) {
		try {
			journalService.deleteByIds(ids.getIds());
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get Journal By ID")
	@GetMapping(value = "/getInvoiceById")
	public ResponseEntity getInvoiceById(@RequestParam(value = "id") Integer id) {
		Journal journal = journalService.findByPK(id);
		if (journal == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(journal, HttpStatus.OK);
		}
	}

	@ApiOperation(value = "Add New Journal Invoice")
	@PostMapping(value = "/save")
	public ResponseEntity save(@ModelAttribute JournalRequestModel JournalRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Journal journal = journalRestHelper.getEntity(JournalRequestModel, userId);
			journal.setCreatedBy(userId);
			journal.setCreatedDate(LocalDateTime.now());
			journal.setDeleteFlag(Boolean.FALSE);
			journalService.persist(journal);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}

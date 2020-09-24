/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.contactcontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.ContactFilterEnum;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.entity.Contact;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ContactService;
import com.simplevat.service.InvoiceService;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping("/rest/contact")
public class ContactController {

	private final Logger logger = LoggerFactory.getLogger(ContactController.class);

	@Autowired
	private ContactService contactService;

	@Autowired
	private ContactHelper contactHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private InvoiceService invoiceService;

	@GetMapping(value = "/getContactList")
	public ResponseEntity<PaginationResponseModel> getContactList(ContactRequestFilterModel filterModel, HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		try {
			Map<ContactFilterEnum, Object> filterDataMap = new EnumMap<>(ContactFilterEnum.class);
			filterDataMap.put(ContactFilterEnum.CONTACT_TYPE, filterModel.getContactType());
			filterDataMap.put(ContactFilterEnum.NAME, filterModel.getName());
			filterDataMap.put(ContactFilterEnum.EMAIL, filterModel.getEmail());
			filterDataMap.put(ContactFilterEnum.DELETE_FLAG, false);
			filterDataMap.put(ContactFilterEnum.USER_ID, userId);
			filterDataMap.put(ContactFilterEnum.ORDER_BY, ORDERBYENUM.DESC);

			PaginationResponseModel response = contactService.getContactList(filterDataMap, filterModel);
			if (response == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
			if (response.getData() != null) {
				response.setData(contactHelper.getModelList(response.getData()));
			}
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/getContactsForDropdown")
	public ResponseEntity<List<DropdownModel>> getContactsForDropdown(
			@RequestParam(name = "contactType", required = false) Integer contactType) {
		return new ResponseEntity<>(contactService.getContactForDropdown(contactType), HttpStatus.OK);
	}

	@GetMapping(value = "/getContactById")
	public ResponseEntity<ContactPersistModel> getContactById(@RequestParam("contactId") Integer contactId) {
		ContactPersistModel contactPersistModel = contactHelper
				.getContactPersistModel(contactService.findByPK(contactId));
		return new ResponseEntity<>(contactPersistModel, HttpStatus.OK);
	}

	@PostMapping(value = "/save")
	public ResponseEntity<ContactListModel> save(@RequestBody ContactPersistModel contactPersistModel, HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		try {
			Map<String, Object> param = new HashMap<>();
			param.put("email", contactPersistModel.getEmail());
			List<Contact> existingContact = contactService.findByAttributes(param);

			if (existingContact != null && !existingContact.isEmpty()) {
				return new ResponseEntity("Email Already exists.", HttpStatus.BAD_REQUEST);
			}
			
			Contact contact = contactHelper.getEntity(contactPersistModel);
			contact.setCreatedBy(userId);
			contact.setCreatedDate(LocalDateTime.now());
			contact.setDeleteFlag(false);
			contactService.persist(contact);
			return new ResponseEntity<>(contactHelper.getModel(contact), HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

		}
	}

	@PostMapping(value = "/update")
	public ResponseEntity<String> update(@RequestBody ContactPersistModel contactPersistModel, HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		try {
			if (contactPersistModel.getContactId() != null && contactPersistModel.getContactId() > 0) {
				Contact contact = contactHelper.getEntity(contactPersistModel);
				contact.setLastUpdatedBy(userId);
				contact.setLastUpdateDate(LocalDateTime.now());
				contactService.update(contact);
			}
			return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

		}
	}

	@DeleteMapping(value = "/delete")
	public ResponseEntity<String> delete(@RequestParam(value = "id") Integer id, HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		Contact contact = contactService.findByPK(id);
		if (contact == null) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		contact.setDeleteFlag(Boolean.TRUE);
		contact.setLastUpdatedBy(userId);
		contactService.update(contact);
		return new ResponseEntity<>("Deleted Successfully",HttpStatus.OK);

	}

	@DeleteMapping(value = "/deletes")
	public ResponseEntity<String> deletes(@RequestBody DeleteModel ids, HttpServletRequest request) {

		try {
			contactService.deleleByIds(ids.getIds());
			return new ResponseEntity<>("Deleted Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}

		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	@ApiOperation(value = "Get Invoices Count For Contact")
	@GetMapping(value = "/getInvoicesCountForContact")
	public ResponseEntity<Integer> getExplainedTransactionCount(@RequestParam int contactId){
		Integer response = invoiceService.getTotalInvoiceCountByContactId(contactId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}

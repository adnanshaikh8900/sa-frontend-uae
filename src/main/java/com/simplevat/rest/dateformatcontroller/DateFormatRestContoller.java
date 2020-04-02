package com.simplevat.rest.dateformatcontroller;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.DateFormatFilterEnum;
import com.simplevat.entity.DateFormat;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.DateFormatService;
import io.swagger.annotations.ApiOperation;

@Controller
@RequestMapping("/rest/dateFormat")
public class DateFormatRestContoller {

	private static final Logger LOGGER = LoggerFactory.getLogger(DateFormatRestContoller.class);

	@Autowired
	private DateFormatService dateFormatService;

	@Autowired
	private DateFormatRestHelper dateFormatRestHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@ApiOperation(value = "Get list of DateFormat")
	@GetMapping(value = "/getList")
	public ResponseEntity<List<DateFormatResponseModel>> getDateFormat() {
		Map<DateFormatFilterEnum, Object> filterDataMap = new EnumMap<>(DateFormatFilterEnum.class);
		filterDataMap.put(DateFormatFilterEnum.DELETE_FLAG, false);
		List<DateFormat> dateFormatList = dateFormatService.getDateFormatList(filterDataMap);
		if (dateFormatList == null) {
			LOGGER.error("Error = ", "NO DATA AVALIBALE FOR DATE FORMAT");
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity(dateFormatRestHelper.getModelList(dateFormatList), HttpStatus.OK);
	}

	@ApiOperation(value = "Save Datformat")
	@PostMapping(value = "/save")
	public ResponseEntity save(DateFormatRequestModel requestModel, HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		DateFormat dateFormat = dateFormatRestHelper.getEntity(requestModel);
		if (dateFormat != null) {
			dateFormat.setCreatedBy(userId);
			dateFormat.setCreatedDate(LocalDateTime.now());
			dateFormatService.update(dateFormat, dateFormat.getId());
		}
		return new ResponseEntity(HttpStatus.OK);
	}

	@ApiOperation(value = "Delete DateFormat By Id")
	@DeleteMapping(value = "/delete")
	public ResponseEntity delete(@RequestParam(value = "id") Integer id, HttpServletRequest request) {
		DateFormat dateFormat = dateFormatService.findByPK(id);
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		if (dateFormat != null) {
			dateFormat.setDeleteFlag(Boolean.TRUE);
			dateFormat.setLastUpdatedBy(userId);
			dateFormatService.update(dateFormat, dateFormat.getId());
		}
		return new ResponseEntity(HttpStatus.OK);

	}

	@ApiOperation(value = "Delete DateFormat in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deletes(@RequestBody DeleteModel ids) {
		try {
			dateFormatService.deleteByIds(ids.getIds());
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Error = ", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Update DateFormat")
	@PostMapping(value = "/update")
	public ResponseEntity update(DateFormatRequestModel dateFormatRequestModel, HttpServletRequest request) {
		DateFormat dateFormat = dateFormatService.findByPK(dateFormatRequestModel.getId());
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		dateFormat = dateFormatRestHelper.getEntity(dateFormatRequestModel);
		dateFormat.setLastUpdatedBy(userId);
		dateFormat.setLastUpdateDate(LocalDateTime.now());
		dateFormat = dateFormatService.update(dateFormat);
		if (dateFormat == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(dateFormatRestHelper.getModel(dateFormat), HttpStatus.OK);
		}
	}

	@ApiOperation(value = "update DateFormat By Id")
	@GetMapping(value = "/getById")
	public ResponseEntity<DateFormatResponseModel> getById(@RequestParam(value = "id") Integer id) {

		DateFormat dateFormat = dateFormatService.findByPK(id);

		if (dateFormat == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} else {
			LOGGER.error("Error = NOT FOUND dateFormtter ID" + id);
		}
		return new ResponseEntity(dateFormatRestHelper.getModel(dateFormat), HttpStatus.OK);
	}
}

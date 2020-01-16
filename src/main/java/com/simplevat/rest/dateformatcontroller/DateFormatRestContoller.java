package com.simplevat.rest.dateformatcontroller;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

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
import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.entity.DateFormat;
import com.simplevat.entity.Product;
import com.simplevat.entity.ProductWarehouse;
import com.simplevat.entity.VatCategory;
import com.simplevat.rest.productcontroller.ProductModelHelper;
import com.simplevat.rest.productcontroller.ProductRequestFilterModel;
import com.simplevat.rest.productcontroller.ProductRequestModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.DateFormatService;
import com.simplevat.service.ProductService;
import com.simplevat.service.ProductWarehouseService;
import com.simplevat.service.VatCategoryService;

import io.swagger.annotations.ApiOperation;

@Controller
@RequestMapping("/rest/dateFormat")
public class DateFormatRestContoller implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Autowired
	private DateFormatService dateFormatService;

	@Autowired
	private DateFormatRestHelper dateFormatRestHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@ApiOperation(value = "Get list of DateFormat")
	@GetMapping(value = "/getList")
	private ResponseEntity<List<DateFormatResponseModel>> getDateFormat() {

		Map<DateFormatFilterEnum, Object> filterDataMap = new HashMap();

		filterDataMap.put(DateFormatFilterEnum.DELETE_FLAG, false);

		List<DateFormat> dateFormatList = dateFormatService.getDateFormatList(filterDataMap);

		try {
			if (dateFormatList == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(dateFormatRestHelper.getModelList(dateFormatList), HttpStatus.OK);
	}

	@ApiOperation(value = "Save Datformat")
	@PostMapping(value = "/save")
	private ResponseEntity save(DateFormatRequestModel requestModel, HttpServletRequest request) {

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
	private ResponseEntity delete(@RequestParam(value = "id") Integer id, HttpServletRequest request) {
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
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Update DateFormat")
	@PostMapping(value = "/update")
	private ResponseEntity<DateFormatResponseModel> update(@RequestParam(value = "id") Integer id,
			HttpServletRequest request) {
		DateFormat dateFormat = dateFormatService.findByPK(id);
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		dateFormat.setLastUpdatedBy(userId);
		dateFormat.setLastUpdateDate(LocalDateTime.now());

		if (dateFormat == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(dateFormatRestHelper.getModel(dateFormat), HttpStatus.OK);
		}
	}

	@ApiOperation(value = "update DateFormat By Id")
	@GetMapping(value = "/getById")
	private ResponseEntity<DateFormatResponseModel> getById(@RequestParam(value = "id") Integer id) {

		DateFormat dateFormat = dateFormatService.findByPK(id);
		try {
			if (dateFormat == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(dateFormatRestHelper.getModel(dateFormat), HttpStatus.OK);
	}

}

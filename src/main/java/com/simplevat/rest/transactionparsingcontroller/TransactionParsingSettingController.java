package com.simplevat.rest.transactionparsingcontroller;

import java.time.LocalDateTime;
import java.util.HashMap;
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

import com.simplevat.constant.dbfilter.TransactionParsingSettingFilterEnum;
import com.simplevat.criteria.enums.TransactionEnum;
import com.simplevat.entity.TransactionDataColMapping;
import com.simplevat.entity.TransactionParsingSetting;
import com.simplevat.constant.ExcellDelimiterEnum;
import com.simplevat.parserengine.CsvParser;
import com.simplevat.parserengine.ExcelParser;
import com.simplevat.rest.EnumDropdownModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.TransactionParsingSettingService;
import com.simplevat.utils.FileHelper;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.*;

@RestController
@RequestMapping(value = "/rest/transactionParsing")
public class TransactionParsingSettingController {

	private final Logger logger = LoggerFactory.getLogger(TransactionParsingSettingController.class);

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TransactionParsingSettingRestHelper transactionParsingRestHelper;

	@Autowired
	private TransactionParsingSettingService transactionParsingSettingService;

	@Autowired
	private CsvParser csvParser;

	@Autowired
	private ExcelParser excelParser;

	@Autowired
	private FileHelper fileHelper;

	@ApiOperation("Parse excel file for Data")
	@PostMapping(value = "/parse")
	public ResponseEntity getDateFormat(@ModelAttribute TransactionParsingSettingPersistModel model) {

		List<Map<String, String>> dataMap = null;
		switch (fileHelper.getFileExtension(model.getFile().getOriginalFilename())) {
		case "csv":
			dataMap = csvParser.parseSmaple(model);
			break;

		case "xlsx":
		case "xlx":
			dataMap = excelParser.parseSmaple(model);
			break;

		}
		if (dataMap == null) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>(dataMap, HttpStatus.OK);
	}

	@ApiOperation("Get databse column enum list")
	@GetMapping(value = "/dbColEnum/list")
	public ResponseEntity<List<EnumDropdownModel>> getDateFormatList() {
		return new ResponseEntity<>(TransactionEnum.getDropdownList(), HttpStatus.OK);
	}

	@ApiOperation("Get delimiter enum list")
	@GetMapping(value = "/delimiter/list")
	public ResponseEntity<List<EnumDropdownModel>> getDelimiterList() {
		return new ResponseEntity<>(ExcellDelimiterEnum.getDropdownList(), HttpStatus.OK);
	}

	@ApiOperation("Save  new Transaction Parsing setting")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody TransactionParsingSettingPersistModel persistModel,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

			TransactionParsingSetting transactionParsigSetting = transactionParsingRestHelper.getEntity(persistModel);
			transactionParsigSetting.setCreatedBy(userId);
			transactionParsigSetting.setCreatedDate(LocalDateTime.now());
			transactionParsigSetting.setDeleteFlag(false);
			for (TransactionDataColMapping mapping : transactionParsigSetting.getTransactionDtaColMapping()) {
				mapping.setCreatedBy(userId);
				mapping.setCreatedDate(LocalDateTime.now());
			}
			transactionParsingSettingService.persist(transactionParsigSetting);
			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("id", transactionParsigSetting.getId());
			return new ResponseEntity(responseMap, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation("Update  Transaction Parsing setting")
	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody TransactionParsingSettingPersistModel persistModel,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

			TransactionParsingSetting transactionParsigSetting = transactionParsingRestHelper.getEntity(persistModel);
			transactionParsigSetting.setLastUpdatedBy(userId);
			transactionParsigSetting.setLastUpdateDate(LocalDateTime.now());
			for (TransactionDataColMapping mapping : transactionParsigSetting.getTransactionDtaColMapping()) {
				mapping.setLastUpdatedBy(userId);
				mapping.setLastUpdateDate(LocalDateTime.now());
			}
			transactionParsingSettingService.persist(transactionParsigSetting);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@ApiOperation("Getlist")
	@GetMapping(value = "/list")
	public ResponseEntity getTransactionParserSettigList(HttpServletRequest request) {
		try {
			Map<TransactionParsingSettingFilterEnum, Object> filterDataMap = new HashMap();
			filterDataMap.put(TransactionParsingSettingFilterEnum.DELETE_FLAG, false);
			List<TransactionParsingSetting> transactionParsingSettingList = transactionParsingSettingService
					.geTransactionParsingList(filterDataMap);
			if (transactionParsingSettingList == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity<>(transactionParsingRestHelper.getModelList(transactionParsingSettingList),
					HttpStatus.OK);

		} catch (Exception e) {
			logger.error("Error", e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity delete(@RequestParam(value = "id") Long id) {
		TransactionParsingSetting transactionParsingSetting = transactionParsingSettingService.findByPK(id);
		if (transactionParsingSetting != null) {
			transactionParsingSetting.setDeleteFlag(Boolean.TRUE);
			transactionParsingSettingService.update(transactionParsingSetting, transactionParsingSetting.getId());
		}
		return new ResponseEntity(HttpStatus.OK);
	}

	@ApiOperation("Get by Id")
	@GetMapping(value = "/getById")
	public ResponseEntity getDateFormatList(@RequestParam(value = "id") Long id) {
		try {
			TransactionParsingSetting setting = transactionParsingSettingService.findByPK(id);
			TransactionParsingSettingDetailModel model = transactionParsingRestHelper.getModel(setting);
			if (model == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity(model, HttpStatus.OK);

		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation("Getlist")
	@GetMapping(value = "/selectModelList")
	public ResponseEntity getTransactionParserSettigSelectModelList(HttpServletRequest request) {
		try {
			Map<TransactionParsingSettingFilterEnum, Object> filterDataMap = new HashMap();
			filterDataMap.put(TransactionParsingSettingFilterEnum.DELETE_FLAG, false);
			List<TransactionParsingSetting> transactionParsingSettingList = transactionParsingSettingService
					.geTransactionParsingList(filterDataMap);
			if (transactionParsingSettingList == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity<>(transactionParsingRestHelper.getSelectModelList(transactionParsingSettingList),
					HttpStatus.OK);

		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}

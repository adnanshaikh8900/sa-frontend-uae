/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactionimportcontroller;

import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.FileHelper;

import io.swagger.annotations.ApiOperation;

import com.simplevat.model.TransactionModel;
import com.simplevat.model.FileModel;
import com.simplevat.constant.TransactionCreditDebitConstant;
import com.simplevat.constant.TransactionEntryTypeConstant;
import com.simplevat.constant.TransactionStatusConstant;
import com.simplevat.entity.TransactionParsingSetting;
import com.simplevat.entity.User;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.parserengine.CsvParser;
import com.simplevat.parserengine.ExcelParser;
import com.simplevat.rest.transactioncontroller.TransactionPresistModel;
import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingDetailModel;
import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingRestHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.UserService;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.TransactionParsingSettingService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import java.io.File;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/transactionimport")
public class TransactionImportController implements Serializable {

	@Autowired
	private CsvParser csvParser;

	@Autowired
	private ExcelParser excelParser;

	@Autowired
	private FileHelper fileHelper;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	private ChartOfAccountService transactionTypeService;

	@Autowired
	private TransactionStatusService transactionStatusService;

	@Autowired
	private UserService userServiceNew;

	@Autowired
	private TransactionParsingSettingService transactionParsingSettingService;
	@Autowired
	private TransactionParsingSettingRestHelper transactionParsingSettingRestHelper;

	@Autowired
	TransactionImportRestHelper transactionImportRestHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@ApiOperation(value = "Get Bank Account List")
	@GetMapping(value = "/getbankaccountlist")
	public ResponseEntity<List<BankAccount>> getBankAccount() {
		List<BankAccount> bankAccounts = bankAccountService.getBankAccounts();
		if (bankAccounts != null) {
			return new ResponseEntity<>(bankAccounts, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@ApiOperation(value = "Download csv of Tranaction")
	@GetMapping(value = "/downloadcsv")
	public ResponseEntity<FileModel> downloadSimpleFile() {
		ClassLoader classLoader = getClass().getClassLoader();
		File file = new File(classLoader.getResource("excel-file/SampleTransaction.csv").getFile());
		FileModel fileModel = new FileModel();
		if (file.exists()) {
			String filepath = file.getAbsolutePath();
			fileModel.setFilePath(filepath);
			fileModel.setName("fileName");
			return new ResponseEntity<>(fileModel, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

	}

	@ApiOperation(value = "Get List of Date format")
	@GetMapping(value = "/getformatdate")
	public ResponseEntity<List<String>> getDateFormatList() {
		List<String> dateFormatList = DateFormatUtil.dateFormatList();
		if (dateFormatList != null) {
			return new ResponseEntity<>(dateFormatList, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@Deprecated
	@ApiOperation(value = "Save Import Transaction")
	@PostMapping(value = "/saveimporttransaction")
	public ResponseEntity<Integer> saveTransactions(@RequestBody List<TransactionModel> transactionList,
			@RequestParam(value = "id") Integer id, @RequestParam(value = "bankId") Integer bankId) {
		for (TransactionModel transaction : transactionList) {
			save(transaction, id, bankId);
		}
		return new ResponseEntity<>(bankId, HttpStatus.OK);
	}

	void save(TransactionModel transaction, Integer id, Integer bankId) {
		System.out.println("transaction===" + transaction);
		try {
			User loggedInUser = userServiceNew.findByPK(id);
			com.simplevat.entity.bankaccount.Transaction transaction1 = new com.simplevat.entity.bankaccount.Transaction();
			transaction1.setLastUpdateBy(loggedInUser.getUserId());
			transaction1.setCreatedBy(loggedInUser.getUserId());
			BankAccount bankAccount = bankAccountService.findByPK(bankId);
			transaction1.setBankAccount(bankAccount);
			transaction1.setEntryType(TransactionEntryTypeConstant.IMPORT);
			transaction1.setTransactionDescription(transaction.getDescription());
			LocalDate date = LocalDate.parse(transaction.getTransactionDate(), DateTimeFormatter.ofPattern("M/d/yyyy"));
			LocalTime time = LocalTime.now();
			transaction1.setTransactionDate(LocalDateTime.of(date, time));
			if (transaction.getDebit() != null && !transaction.getDebit().trim().isEmpty()) {
				transaction1.setTransactionAmount(
						BigDecimal.valueOf(Double.parseDouble(transaction.getDebit().replaceAll(",", ""))));
				transaction1.setDebitCreditFlag(TransactionCreditDebitConstant.DEBIT);
			}
			if (transaction.getCredit() != null && !transaction.getCredit().trim().isEmpty()) {
				transaction1.setTransactionAmount(
						BigDecimal.valueOf(Double.parseDouble(transaction.getCredit().replaceAll(",", ""))));
				transaction1.setDebitCreditFlag(TransactionCreditDebitConstant.CREDIT);
			}
			transaction1.setTransactionStatus(transactionStatusService.findByPK(TransactionStatusConstant.UNEXPLAINED));
			transactionService.persist(transaction1);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@ApiOperation(value = "Import Trnsaction")
	@PostMapping(value = "/save")
	public ResponseEntity<Integer> importTransaction(@RequestBody TransactionImportModel transactionImportModel,
			HttpServletRequest request) {

		List<com.simplevat.entity.bankaccount.Transaction> transactionList = null;
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		transactionImportModel.setCreatedBy(userId);
		transactionList = transactionImportRestHelper.getEntity(transactionImportModel);

		if (transactionList == null) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

		boolean status = transactionService.saveTransactions(transactionList);

		if (!status) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(transactionImportModel.getBankId(), HttpStatus.OK);
	}

	@ApiOperation(value = "parse file and return data according template")
	@PostMapping("/parse")
	public ResponseEntity parseTransaction(@RequestBody MultipartFile file, @RequestParam(value = "id") Long id) {

		TransactionParsingSetting parsingSetting = transactionParsingSettingService.findByPK(id);
		TransactionParsingSettingDetailModel model = transactionParsingSettingRestHelper.getModel(parsingSetting);

		Map dataMap = null;

		switch (fileHelper.getFileExtension(file.getOriginalFilename())) {

		case "csv":
			dataMap = csvParser.parseImportData(model, file);
			break;

		case "xlsx":
		case "xlx":
			dataMap = excelParser.parseImportData(model, file);
			break;
		}

		if (dataMap == null) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>(dataMap, HttpStatus.OK);
	}

}

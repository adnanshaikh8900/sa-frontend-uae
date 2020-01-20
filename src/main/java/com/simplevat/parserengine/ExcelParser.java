package com.simplevat.parserengine;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.simplevat.criteria.enums.TransactionEnum;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.rest.transactioncontroller.TransactionPresistModel;
import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingDetailModel;
import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingPersistModel;
import com.simplevat.service.BankAccountService;

@Component
public class ExcelParser implements TransactionFileParser {

	@Autowired
	private BankAccountService bankAccountService;

	public Integer firstRowIndex = 0;

	@Override
	public List<Map<String, String>> parseSmaple(TransactionParsingSettingPersistModel model) {

		firstRowIndex = model.getHeaderRowNo() != null ? model.getHeaderRowNo() - 1 : 0;

		if (model.getFile() != null) {

			Map<Integer, String> indexHeaderMap = new HashMap<Integer, String>();

			List<Map<String, String>> list = new ArrayList<Map<String, String>>();

			// Creating a Workbook from an Excel file (.xls or .xlsx)
			try {
				Workbook workbook = WorkbookFactory.create(model.getFile().getInputStream());

				// Create a DataFormatter to format and get each cell's value as String
				DataFormatter dataFormatter = new DataFormatter();

				workbook.forEach(sheet -> {
					System.out.println("=> " + sheet.getSheetName());
					Map<String, String> dataeMap = new LinkedHashMap<String, String>();
					sheet.forEach(row -> {
						row.forEach(cell -> {
							String cellValue = dataFormatter.formatCellValue(cell);
							if (cell.getRow().getRowNum() == firstRowIndex) {
								System.out.print(cellValue + "\t");
								indexHeaderMap.put(cell.getColumnIndex(), cellValue);
							} else if (cell.getRow().getRowNum() > firstRowIndex) {

								dataeMap.put(indexHeaderMap.get(cell.getColumnIndex()), cellValue);
							}
						});
						list.add(dataeMap);
					});
				});

				workbook.close();
				return list;
			} catch (EncryptedDocumentException | IOException | InvalidFormatException e) {
				e.printStackTrace();
			}

		}
		return new ArrayList<Map<String, String>>();

	}

	public List<Map<String, String>> parseImportData(TransactionParsingSettingDetailModel model, MultipartFile file) {

		firstRowIndex = model.getHeaderRowNo() != null ? model.getHeaderRowNo() - 1 : 0;

		if (file != null) {

			Map<Integer, TransactionEnum> headerIndexMap = new HashMap<Integer, TransactionEnum>();
			for (TransactionEnum transactionEnum : model.getIndexMap().keySet()) {
				headerIndexMap.put(model.getIndexMap().get(transactionEnum), transactionEnum);
			}
			List<Map<String, String>> list = new ArrayList<Map<String, String>>();

			// Creating a Workbook from an Excel file (.xls or .xlsx)
			try {
				Workbook workbook = WorkbookFactory.create(file.getInputStream());

				// Create a DataFormatter to format and get each cell's value as String
				DataFormatter dataFormatter = new DataFormatter();

				workbook.forEach(sheet -> {
					System.out.println("=> " + sheet.getSheetName());

					sheet.forEach(row -> {
						Map<String, String> dataMap = new LinkedHashMap<String, String>();
						row.forEach(cell -> {
							String cellValue = dataFormatter.formatCellValue(cell);
							if (cell.getRow().getRowNum() > firstRowIndex) {
								if (headerIndexMap.containsKey(cell.getColumnIndex())) {
									dataMap.put(headerIndexMap.get(cell.getColumnIndex()).getDisplayName(), cellValue);
								}
							}
						});
						if (!dataMap.isEmpty()) {
							list.add(dataMap);
						}
					});

				});

				workbook.close();
				return list;
			} catch (EncryptedDocumentException | IOException | InvalidFormatException e) {
				e.printStackTrace();
			}

		}
		return new ArrayList<Map<String, String>>();

	}

	@Override
	public List<com.simplevat.entity.bankaccount.Transaction> getModelListFromFile(
			TransactionParsingSettingDetailModel model, MultipartFile file, Integer bankId) {

		firstRowIndex = model.getHeaderRowNo() != null ? model.getHeaderRowNo() - 1 : 0;

		if (file != null) {

			Map<TransactionEnum, Integer> dataColIndexMap = model.getIndexMap();

			List<Transaction> list = new ArrayList<>();

			// Creating a Workbook from an Excel file (.xls or .xlsx)
			try {
				Workbook workbook = WorkbookFactory.create(file.getInputStream());

				// Create a DataFormatter to format and get each cell's value as String
				DataFormatter dataFormatter = new DataFormatter();

				workbook.forEach(sheet -> {
					Map<String, String> dataeMap = new LinkedHashMap<String, String>();
					sheet.forEach(row -> {
						if (row.getRowNum() > firstRowIndex) {
							com.simplevat.entity.bankaccount.Transaction trnx = new Transaction();
							BankAccount bankAccount = bankAccountService.findByPK(bankId);
							for (TransactionEnum transactionEnum : dataColIndexMap.keySet()) {
								switch (transactionEnum) {
								case CR_AMOUNT:
									// trnx
									break;

								default:
									break;
								}
							}
							list.add(trnx);
						}

					});
				});

				workbook.close();
				return list;
			} catch (EncryptedDocumentException | IOException | InvalidFormatException e) {
				e.printStackTrace();
			}

		}
		return null;

	}

	// proper model

}

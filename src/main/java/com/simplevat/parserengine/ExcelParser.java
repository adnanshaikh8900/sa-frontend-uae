package com.simplevat.parserengine;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.simplevat.criteria.enums.TransactionEnum;
import com.simplevat.dao.DateFormatDao;
import com.simplevat.entity.DateFormat;
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

	@Autowired
	private DateFormatDao dateformatDao;

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
					Map<String, String> dataeMap = new LinkedHashMap<String, String>();
					sheet.forEach(row -> {
						row.forEach(cell -> {
							String cellValue = dataFormatter.formatCellValue(cell);
							if (cell.getRow().getRowNum() == firstRowIndex) {
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

	// consider for singel page in sheet
	public Map parseImportData(TransactionParsingSettingDetailModel model, MultipartFile file) {

		firstRowIndex = model.getHeaderRowNo() != null ? model.getHeaderRowNo() - 1 : 0;

		if (file != null) {
			Map<Integer, Set<Integer>> errorRowCellIndexMap = new HashMap<Integer, Set<Integer>>();
			List<String> errorList = new ArrayList<String>();
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

				Sheet sheet = workbook.getSheetAt(0);

				for (Row row : sheet) {
					Map<String, String> dataMap = new LinkedHashMap<String, String>();

					for (Cell cell : row) {
						String cellValue = dataFormatter.formatCellValue(cell);
						if (cell.getRow().getRowNum() > firstRowIndex) {
							if (headerIndexMap.containsKey(cell.getColumnIndex())) {

								//
								String displayName = headerIndexMap.get(cell.getColumnIndex()).getDisplayName();
								// check for date format
								if (model.getDateFormatId() != null
										&& displayName.equals(TransactionEnum.TRANSACTION_DATE.getDisplayName())) {

									try {
										DateFormat format = dateformatDao.findByPK(model.getDateFormatId());
										SimpleDateFormat formatter = new SimpleDateFormat(format.getFormat());
										formatter.parse(cellValue);
									} catch (ParseException e) {
										errorRowCellIndexMap = addErrorCellInRow(errorRowCellIndexMap,
												cell.getRow().getRowNum(), cell.getColumnIndex());
										errorList.add(cell.getRow().getRowNum() + "," + cell.getColumnIndex());
									}
								}

								// chcek for credit amount
								if (displayName.equals(TransactionEnum.CR_AMOUNT.getDisplayName())) {
									try {
										new BigDecimal(cellValue);
									} catch (Exception e) {
										errorRowCellIndexMap = addErrorCellInRow(errorRowCellIndexMap,
												cell.getRow().getRowNum(), cell.getColumnIndex());
										errorList.add(cell.getRow().getRowNum() + "," + cell.getColumnIndex());
									}
								}

								// chcek for Debit amount
								if (displayName.equals(TransactionEnum.DR_AMOUNT.getDisplayName())) {
									try {
										new BigDecimal(cellValue);
									} catch (Exception e) {
										errorRowCellIndexMap = addErrorCellInRow(errorRowCellIndexMap,
												cell.getRow().getRowNum(), cell.getColumnIndex());
										errorList.add(cell.getRow().getRowNum() + "," + cell.getColumnIndex());
									}
								}

								//
								dataMap.put(headerIndexMap.get(cell.getColumnIndex()).getDisplayName(), cellValue);
							}
						}
					}
					if (!dataMap.isEmpty()) {
						list.add(dataMap);
					}
				}

				workbook.close();

				Map responseMap = new LinkedHashMap<>();
				responseMap.put("data", list);
				responseMap.put("error", errorList);// errorRowCellIndexMap.isEmpty() ? null : errorRowCellIndexMap);

				return responseMap;
			} catch (EncryptedDocumentException | IOException | InvalidFormatException e) {
				e.printStackTrace();
			}

		}
		return new HashMap<>();

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

	public Map<Integer, Set<Integer>> addErrorCellInRow(Map<Integer, Set<Integer>> map, Integer row, Integer cell) {

		Set<Integer> cellSet = new HashSet<Integer>();

		if (map.containsKey(row)) {
			cellSet = map.get(row);
		}

		cellSet.add(cell);
		map.put(row, cellSet);

		return map;
	}

}

package com.simplevat.utils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ExcelUtil {

	public final Integer firstRowIndex = 0;

	public Map<String, List<String>> getDataFromExcel(MultipartFile multipartFile) {

		// File SAMPLE_XLSX_FILE_PATH = new
		// File("C:\\Users\\Daynil\\Downloads\\SampleData\\SampleData.xlsx");

		if (multipartFile != null) {

			File file = null;
			try {
				file = File.createTempFile(multipartFile.getName(), ".xlsx");
				multipartFile.transferTo(file);
			} catch (IOException e1) {
				e1.printStackTrace();
			}

			Map<Integer, String> indexHeaderMap = new HashMap<Integer, String>();
			Map<Integer, List<String>> indexDateMap = new HashMap<Integer, List<String>>();
			Map<String, List<String>> excelDateMap = new LinkedHashMap<String, List<String>>();

			// Creating a Workbook from an Excel file (.xls or .xlsx)
			try {
				Workbook workbook = WorkbookFactory.create(file);

				// Create a DataFormatter to format and get each cell's value as String
				DataFormatter dataFormatter = new DataFormatter();

				workbook.forEach(sheet -> {
					System.out.println("=> " + sheet.getSheetName());

					sheet.forEach(row -> {
						row.forEach(cell -> {
							String cellValue = dataFormatter.formatCellValue(cell);
							if (cell.getRow().getRowNum() == firstRowIndex) {
								System.out.print(cellValue + "\t");
								indexHeaderMap.put(cell.getColumnIndex(), cellValue);
							} else {
								List<String> dataList = new ArrayList<String>();
								if (indexDateMap.containsKey(cell.getColumnIndex())) {
									dataList = indexDateMap.get(cell.getColumnIndex());
									dataList.add(cellValue);
								} else {
									dataList = new ArrayList<String>();
									dataList.add(cellValue);
									indexDateMap.put(cell.getColumnIndex(), dataList);
								}
							}
						});

						System.out.println();
					});
				});

				for (Integer key : indexHeaderMap.keySet()) {
					excelDateMap.put(indexHeaderMap.get(key), indexDateMap.get(key));
				}
				workbook.close();
				file.deleteOnExit();

				return excelDateMap;
			} catch (EncryptedDocumentException | IOException | InvalidFormatException e) {
				e.printStackTrace();
			}

		}
		return new HashMap<String, List<String>>();
	}

	public List<Map<String, String>> getDataFromExcel1(MultipartFile multipartFile) {

		// File SAMPLE_XLSX_FILE_PATH = new
		// File("C:\\Users\\Daynil\\Downloads\\SampleData\\SampleData.xlsx");

		if (multipartFile != null) {
//
//			File file = null;
//			try {
//				file = File.createTempFile(multipartFile.getName(), ".xlsx");
//				multipartFile.transferTo(file);
//			} catch (IOException e1) {
//				e1.printStackTrace();
//			}

			Map<Integer, String> indexHeaderMap = new HashMap<Integer, String>();

			List<Map<String, String>> list = new ArrayList<Map<String, String>>();

			// Creating a Workbook from an Excel file (.xls or .xlsx)
			try {
				Workbook workbook = WorkbookFactory.create(multipartFile.getInputStream());

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
							} else {

								dataeMap.put(indexHeaderMap.get(cell.getColumnIndex()), cellValue);
							}
						});
						list.add(dataeMap);
					});
				});

				workbook.close();
//				file.deleteOnExit();

				return list;
			} catch (EncryptedDocumentException | IOException | InvalidFormatException e) {
				e.printStackTrace();
			}

		}
		return new ArrayList<Map<String, String>>();
	}
}

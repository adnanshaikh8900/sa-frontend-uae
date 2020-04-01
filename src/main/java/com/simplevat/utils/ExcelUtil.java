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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ExcelUtil {

	private static final Logger LOGGER = LoggerFactory.getLogger(ExcelUtil.class);

	public final Integer firstRowIndex = 0;

	public Map<String, List<String>> getDataFromExcel(MultipartFile multipartFile) {

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

				if (file != null)
					file.deleteOnExit();

				return excelDateMap;
			} catch (EncryptedDocumentException | IOException | InvalidFormatException e) {
				LOGGER.error("Error = ", e);
			}

		}
		return new HashMap<String, List<String>>();
	}
}

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
import org.springframework.stereotype.Component;

import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingPersistModel;

@Component
public class ExcelParser implements TransactionFileParser {

	public Integer firstRowIndex = 0;

	@Override
	public List<Map<String, String>> parseSmaple(TransactionParsingSettingPersistModel model) {

		firstRowIndex = model.getHeaderRowNo() - 1;

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

	// proper model

}

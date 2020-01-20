package com.simplevat.parserengine;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.simplevat.criteria.enums.TransactionEnum;
import com.simplevat.dao.DateFormatDao;
import com.simplevat.entity.DateFormat;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingDetailModel;
import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingPersistModel;

import io.swagger.models.auth.In;

@Component
public class CsvParser implements TransactionFileParser {

	@Autowired
	private DateFormatDao dateformatDao;

	@Override
	public List<Map<String, String>> parseSmaple(TransactionParsingSettingPersistModel model) {
		String line = "";
		String cvsSplitBy = ",";
		Map<Integer, String> indexHeaderMap = new HashMap<Integer, String>();
		List<Map<String, String>> list = new ArrayList<Map<String, String>>();
		BufferedReader br = null;

		try {

			br = new BufferedReader(new InputStreamReader(model.getFile().getInputStream(), "UTF-8"));
			int rowCount = 0;
			while ((line = br.readLine()) != null) {

				String[] splitList = line.split(cvsSplitBy);
				Map<String, String> dataMap = new LinkedHashMap<String, String>();
				if (rowCount == 0) {
					int j = 0;
					for (String data : splitList) {
						indexHeaderMap.put(j, data);
						j++;
					}
				} else {
					int cellCount = 0;
					for (String data : splitList) {
						dataMap.put(indexHeaderMap.get(cellCount), data);
						cellCount++;
					}
					int maxItr = indexHeaderMap.size() - splitList.length;
					if (indexHeaderMap.size() != splitList.length) {
						for (int loop = 1; loop <= maxItr; loop++) {
							dataMap.put(indexHeaderMap.get(cellCount), "-");
						}
					}
					list.add(dataMap);
				}
				rowCount++;

			}
			return list;
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return null;
	}

	@Override
	public List<Transaction> getModelListFromFile(TransactionParsingSettingDetailModel model, MultipartFile file,
			Integer bankId) {
		// TODO Auto-generated method stub
		return null;
	}

	public Map parseImportData(TransactionParsingSettingDetailModel model, MultipartFile file) {
		String line = "";
		String cvsSplitBy = ",";

		List<Map<String, String>> list = new LinkedList<Map<String, String>>();
		Map<Integer, Set<Integer>> errorRowCellIndexMap = new HashMap<Integer, Set<Integer>>();

		BufferedReader br = null;

		try {

			Map<Integer, TransactionEnum> headerIndexMap = new LinkedHashMap<Integer, TransactionEnum>();

			for (TransactionEnum transactionEnum : model.getIndexMap().keySet()) {
				headerIndexMap.put(model.getIndexMap().get(transactionEnum), transactionEnum);
			}

			br = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
			int rowCount = 0;
			while ((line = br.readLine()) != null) {

				String[] splitList = line.split(cvsSplitBy);

				Map<String, String> dataMap = new LinkedHashMap<String, String>();

				if (rowCount > 0) {
					int cellCount = 0;
					for (String data : splitList) {
						if (headerIndexMap.containsKey(cellCount)) {
							String displayName = headerIndexMap.get(cellCount).getDisplayName();
							dataMap.put(displayName, data);

							// check for date format
							if (model.getDateFormatId() != null
									&& displayName.equals(TransactionEnum.TRANSACTION_DATE.getDisplayName())
									|| displayName.equals(TransactionEnum.DATE.getDisplayName())) {

								try {
									DateFormat format = dateformatDao.findByPK(model.getDateFormatId());
									SimpleDateFormat formatter = new SimpleDateFormat(format.getFormat());
									formatter.parse(data);
								} catch (ParseException e) {
									errorRowCellIndexMap = addErrorCellInRow(errorRowCellIndexMap, rowCount, cellCount);
								}
							}

							// chcek for credit amount
							if (displayName.equals(TransactionEnum.CR_AMOUNT.getDisplayName())) {
								try {
									new BigDecimal(data);
								} catch (Exception e) {
									errorRowCellIndexMap = addErrorCellInRow(errorRowCellIndexMap, rowCount, cellCount);
								}
							}

							// chcek for Debit amount
							if (displayName.equals(TransactionEnum.DR_AMOUNT.getDisplayName())) {
								try {
									new BigDecimal(data);
								} catch (Exception e) {
									errorRowCellIndexMap = addErrorCellInRow(errorRowCellIndexMap, rowCount, cellCount);
								}
							}
						}
						cellCount++;
					}
					if (headerIndexMap.size() != splitList.length) {
						for (TransactionEnum transactionEnum : model.getIndexMap().keySet()) {
							if (!dataMap.containsKey(transactionEnum.getDisplayName())) {
								dataMap.put(transactionEnum.getDisplayName(), "-");
								errorRowCellIndexMap = addErrorCellInRow(errorRowCellIndexMap, rowCount,
										model.getIndexMap().get(transactionEnum));
							}
						}
					}

					list.add(dataMap);
				}
				rowCount++;

			}

			Map responseMap = new LinkedHashMap<>();
			responseMap.put("data", list);
			responseMap.put("error", errorRowCellIndexMap.isEmpty() ? null : errorRowCellIndexMap);

			return responseMap;
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
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

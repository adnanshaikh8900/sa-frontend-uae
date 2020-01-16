package com.simplevat.parserengine;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingPersistModel;

@Component
public class CsvParser implements TransactionFileParser {

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

}

package com.simplevat.parserengine;

import java.util.List;
import java.util.Map;

import com.simplevat.rest.transactionparsingcontroller.TransactionParsingSettingPersistModel;

public interface TransactionFileParser {

List<Map<String,String>> parseSmaple(TransactionParsingSettingPersistModel model);

	// model parserFile(instream) 

}

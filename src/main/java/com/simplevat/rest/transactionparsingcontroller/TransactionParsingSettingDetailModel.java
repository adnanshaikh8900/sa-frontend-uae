package com.simplevat.rest.transactionparsingcontroller;

import java.util.Map;

import com.simplevat.criteria.enums.TransactionEnum;
import com.simplevat.enums.ExcellDelimiterEnum;

import lombok.Data;

@Data
public class TransactionParsingSettingDetailModel {

	public Long id;
	private String name;
	private ExcellDelimiterEnum delimiter;
	private Integer skipRows;
	private Integer headerRowNo;
	private Integer textQualifier;
	private Integer dateFormatId;
	private Map<TransactionEnum, Integer> IndexMap;
	public String otherDilimiterStr;
}

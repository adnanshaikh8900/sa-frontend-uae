package com.simplevat.rest.transactionparsingcontroller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.simplevat.criteria.enums.TransactionEnum;

import lombok.Data;

@Data
public class TransactionParsingSettingPersistModel {

	public Long id;
	private String name;
	private String delimiter;
	private Integer skipRows;
	private Integer headerRowNo;
	private String textQualifier;
	private Integer dateFormatId;
	private Map<TransactionEnum, Integer> indexMap;
	private String otherDilimiterStr;
	private MultipartFile file;	
}

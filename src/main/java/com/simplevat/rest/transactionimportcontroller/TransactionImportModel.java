package com.simplevat.rest.transactionimportcontroller;

import java.util.List;
import java.util.Map;

import com.simplevat.criteria.enums.TransactionEnum;

import lombok.Data;

@Data
public class TransactionImportModel {

	private List<Map<TransactionEnum, Object>> importDataMap;
	private Integer templateId;
	private Integer bankId;
}

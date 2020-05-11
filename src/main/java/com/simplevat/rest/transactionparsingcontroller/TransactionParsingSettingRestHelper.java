package com.simplevat.rest.transactionparsingcontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.ExcellDelimiterEnum;
import com.simplevat.criteria.enums.TransactionEnum;
import com.simplevat.entity.TransactionDataColMapping;
import com.simplevat.entity.TransactionParsingSetting;
import com.simplevat.rest.EnumDropdownModel;
import com.simplevat.service.DateFormatService;
import com.simplevat.service.TransactionParsingSettingService;

@Component
public class TransactionParsingSettingRestHelper {

	@Autowired
	private TransactionParsingSettingService transactionParsingSettingService;

	@Autowired
	private DateFormatService dateFormatService;

	public TransactionParsingSetting getEntity(TransactionParsingSettingPersistModel model) {
		if (model != null) {
			TransactionParsingSetting entity = new TransactionParsingSetting();

			if (model.getId() != null) {
				entity = transactionParsingSettingService.findByPK(model.getId());
			}

			if (model.getDateFormatId() != null) {
				entity.setDateFormat(dateFormatService.findByPK(model.getDateFormatId()));
			}

			entity.setHeaderRowNo(model.getHeaderRowNo());
			entity.setName(model.getName());
			entity.setSkipRows(model.getSkipRows());
			entity.setTextQualifier(model.getTextQualifier());
			entity.setDelimiter(ExcellDelimiterEnum.valueOf(model.getDelimiter()));
			entity.setOtherDilimiterStr(model.getOtherDilimiterStr());
			if (model.getIndexMap() != null) {
				List<TransactionDataColMapping> mappinglist = new ArrayList<>();
				Map<TransactionEnum, Integer> map = model.getIndexMap();

				for (TransactionEnum dbColEnum : model.getIndexMap().keySet()) {
					TransactionDataColMapping mapping = new TransactionDataColMapping();
					mapping.setColName(dbColEnum.getDbColumnName());
					mapping.setFileColIndex(map.get(dbColEnum));
					mappinglist.add(mapping);
				}
				entity.setTransactionDtaColMapping(mappinglist);
			}

			return entity;
		}
		return null;
	}

	public List<TransactionParsingSettingListModel> getModelList(
			List<TransactionParsingSetting> transactionParsingSettingList) {

		List<TransactionParsingSettingListModel> transactionParsingSettingModelList = new ArrayList<>();

		for (TransactionParsingSetting setting : transactionParsingSettingList) {
			TransactionParsingSettingListModel model = new TransactionParsingSettingListModel();
			model.setId(setting.getId());
			model.setName(setting.getName());
			if (setting.getDateFormat() != null) {
				model.setDateFormatId(setting.getDateFormat().getId());
			}
			model.setHeaderRowNo(setting.getHeaderRowNo());
			model.setName(setting.getName());
			model.setTextQualifier(model.getSkipRows());
			model.setSkipRows(setting.getSkipRows());
			model.setDelimiter(setting.getDelimiter());
			model.setOtherDilimiterStr(setting.getOtherDilimiterStr());
			if (setting.getTransactionDtaColMapping() != null) {
				Map<TransactionEnum, Integer> map = new HashMap<>();

				for (TransactionDataColMapping mapping : setting.getTransactionDtaColMapping()) {
					map.put(TransactionEnum.valueOf(mapping.getColName()), mapping.getFileColIndex());
				}

				model.setIndexMap(map);
			}
			transactionParsingSettingModelList.add(model);
		}

		return transactionParsingSettingModelList;
	}

	public TransactionParsingSettingDetailModel getModel(TransactionParsingSetting setting) {

		TransactionParsingSettingDetailModel model = new TransactionParsingSettingDetailModel();

		model.setId(setting.getId());
		if (setting.getDateFormat() != null) {
			model.setDateFormatId(setting.getDateFormat().getId());
		}
		model.setHeaderRowNo(setting.getHeaderRowNo());
		model.setName(setting.getName());
		model.setTextQualifier(model.getSkipRows());
		model.setSkipRows(setting.getSkipRows());
		model.setDelimiter(setting.getDelimiter());
		model.setOtherDilimiterStr(setting.getOtherDilimiterStr());
		if (setting.getTransactionDtaColMapping() != null) {
			Map<TransactionEnum, Integer> map = new HashMap<>();

			for (TransactionDataColMapping mapping : setting.getTransactionDtaColMapping()) {
				map.put(TransactionEnum.valueOf(mapping.getColName()), mapping.getFileColIndex());
			}

			model.setIndexMap(map);
		}
		return model;
	}

	public List<EnumDropdownModel> getSelectModelList(List<TransactionParsingSetting> transactionParsingSettingList) {

		List<EnumDropdownModel> modelList = new ArrayList<>();

		for (TransactionParsingSetting setting : transactionParsingSettingList) {
			modelList.add(new EnumDropdownModel(setting.getId().toString(), setting.getName()));
		}

		return modelList;
	}
}

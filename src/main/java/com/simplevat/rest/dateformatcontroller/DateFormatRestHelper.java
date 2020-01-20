package com.simplevat.rest.dateformatcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.entity.DateFormat;
import com.simplevat.service.DateFormatService;

@Component
public class DateFormatRestHelper {

	@Autowired
	private DateFormatService dateFormatService;
	
	public List<DateFormatListModel> getModelList(List<DateFormat> dateFormatList) {

		List<DateFormatListModel> modelList = new ArrayList<DateFormatListModel>();

		if (dateFormatList != null && dateFormatList.size() > 0) {

			for (DateFormat dateFormat : dateFormatList) {
				DateFormatListModel DateFormatModel = new DateFormatListModel();

				DateFormatModel.setId(dateFormat.getId());
				DateFormatModel.setFormat(dateFormat.getFormat());

				modelList.add(DateFormatModel);
			}
		}

		return modelList;
	}

	public DateFormatResponseModel getModel(DateFormat dateFormat) {
		DateFormatResponseModel DateFormatModel = new DateFormatResponseModel();
		DateFormatModel.setId(dateFormat.getId());
		DateFormatModel.setFormat(dateFormat.getFormat());
		return DateFormatModel;
	}

	public DateFormat getEntity(DateFormatRequestModel requestModel) {
		
		DateFormat dateFormat = new DateFormat();
		if(dateFormat.getId() != null) {
			dateFormat = dateFormatService.findByPK(requestModel.getId()); 
		}
		dateFormat.setFormat(requestModel.getFormat());
		
		return dateFormat;
	}
}

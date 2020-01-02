package com.simplevat.rest.vatcontroller;

import lombok.Data;

@Data
public class VatCategoryRequestFilterModel {

	private String name;
	private String vatPercentage;

}

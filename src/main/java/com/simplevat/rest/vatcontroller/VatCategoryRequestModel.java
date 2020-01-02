package com.simplevat.rest.vatcontroller;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class VatCategoryRequestModel {

	private Integer id;
	private String name;
	private BigDecimal vat;
	private Character defaultFlag;
	private Integer orderSequence;
	private Integer createdBy;
	private Date createdDate;
	private Integer lastUpdateBy;
	private Date lastUpdateDate;
	private Boolean deleteFlag = Boolean.FALSE;
	private Integer versionNumber;
}

package com.simplevat.rest.productcategorycontroller;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductCategoryListModel {

	private Integer id;
	private String productCategoryName;
	private String productCategoryDescription;
	private String productCategoryCode;
	private Integer createdBy;
	private LocalDateTime createdDate;
	private Integer lastUpdateBy;
	private LocalDateTime lastUpdateDate;
	private Boolean deleteFlag = Boolean.FALSE;
	private Integer versionNumber;

}

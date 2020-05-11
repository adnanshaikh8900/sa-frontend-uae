package com.simplevat.rest.productcontroller;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.simplevat.constant.ProductPriceType;
import com.simplevat.constant.ProductType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequestModel {

	private Integer productID;
	private Integer productCategoryId;
	private String productName;
	private Integer vatCategoryId;
	private Integer productWarehouseId;
	private String productCode;
	private Integer createdBy;
	private LocalDateTime createdDate;
	private Integer lastUpdatedBy;
	private LocalDateTime lastUpdateDate;
	private Boolean deleteFlag = Boolean.FALSE;
	private Boolean active;
	private Integer versionNumber;
	private Boolean vatIncluded = Boolean.FALSE;

	// new Added
	private ProductPriceType productPriceType;
	private ProductType productType;

	private BigDecimal salesUnitPrice;
	private String salesDescription;
	private Integer salesTransactionCategoryId;

	private BigDecimal purchaseUnitPrice;
	private String purchaseDescription;
	private Integer purchaseTransactionCategoryId;

}

package com.simplevat.rest.productcontroller;

import com.simplevat.entity.Product;
import com.simplevat.entity.VatCategory;
import com.simplevat.entity.ProductWarehouse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequestModel {

    private Integer productID;
    private String productName;
    private String productDescription;
    private Integer vatCategoryId;
    private String productCode;
    private Integer createdBy;
    private LocalDateTime createdDate;
    private Integer lastUpdatedBy;
    private LocalDateTime lastUpdateDate;
    private Boolean deleteFlag = Boolean.FALSE;
    private Boolean active;
    private Integer versionNumber;
    private Integer parentProductId;
    private Integer productWarehouseId;
    private Boolean vatIncluded = Boolean.FALSE;
    private BigDecimal unitPrice;

}

package com.simplevat.rest.productcontroller;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductListModel {

    private Integer id;
    private String name;
    private String description;
    private String productCode;
    private String vatPercentage;
    private BigDecimal unitPrice;

}

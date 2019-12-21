package com.simplevat.rest.productcontroller;

import com.simplevat.rest.RequestFilterModel;
import lombok.Data;

@Data
public class ProductRequestFilterModel extends RequestFilterModel{
    private String name;
    private String productCode;
    private String vatPercentage;

}

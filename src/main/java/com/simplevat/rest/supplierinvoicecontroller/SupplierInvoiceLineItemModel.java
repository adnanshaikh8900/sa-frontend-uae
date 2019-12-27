package com.simplevat.rest.supplierinvoicecontroller;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierInvoiceLineItemModel {

    private Integer id;
    private Integer quantity;
    private String description;
    private BigDecimal unitPrice;
    private String vatCategoryId;
    private BigDecimal subTotal;
}

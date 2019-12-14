/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.contact.model;

import com.simplevat.entity.Product;
import com.simplevat.entity.VatCategory;
import java.math.BigDecimal;
import lombok.Data;

/**
 *
 * @author daynil
 */
@Data
public class ExpenseItemModel {

    private int id;
    private int quatity;
    private BigDecimal unitPrice;
    private Integer vatCategoryId;
    private String description;
    private BigDecimal subTotal;
    private Integer versionNumber;
    private Integer productId;
    private Boolean isProductSelected = Boolean.TRUE;
    private String productName;
    
}

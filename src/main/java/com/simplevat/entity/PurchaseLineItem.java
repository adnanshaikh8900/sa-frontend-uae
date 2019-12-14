package com.simplevat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@Entity
@Table(name = "PURCHASE_LINE_ITEM")
@Data
public class PurchaseLineItem implements Serializable {

    private static final long serialVersionUID = 848122185643690684L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PURCHASE_LINE_ITEM_ID")
    private int purchaseLineItemId;
    @Basic
    @Column(name = "PURCHASE_LINE_ITEM_QUANTITY")
    private Integer purchaseLineItemQuantity;
    @Basic
    @Column(name = "PURCHASE_LINE_ITEM_DESCRIPTION")
    private String purchaseLineItemDescription;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PURCHASE_LINE_ITEM_PRODUCT_ID")
    private Product purchaseLineItemProductService;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PURCHASE_LINE_ITEM_VAT_ID")
    private VatCategory purchaseLineItemVat;
    @Basic
    @Column(name = "PURCHASE_LINE_ITEM_UNIT_PRICE")
    private BigDecimal purchaseLineItemUnitPrice;
    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean deleteFlag = Boolean.FALSE;
    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "PURCHASE_ID")
    private Purchase purchase;
    @Column(name = "PURCHASE_PRODUCT_NAME")
    private String productName;
}

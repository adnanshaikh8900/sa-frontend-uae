package com.simplevat.entity;

import com.simplevat.constant.ProductPriceType;
import com.simplevat.constant.ProductType;
import com.simplevat.entity.converter.DateConverter;

import liquibase.pro.packaged.it;

import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
		@NamedQuery(name = "allProduct", query = "SELECT p FROM Product p where p.createdBy = :createdBy and p.deleteFlag = FALSE ") })
@Entity
@Table(name = "PRODUCT")
@Data
@TableGenerator(name = "INCREMENT_INITIAL_VALUE", initialValue = 1000)
public class Product implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "INCREMENT_INITIAL_VALUE")
	@Column(name = "PRODUCT_ID")
	private Integer productID;

	@Basic
	@Column(name = "PRODUCT_NAME")
	private String productName;

	@Basic
	@Column(name = "PRODUCT_DESCRIPTION")
	private String productDescription;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRODUCT_VAT")
	private VatCategory vatCategory;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRODUCT_CATEGORY")
	private ProductCategory productCategory;

	@Basic
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRODUCT_WAREHOUSE")
	private ProductWarehouse productWarehouse;

	@Basic
	@Column(name = "PRODUCT_CODE")
	private String productCode;

	@Basic
	@Column(name = "UNIT_PRICE")
	private BigDecimal unitPrice;

	@Column(name = "VAT_INCLUDED")
	@ColumnDefault(value = "0")
	private Boolean vatIncluded = Boolean.FALSE;

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "product")
	private List<ProductLineItem> lineItemList;

	@Enumerated(EnumType.STRING)
	@Column(name = "PRODUCT_TYPE")
	private ProductType productType;

	// determine product price type
	@Enumerated(EnumType.STRING)
	@Column(name = "PRICE_TYPE")
	private ProductPriceType priceType;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")

	@Basic(optional = false)
	@Convert(converter = DateConverter.class)
	private LocalDateTime createdDate;

	@Basic
	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdatedBy;
	@Basic

	@Column(name = "LAST_UPDATE_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime lastUpdateDate;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	private Boolean deleteFlag = Boolean.FALSE;

	@Column(name = "VERSION_NUMBER")
	@ColumnDefault(value = "1")
	@Version
	private Integer versionNumber = 1;

	public String getDescription() {
		String desc = "";
		for (ProductLineItem item : lineItemList)
			if (item.getPriceType().equals(ProductPriceType.SALES))
				desc = item.getDescription();
		return desc;

	}

	public BigDecimal getUnitPrice() {
		for (ProductLineItem item : lineItemList)
			if (item.getPriceType().equals(ProductPriceType.SALES))
				return item.getUnitPrice();
		return null;
	}
}

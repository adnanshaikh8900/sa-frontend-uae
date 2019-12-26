package com.simplevat.entity;

import java.time.LocalDateTime;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Version;

import org.hibernate.annotations.ColumnDefault;

import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

@Entity
@Table(name = "PRODUCT_CATEGORY")
@Data
public class ProductCategory {



    private static final long serialVersionUID = 848122185643690684L;

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Basic(optional = false)
    @Column(name = "PRODUCT_CATEGORY_NAME")
    private String productCategoryName;

    @Basic
    @Column(name = "PRODUCT_CATEGORY_DESCRIPTION")
    private String productCategoryDescription;

    @Basic
    @Column(name = "PRODUCT_CATEGORY_CODE")
    private String productCategoryCode;

	/*
	 * @ManyToOne(fetch = FetchType.LAZY)
	 * 
	 * @JoinColumn(name = "TRANSACTION_TYPE_CODE") private TransactionType
	 * transactionType;
	 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_TRANSACTION_CATEGORY_CODE")
    private TransactionCategory parentTransactionCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VAT_CATEGORY_CODE")
    private VatCategory vatCategory;
  
    @Column(name = "DEFAULT_FLAG")
    @ColumnDefault(value = "'N'")
    @Basic(optional = false)
    private Character defaltFlag;
	
    
	 * @Column(name = "ORDER_SEQUENCE")
	 * 
	 * @Basic(optional = true) private Integer orderSequence;
	 */
    
    @Column(name = "CREATED_BY")
    @Basic(optional = false)
    private Integer createdBy;

    @Column(name = "CREATED_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
    @Basic(optional = false)
    @Convert(converter = DateConverter.class)
    private LocalDateTime createdDate;

    @Column(name = "LAST_UPDATED_BY")
    private Integer lastUpdateBy;

    @Column(name = "LAST_UPDATE_DATE")
    @Convert(converter = DateConverter.class)
    private LocalDateTime lastUpdateDate;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean deleteFlag = Boolean.FALSE;

    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;


}

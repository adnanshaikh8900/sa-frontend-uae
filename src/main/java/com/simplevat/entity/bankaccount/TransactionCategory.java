package com.simplevat.entity.bankaccount;

import com.simplevat.entity.VatCategory;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;

import lombok.Data;
import javax.persistence.*;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
    @NamedQuery(name = "findAllTransactionCategory",
            query = "SELECT t FROM TransactionCategory t where t.deleteFlag=false ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC")
    ,
    @NamedQuery(name = "findAllTransactionCategoryByTransactionType",
            query = "SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.transactionType.transactionTypeCode =:transactionTypeCode ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC")
    ,
     @NamedQuery(name = "findAllTransactionCategoryByUserId",
            query = "SELECT t FROM TransactionCategory t where t.deleteFlag=false and (t.createdBy = :createdBy or t.createdBy = 1) ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC")
})
@Entity
@Table(name = "TRANSACTION_CATEGORY")
@Data
public class TransactionCategory implements Serializable {

    private static final long serialVersionUID = 848122185643690684L;

    @Id
    @Column(name = "TRANSACTION_CATEGORY_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionCategoryId;

    @Basic(optional = false)
    @Column(name = "TRANSACTION_CATEGORY_NAME")
    private String transactionCategoryName;

    @Basic
    @Column(name = "TRANSACTION_CATEGORY_DESCRIPTION")
    private String transactionCategoryDescription;

    @Basic
    @Column(name = "TRANSACTION_CATEGORY_CODE")
    private String transactionCategoryCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRANSACTION_TYPE_CODE")
    private TransactionType transactionType;

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

    @Column(name = "ORDER_SEQUENCE")
    @Basic(optional = true)
    private Integer orderSequence;

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

package com.simplevat.entity.bankaccount;

import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.Basic;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.FetchType;
import javax.persistence.Convert;
import javax.persistence.PreUpdate;
import javax.persistence.PrePersist;
import javax.persistence.Version;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@Entity
@Table(name = "IMPORTED_DRAFT_TRANSACTON")
@Data
public class ImportedDraftTransaction implements Serializable {

    private static final long serialVersionUID = 848122185643690684L;
    @Id
    @Column(name = "IMPORTED_TRANSACTION_ID")
    private int importedTransactionId;
    @Basic
    @Column(name = "IMPORTED_TRANSACTION_DATE")
    @Convert(converter = DateConverter.class)
    private LocalDateTime importedTransactionDate;
    @Basic
    @Column(name = "IMPORTED_TRANSACTION_DESCRIPTION")
    private String importedTransactionDescription;
    
    @Basic
    @ColumnDefault(value = "0.00")
    @Column(name = "IMPORTED_TRANSACTION_AMOUNT")
    private BigDecimal importedTransactionAmount;
    
    @Basic(optional = false)
    @Column(name = "IMPORTED_DEBIT_CREDIT_FLAG")
    private Character importedDebitCreditFlag;
    
    @Basic
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BANK_ACCOUNT_ID")
    private BankAccount bankAccount;
    
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

    @PrePersist
    public void updateDates() {
        createdDate = LocalDateTime.now();
        lastUpdateDate = LocalDateTime.now();
    }

    @PreUpdate
    public void updateLastUpdatedDate() {
        lastUpdateDate = LocalDateTime.now();
    }

}

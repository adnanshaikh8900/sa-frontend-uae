package com.simplevat.entity.bankaccount;

import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
    @NamedQuery(name = "findAllTransactionType",
            query = "SELECT t FROM TransactionType t where t.deleteFlag=false ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionTypeName ASC")
    ,
    @NamedQuery(name = "findAllChildTransactionType",
            query = "SELECT t FROM TransactionType t where t.deleteFlag=false and t.parentTransactionType != null ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionTypeName ASC")
    ,
    @NamedQuery(name = "findMoneyInTransactionType",
            query = "SELECT t FROM TransactionType t where t.deleteFlag=false AND t.parentTransactionType.transactionTypeCode = 1 ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionTypeName ASC")
    ,
    @NamedQuery(name = "findMoneyOutTransactionType",
            query = "SELECT t FROM TransactionType t where t.deleteFlag=false AND t.parentTransactionType.transactionTypeCode = 7 ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionTypeName ASC")
})
@Entity
@Table(name = "TRANSACTION_TYPE")
@Data
@NoArgsConstructor
public class TransactionType implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "TRANSACTION_TYPE_CODE")
    private Integer transactionTypeCode;

    @Column(name = "TRANSACTION_TYPE_NAME")
    @Basic(optional = false)
    private String transactionTypeName;

    @Column(name = "TRANSACTION_TYPE_DESCRIPTION")
    private String transactionTypeDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_TRANSACTION_TYPE_CODE")
    private TransactionType parentTransactionType;

    @Column(name = "DEBIT_CREDIT_FLAG")
    @Basic(optional = false)
    private Character debitCreditFlag;

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
    private Integer lateUpdatedBy;

    @Column(name = "LAST_UPDATE_DATE")
    @Convert(converter = DateConverter.class)
    private LocalDateTime LastUpdatedDate;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private boolean deleteFlag;

    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;
 
	public TransactionType(Integer transactionTypeCode) {
		this.transactionTypeCode = transactionTypeCode;
	}
}

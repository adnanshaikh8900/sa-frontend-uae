package com.simplevat.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.*;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.simplevat.entity.bankaccount.TransactionCategory;

import lombok.Data;

@Entity
@Table(name = "TRANSACTION_CATEGORY_CLOSING_BALANCE")
@Data
@NamedQueries({
        @NamedQuery(name = "getListByFrmToDate", query = " select tcb from TransactionCategoryClosingBalance tcb where tcb.closingBalanceDate BETWEEN :startDate and :endDate and tcb.transactionCategory =:transactionCategory order by tcb.closingBalanceDate ASC"),
        @NamedQuery(name = "getListByFrmDate", query = " select tcb from TransactionCategoryClosingBalance tcb where tcb.closingBalanceDate > :endDate and tcb.transactionCategory =:transactionCategory"),
        @NamedQuery(name = "getListByForDate", query = " select tcb from TransactionCategoryClosingBalance tcb where tcb.closingBalanceDate <= :endDate and tcb.transactionCategory =:transactionCategory order by tcb.closingBalanceDate DESC"),
        @NamedQuery(name = "getLastClosingBalanceByDate", query = " select tcb from TransactionCategoryClosingBalance tcb where tcb.transactionCategory =:transactionCategory order by tcb.closingBalanceDate DESC")})
public class TransactionCategoryClosingBalance {
    @Id
    @Column(name = "TRANSACTION_CATEGORY_CLOSING_BALANCE_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "TRANSACTION_CATEGORY_ID")
    @Basic(optional = false)
    private TransactionCategory transactionCategory;

    @Basic
    @Column(name = "TRANSACTION_CATEGORY_CLOSING_BALANCE_DATE")
    private LocalDateTime closingBalanceDate;

    @Column(name = "OPENING_BALANCE")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private BigDecimal openingBalance;


    @Column(name = "CLOSING_BALANCE")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private BigDecimal closingBalance;

    @Column(name = "EFFECTIVE_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
    @Basic(optional = false)
    private Date effectiveDate;

    @Column(name = "CREATED_BY")
    @Basic(optional = false)
    private Integer createdBy;

    @Column(name = "CREATED_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
    @Basic(optional = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdDate;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private boolean deleteFlag;

}

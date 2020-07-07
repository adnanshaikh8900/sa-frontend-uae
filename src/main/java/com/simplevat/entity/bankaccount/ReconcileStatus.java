package com.simplevat.entity.bankaccount;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "RECONCILESTATUS")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Data
public class ReconcileStatus implements Serializable  {

    @Id
    @Column(name = "RECONCILE_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "INCREMENT_INITIAL_VALUE")
    private Integer reconcileId;

    @Basic
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BANK_ACCOUNT_ID")
    private BankAccount bankAccount;

    @Basic
    @Column(name = "RECONCILED_START_DATE")
    private LocalDateTime reconciledStartDate;

    @Basic
    @Column(name = "RECONCILED_DATE")
    private LocalDateTime reconciledDate;

    @Basic
    @Column(name = "RECONCILED_DURATION")
    private String reconciledDuration;

    @Basic
    @Column(name = "CLOSING_BALANCE")
    @ColumnDefault(value = "0.00")
    private BigDecimal closingBalance;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean deleteFlag = Boolean.FALSE;

}

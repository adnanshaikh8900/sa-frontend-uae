package com.simplevat.entity;

import java.io.Serializable;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Id;
import javax.persistence.GenerationType;
import javax.persistence.GeneratedValue;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.TemporalType;
import javax.persistence.Temporal;
import javax.persistence.JoinColumn;

import java.util.Date;
import org.springframework.lang.Nullable;

import com.simplevat.entity.bankaccount.TransactionCategory;


/**
 * Created by Uday
 */
@Data
@Entity
@Table(name = "LEADGER_ENTRY")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//@TableGenerator(name = "INCREMENT_INITIAL_VALUE", initialValue = 1)
public class LeadgerEntry implements Serializable {

    private static final long serialVersionUID = 848122185643690684L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Long id;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "type")
    private String type;

    @Nullable
    @ManyToOne
    @JoinColumn(name = "TRANSACTION_CATEGORY")
    private TransactionCategory transactionCategory;

    @Column(name = "note")
    private String note;

    @Column(name = "balance")
    private Double balance;

    @Column(name = "created_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdTime;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedTime;

    @Column(name = "updated_by")
    private Long updatedBy;

}

package com.simplevat.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.simplevat.entity.bankaccount.TransactionCategory;
import java.io.Serializable;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@Entity
@Table(name = "EXPENSE_LINE_ITEM")
@Data
public class ExpenseLineItem implements Serializable {

    private static final long serialVersionUID = 848122185643690684L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EXPENSE_LINE_ITEM_ID")
    private int expenseLineItemId;

    @Basic
    @Column(name = "EXPENSE_LINE_ITEM_QUANTITY")
    private Integer expenseLineItemQuantity;

    @Basic
    @Column(name = "EXPENSE_LINE_ITEM_UNIT_PRICE")
    private BigDecimal expenseLineItemUnitPrice;
    
    @Basic
    @Column(name = "EXPENSE_LINE_ITEM_TOTAL_PRICE")
    private BigDecimal expenseLineItemTotalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EXPENSE_LINE_ITEM_VAT_ID")
    private VatCategory expenseLineItemVat;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean deleteFlag = Boolean.FALSE;

    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;

    @ManyToOne
    @JoinColumn(name = "EXPENSE_ID")
    private Expense expense;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRANSACTION_CATEGORY_CODE")
    @JsonManagedReference
    private TransactionCategory transactionCategory;

}

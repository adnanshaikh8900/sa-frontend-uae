package com.simplevat.entity;

import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;

import lombok.Data;

import javax.persistence.*;
import javax.annotation.Nonnull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
    @NamedQuery(name = "allExpenses",
            query = "SELECT e "
            + "FROM Expense e where e.deleteFlag = FALSE")
})

@Entity
@Table(name = "EXPENSE")
@Data
public class Expense implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "EXPENSE_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer expenseId;

    @Basic
    @Column(name = "EXPENSE_AMOUNT")
    @ColumnDefault(value = "0.00")
    private BigDecimal expenseAmount;

    @Basic
    @Column(name = "EXPENSE_DATE")
    @Convert(converter = DateConverter.class)
    private LocalDateTime expenseDate;

    @Basic
    @Column(name = "EXPENSE_DESCRIPTION")
    private String expenseDescription;

    @Basic
    @Column(name = "RECEIPT_NUMBER", length = 20)
    private String receiptNumber;

    @Basic
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CLAIMANT_ID")
    private User user;

    @Basic
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRANSACTION_TYPE_CODE")
    private TransactionType transactionType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRANSACTION_CATEGORY_CODE")
    private TransactionCategory transactionCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENCY_CODE")
    private Currency currency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROJECT_ID")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CONTACT_ID")
    private Contact expenseContact;

    @Basic
    @Column(name = "RECEIPT_ATTACHMENT_PATH")
    private String receiptAttachmentPath;

    @Basic
    @Column(name = "RECEIPT_ATTACHMENT_DESCRIPTION")
    private String receiptAttachmentDescription;

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

//    @Column(name = "RECURRING_FLAG")
//    @ColumnDefault(value = "0")
//    private Boolean recurringFlag = Boolean.FALSE;

    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;

//    @Column(name = "RECURRING_INTERVAL")
//    private Integer recurringInterval;
//
//    @Column(name = "RECURRING_WEEK_DAYS")
//    private Integer recurringWeekDays;
//
//    @Column(name = "RECURRING_MONTH")
//    private Integer recurringMonth;
//
//    @Column(name = "RECURRING_DAYS")
//    private Integer recurringDays;
//
//    @Column(name = "RECURRING_FIRST_TO_LAST")
//    private Integer recurringFistToLast;
//
//    @Column(name = "RECURRING_BY_AFTER")
//    private Integer recurringByAfter;

//    @Column(name = "STATUS")
//    private Integer status;
    @Column(name = "PAYMENTMODE")
    private Integer paymentMode;

    @Basic
    @Lob
    @Column(name = "RECEIPT_ATTACHMENT")
    private byte[] receiptAttachmentBinary;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "expense", orphanRemoval = true)
    private Collection<ExpenseLineItem> expenseLineItems;

    @Nonnull
    public Collection<ExpenseLineItem> getExpenseLineItems() {
        return (expenseLineItems == null) ? (expenseLineItems = new ArrayList<>()) : expenseLineItems;
    }

    public void setExpenseLineItems(@Nonnull final Collection<ExpenseLineItem> expenseLineItems) {

        final Collection<ExpenseLineItem> thisExpenseLineItems = getExpenseLineItems();
        thisExpenseLineItems.clear();
        thisExpenseLineItems.addAll(expenseLineItems);
    }

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

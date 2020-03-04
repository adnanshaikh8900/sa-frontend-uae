package com.simplevat.entity;

import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;

import lombok.Data;

import javax.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
    @NamedQuery(name = "allPurchase",
            query = "SELECT p "
            + "FROM Purchase p where p.deleteFlag = FALSE")
})

@Entity
@Table(name = "PURCHASE")
@Data
@TableGenerator(name="INCREMENT_INITIAL_VALUE", initialValue = 1000)
public class Purchase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "PURCHASE_ID" )
    @GeneratedValue(strategy = GenerationType.IDENTITY,generator ="INCREMENT_INITIAL_VALUE")
    private Integer purchaseId;

    @Basic
    @Column(name = "PURCHASE_AMOUNT")
    @ColumnDefault(value = "0.00")
    private BigDecimal purchaseAmount;
    
    @Basic
    @Column(name = "PURCHASE_DUE_AMOUNT")
    @ColumnDefault(value = "0.00")
    private BigDecimal purchaseDueAmount;

    @Basic
    @Column(name = "PURCHASE_DATE")
    @Convert(converter = DateConverter.class)
    private LocalDateTime purchaseDate;
    
    @Basic
    @Column(name = "PURCHASE_DUE_DATE")
    @Convert(converter = DateConverter.class)
    private LocalDateTime purchaseDueDate;
    
    @Basic(optional = false)
    @Column(name = "PURCHASE_DUE_ON")
    @ColumnDefault(value = "0")
    private Integer purchaseDueOn;

    @Basic
    @Column(name = "PURCHASE_DESCRIPTION")
    private String purchaseDescription;

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
    private ChartOfAccount transactionType;

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
    private Contact purchaseContact;

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

    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;

    @Basic
    @Lob
    @Column(name = "RECEIPT_ATTACHMENT")
    private byte[] receiptAttachmentBinary;
    
    @Column(name = "STATUS")
    private Integer status;
    
    @Column(name = "PAYMENTMODE")
    private Integer paymentMode;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "purchase", orphanRemoval = true)
    private Collection<PurchaseLineItem> purchaseLineItems;

   
    public void addPurchaseItem( final PurchaseLineItem purchaseLineItem) {
        if (null == this.purchaseLineItems) {
          purchaseLineItems = new ArrayList<>();
        }
        purchaseLineItems.add(purchaseLineItem);
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

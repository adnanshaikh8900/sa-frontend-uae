package com.simplevat.entity;

import com.simplevat.entity.converter.DateConverter;
import com.simplevat.enums.DiscountType;
import com.simplevat.enums.InvoiceStatusType;
import java.io.Serializable;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

import lombok.AccessLevel;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@Data
@Entity
@Table(name = "SUPPLIER_INVOICE")
@TableGenerator(name="INCREMENT_INITIAL_VALUE", initialValue = 1000)
@NamedQueries({
    @NamedQuery(name = "allSupplierInvoices",
            query = "from SupplierInvoice i where i.deleteFlag = false order by i.lastUpdateDate desc")
})
public class SupplierInvoice implements Serializable {

    private static final long serialVersionUID = -8324261801367612269L;

    @Id
    @Setter(AccessLevel.NONE)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY,generator ="INCREMENT_INITIAL_VALUE")
    private Integer id;

    @Column(name = "REFERENCE_NUMBER")
    private String referenceNumber;

    @Column(name = "INVOICE_DATE")
    @Convert(converter = DateConverter.class)
    private LocalDateTime invoiceDate;

    @Column(name = "INVOICE_DUE_DATE")
    @Convert(converter = DateConverter.class)
    private LocalDateTime invoiceDueDate;

    @Column(name = "NOTES")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "DISCOUNT_TYPE")
    private DiscountType discountType;

    @Column(name = "DISCOUNT")
    @ColumnDefault(value = "0.00")
    private BigDecimal discount;

    @Column(name = "CONTACT_PO_NUMBER")
    private String contactPoNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENCY_CODE")
    private Currency currency;

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
    
    @Column(name = "FREEZE")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean freeze = Boolean.FALSE;
    
    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CONTACT_ID")
    private Contact contact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROJECT_ID")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DOCUMENT_TEMPLATE_ID")
    private DocumentTemplate documentTemplate;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "invoice", orphanRemoval = true)
    private Collection<SupplierInvoiceLineItem> supplierInvoiceLineItems;

    @Column(name = "TOTAL_AMOUNT")
    @ColumnDefault(value = "0.00")
    private BigDecimal totalAmount;

    @Column(name = "TOTAL_VAT_AMOUNT")
    @ColumnDefault(value = "0.00")
    private BigDecimal totalVatAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS")
    private InvoiceStatusType status;

    public Collection<SupplierInvoiceLineItem> getSupplierInvoiceLineItems() {
        return (supplierInvoiceLineItems == null) ? (supplierInvoiceLineItems = new ArrayList<>()) : supplierInvoiceLineItems;
    }

    public void setInvoiceLineItems( final Collection<SupplierInvoiceLineItem> lineItems) {

        final Collection<SupplierInvoiceLineItem> supplierInvoiceLineItems = getSupplierInvoiceLineItems();
        supplierInvoiceLineItems.clear();
        supplierInvoiceLineItems.addAll(lineItems);
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

package com.simplevat.entity.invoice;

import com.simplevat.entity.Product;
import com.simplevat.entity.VatCategory;
import java.io.Serializable;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@Entity
@Table(name = "INVOICE_LINE_ITEM")
@Data
public class InvoiceLineItem implements Serializable {

    private static final long serialVersionUID = 848122185643690684L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INVOICE_LINE_ITEM_ID")
    private int invoiceLineItemId;

    @Basic(optional = false)
    @Column(name = "INVOICE_LINE_ITEM_QUANTITY")
    private Integer invoiceLineItemQuantity;

    @Basic
    @Column(name = "INVOICE_LINE_ITEM_DESCRIPTION")
    private String invoiceLineItemDescription;

    @Basic
    @Column(name = "INVOICE_LINE_ITEM_UNIT_PRICE")
    @ColumnDefault(value = "0.00")
    private BigDecimal invoiceLineItemUnitPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INVOICE_LINE_ITEM_PRODUCT_SERVICE_ID")
    private Product invoiceLineItemProductService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INVOICE_LINE_ITEM_VAT_ID")
    private VatCategory invoiceLineItemVat;

    @Column(name = "CREATED_BY")
    @Basic(optional = false)
    private Integer createdBy;

    @Column(name = "CREATED_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
    @Basic(optional = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(name = "LAST_UPDATED_BY")
    private Integer lastUpdateBy;

    @Column(name = "LAST_UPDATE_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdateDate;

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
    @JoinColumn(name = "INVOICE_ID")
    private Invoice invoice;
    @Column(name = "INVOICE_PRODUCT_NAME")
    private String productName;
}

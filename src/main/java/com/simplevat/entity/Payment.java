package com.simplevat.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.invoice.Invoice;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by Ashish on 13/12/2019.
 */
@NamedQueries({
    @NamedQuery(name = "allPayments",
            query = "SELECT p FROM Payment p where p.deleteFlag = FALSE  ORDER BY p.paymentDate DESC")
})

@Entity
@Table(name = "PAYMENT")
@Data
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "ID")
    private Integer paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SUPPLIER_ID")
    private Contact supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INVOICE_ID")
    private Invoice invoice;

    @Basic
    @Column(name = "PAYMENT_DATE")
    private Date paymentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENCY_CODE")
    @JsonManagedReference
    private Currency currency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROJECT_ID")
    @JsonManagedReference
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BANK_ID")
    @JsonManagedReference
    private BankAccount bankAccount;

    @Basic
    @Column(name = "PAYMENT_DUE_DATE")
    private Date paymentDueDate;

    @Basic
    @Column(name = "DESCRIPTION")
    private String description;

    @Basic
    @Column(name = "REFERENCE_NUMBER")
    private String referenceNo;

    @Basic
    @Column(name = "RECEIPT_NUMBER")
    private String receiptNo;

    @Basic
    @Column(name = "RECEIPT_ATTACHMENT_PATH")
    private String receiptAttachmentPath;

    @Basic
    @Column(name = "RECEIPT_ATTACHMENT_DESCRIPTION")
    private String receiptAttachmentDescription;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean deleteFlag = Boolean.FALSE;

}

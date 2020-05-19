package com.simplevat.entity;

import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Basic;
import javax.persistence.Convert;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;


@Entity
@Table(name = "TAX_TRANSACTION")
@Data
public class TaxTransaction implements Serializable {

    private static final long serialVersionUID = 6914121175305098995L;

    @Id
    @Column(name = "TAX_TRANSACTION_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer taxTransactionId;
    @Basic
    @Temporal(TemporalType.DATE)
    @Column(name = "START_DATE")
    private Date startDate;
    @Basic
    @Temporal(TemporalType.DATE)
    @Column(name = "END_DATE")
    private Date endDate;
    @Basic
    @Column(name = "VAT_IN")
    private BigDecimal vatIn;
    @Basic
    @Column(name = "VAT_OUT")
    private BigDecimal vatOut;
    @Basic
    @Column(name = "DUE_AMOUNT")
    private BigDecimal dueAmount;
    @Basic
    @Temporal(TemporalType.DATE)
    @Column(name = "PAYMENT_DATE")
    private Date paymentDate;
    @Basic
    @Column(name = "PAID_AMOUNT")
    private BigDecimal paidAmount;
    @Basic
    @Column(name = "STATUS")
    private Integer status;

    @Basic(optional = false)
    @Column(name = "CREATED_BY")
    private Integer createdBy;

    @Basic(optional = false)
    @Column(name = "CREATED_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
    @Convert(converter = DateConverter.class)
    private LocalDateTime createdDate;

}

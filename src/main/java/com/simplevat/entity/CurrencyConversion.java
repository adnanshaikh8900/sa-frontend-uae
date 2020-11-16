/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.entity;

import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.persistence.*;

import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

/**
 *
 * @author admin
 */
@Entity
//@Table(name = "CURRENCY_CONVERSION")
@Table(name = "CONVERTED_CURRENCY")
@Data

@NamedQueries({
        @NamedQuery(name = "listOfCurrency", query = "SELECT cc FROM CurrencyConversion cc") })
public class CurrencyConversion implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "CURRENCY_CONVERSION_ID")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer currencyConversionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENCY_CODE")
    private Currency currencyCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENCY_CODE_CONVERTED_TO")
    private Currency currencyCodeConvertedTo;

    @Basic
    @Column(name = "EXCHANGE_RATE", precision = 19, scale = 9)
    private BigDecimal exchangeRate;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private boolean deleteFlag;
    
    @Column(name = "CREATED_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
    @Basic(optional = false)
    @Convert(converter = DateConverter.class)
    private LocalDateTime createdDate;
}

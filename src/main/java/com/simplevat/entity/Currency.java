package com.simplevat.entity;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Basic;
import javax.persistence.Version;
import javax.persistence.Transient;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
    @NamedQuery(name = "allCurrencies",
            query = "SELECT c "
            + "FROM Currency c where c.deleteFlag=false ORDER BY c.defaultFlag DESC, c.orderSequence,c.currencyDescription ASC "),
        @NamedQuery(name = "allCurrenciesProfile",
                query = "SELECT c "
                        + "FROM Currency c  ORDER BY c.defaultFlag DESC, c.orderSequence,c.currencyDescription ASC "),
        @NamedQuery(name = "allCompanyCurrencies",
                query = "SELECT c "
                        + "FROM Currency c  where c.currencyCode IN (SELECT cc.currencyCode from Company cc)"),
        @NamedQuery(name = "allActiveCurrencies",
                query = "SELECT c "
                        + "FROM Currency c where c.currencyCode IN (Select cc.currencyCode from CurrencyConversion cc) ORDER BY c.defaultFlag DESC, c.orderSequence,c.currencyDescription ASC "),
        @NamedQuery(name = "setDeafualtCurrency",query = "UPDATE Currency c SET c.deleteFlag=false WHERE c.currencyCode != :currencyCode ")
        })

@Entity
@Table(name = "CURRENCY")
@Data
public class Currency implements Serializable {


    @Id
    @Column(name = "CURRENCY_CODE")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer currencyCode;

    @Basic(optional = false)
    @Column(name = "CURRENCY_NAME")
    private String currencyName;

    @Basic
    @Column(name = "CURRENCY_DESCRIPTION")
    private String currencyDescription;

    @Basic
    @Column(name = "CURRENCY_ISO_CODE", length = 3)
    private String currencyIsoCode;

    @Basic
    @Column(name = "CURRENCY_SYMBOL")
    private String currencySymbol;

    @Column(name = "DEFAULT_FLAG")
    @ColumnDefault(value = "'N'")
    @Basic(optional = false)
    private Character defaultFlag;

    @Column(name = "ORDER_SEQUENCE")
    @Basic(optional = true)
    private Integer orderSequence;

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
    private boolean deleteFlag;

    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;

    @Transient
    private String description;

    public String getDescription() {
        return currencyDescription + " - " + currencyIsoCode + "(" + currencySymbol + ")";
    }
}

package com.simplevat.entity;


import lombok.Data;
import lombok.Setter;

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
import javax.persistence.ManyToOne;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;

import java.io.Serializable;
import java.util.Date;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */

@NamedQueries({
        @NamedQuery(name = "allCountries",
                query = "SELECT c FROM Country c where c.deleteFlag=false ORDER BY c.defaltFlag DESC , c.orderSequence,c.countryName ASC")
})

@Entity
@Table(name = "COUNTRY")
@Data
public class Country implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "COUNTRY_CODE")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int countryCode;
    @Basic(optional = false)
    @Column(name = "COUNTRY_NAME")
    private String countryName;
    @Basic
    @Column(name = "COUNTRY_DESCRIPTION")
    private String countryDescription;
    @Basic
    @Column(name = "ISO_ALPHA3_CODE", length = 3)
    private String isoAlpha3Code;
    
    @Column(name = "DEFAULT_FLAG")
    @ColumnDefault(value = "'N'")
    @Basic(optional = false)
    private Character defaltFlag;

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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENCY_CODE")
    private Currency currencyCode;

    @Transient
    @Setter
    private String countryFullName;

    public String getCountryFullName() {
        countryFullName = countryName + " - (" + isoAlpha3Code + ")";
        return countryFullName;
    }

}

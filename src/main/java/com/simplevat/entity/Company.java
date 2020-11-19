package com.simplevat.entity;

import com.simplevat.constant.CommonConstant;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;

import javax.persistence.NamedQueries;
import javax.persistence.Entity;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.Column;
import javax.persistence.Basic;
import javax.persistence.ManyToOne;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.Version;
import javax.persistence.Convert;
import javax.persistence.GenerationType;

import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
    @NamedQuery(name = "companiesForDropdown", query = "SELECT  new " + CommonConstant.DROPDOWN_MODEL_PACKAGE + "(c.companyId , c.companyName) "
            + " FROM Company c where c.deleteFlag = FALSE order by c.companyName "),
        @NamedQuery(name = "getCompanyCurrency",query = " SELECT cc.currencyCode FROM Company cc")
})
@Entity
@Table(name = "COMPANY")
@Data
public class Company implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPANY_ID")
    private Integer companyId;

    @Basic
    @Column(name = "COMPNAY_NAME")
    private String companyName;

    @Basic
    @Column(name = "COMPANY_REGISTRATION_NUMBER")
    private String companyRegistrationNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPANY_TYPE_CODE")
    private CompanyType companyTypeCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INDUSTRY_TYPE_CODE")
    private IndustryType industryTypeCode;

    @Basic
    @Column(name = "VAT_NUMBER")
    private String vatNumber;

    @Basic
    @Lob
    @Column(name = "COMPANY_LOGO")
    private byte[] companyLogo;

    @Basic
    @Column(name = "EMAIL_ADDRESS")
    private String emailAddress;

    @Basic
    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;

    @Basic
    @Column(name = "WEBSITE")
    private String website;

    @Basic
    @Column(name = "INVOICING_REFERENCE_PATTERN")
    private String invoicingReferencePattern;

    @Basic
    @Column(name = "INVOICING_ADDRESS_LINE1")
    private String invoicingAddressLine1;

    @Basic
    @Column(name = "INVOICING_ADDRESS_LINE2")
    private String invoicingAddressLine2;

    @Basic
    @Column(name = "INVOICING_ADDRESS_LINE3")
    private String invoicingAddressLine3;

    @Basic
    @Column(name = "INVOICING_CITY")
    private String invoicingCity;

    @Basic
    @Column(name = "INVOICING_STATE_REGION")
    private String invoicingStateRegion;

    @Basic
    @Column(name = "INVOICING_POST_ZIP_CODE")
    private String invoicingPostZipCode;

    @Basic
    @Column(name = "INVOICING_PO_BOX_NUMBER")
    private String invoicingPoBoxNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INVOICING_COUNTRY_CODE")
    private Country invoicingCountryCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENCY_CODE")
    private Currency currencyCode;

    @Basic
    @Column(name = "COMPANY_ADDRESS_LINE1")
    private String companyAddressLine1;

    @Basic
    @Column(name = "COMPANY_ADDRESS_LINE2")
    private String companyAddressLine2;

    @Basic
    @Column(name = "COMPANY_ADDRESS_LINE3")
    private String companyAddressLine3;

    @Basic
    @Column(name = "COMPANY_CITY")
    private String companyCity;

    @Basic
    @Column(name = "COMPANY_STATE_REGION")
    private String companyStateRegion;

    @Basic
    @Column(name = "COMPANY_POST_ZIP_CODE")
    private String companyPostZipCode;

    @Basic
    @Column(name = "COMPANY_PO_BOX_NUMBER")
    private String companyPoBoxNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPANY_COUNTRY_CODE")
    private Country companyCountryCode;

    @Column(name = "COMPANY_EXPENSE_BUDGET")
    @ColumnDefault(value = "0.00")
    private BigDecimal companyExpenseBudget;

    @Column(name = "COMPANY_REVENUE_BUDGET")
    @ColumnDefault(value = "0.00")
    private BigDecimal companyRevenueBudget;

    @Column(name = "CREATED_BY")
    @Basic(optional = false)
    private Integer createdBy;

    @Column(name = "CREATED_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
    @Basic(optional = false)
    @Convert(converter = DateConverter.class)
    private LocalDateTime createdDate;

    @Basic
    @Column(name = "LAST_UPDATED_BY")
    private Integer lastUpdatedBy;

    @Basic
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
    private Integer versionNumber = 1;

    @Basic
    @Column(name = "DATE_FORMAT")
    private String dateFormat;
}

package com.simplevat.entity;

import com.simplevat.constant.CommonConstant;
import com.simplevat.entity.converter.DateConverter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Basic;
import javax.persistence.Version;
import javax.persistence.ManyToOne;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.TableGenerator;
import javax.persistence.Convert;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */


@NamedQueries({
    @NamedQuery(name = "projectsForDropdown",
            query = "SELECT new "+ CommonConstant.DROPDOWN_MODEL_PACKAGE +"(p.projectId , p.projectName)"
            + " FROM Project p where p.deleteFlag = FALSE  order by p.projectName ")
    
})

@Entity
@Table(name = "PROJECT")
@Data
@NoArgsConstructor
@TableGenerator(name="INCREMENT_INITIAL_VALUE", initialValue = 1000)
public class Project implements Serializable {

    @Id
    @Column(name = "PROJECT_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY,generator ="INCREMENT_INITIAL_VALUE")
    private Integer projectId;

    @Column(name = "PROJECT_NAME")
    private String projectName;

    @Column(name = "EXPENSE_BUDGET")
    @ColumnDefault(value = "0.00")
    private BigDecimal expenseBudget = BigDecimal.ZERO;

    @Column(name = "REVENUE_BUDGET")
    @ColumnDefault(value = "0.00")
    private BigDecimal revenueBudget = BigDecimal.ZERO;

    @Column(name = "CONTRACT_PO_NUMBER")
    private String contractPoNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CONTACT_ID")
    private Contact contact;

    @Column(name = "VAT_REGISTRATION_NUMBER")
    private String vatRegistrationNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LANGUAGE_CODE")
    private Language invoiceLanguageCode;

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

    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;

}

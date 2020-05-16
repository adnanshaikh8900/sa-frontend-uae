package com.simplevat.entity;

import com.simplevat.constant.CommonConstant;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

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
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

@NamedQueries({
    @NamedQuery(name = "employeesForDropdown", query = "SELECT  new " + CommonConstant.DROPDOWN_MODEL_PACKAGE + "(c.id , CONCAT(c.firstName,' ',c.middleName,' ', c.lastName)) "
            + " FROM Employee c where c.deleteFlag = FALSE order by c.firstName, c.lastName ")
    ,
		@NamedQuery(name = "allEmployees", query = "SELECT c "
            + "FROM Employee c where c.deleteFlag = FALSE order by c.firstName, c.lastName")
    ,
		@NamedQuery(name = "employeeByEmail", query = "SELECT c " + "FROM Employee c where c.email =:email")
    ,
		@NamedQuery(name = "employeesByName", query = "SELECT c FROM Employee c WHERE (c.firstName LIKE :name or c.lastName LIKE :name) and c.deleteFlag = FALSE order by c.firstName, c.lastName")})
@Entity
@Table(name = "EMPLOYEE")
@Data
@TableGenerator(name = "INCREMENT_INITIAL_VALUE", initialValue = 1000)
public class Employee implements Serializable {

    private static final long serialVersionUID = 6914121175305098995L;

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "INCREMENT_INITIAL_VALUE")
    private Integer id;
    @Basic
    @Column(name = "FIRST_NAME")
    private String firstName;
    @Basic
    @Column(name = "MIDDLE_NAME")
    private String middleName;
    @Basic
    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "DATE_OF_BIRTH")
    @Basic(optional = false)
    @Convert(converter = DateConverter.class)
    private LocalDateTime dob;

    @Basic
    @Column(name = "PO_BOX_NUMBER")
    private String poBoxNumber;

    @Basic
    @Column(name = "EMAIL")
    private String email;

    @Basic
    @Column(name = "PASSWORD")
    private String password;

    @Basic
    @Column(name = "REFERENCE_CODE")
    private String referenceCode;

    @Basic
    @Column(name = "TITLE")
    private String title;

    @Basic
    @Column(name = "BILLING_EMAIL")
    private String billingEmail;

    @Basic
    @Column(name = "VAT_REGISTRATION_NO")
    private String vatRegistrationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENCY_CODE")
    private Currency currency;

    @Basic(optional = false)
    @Column(name = "CREATED_BY")
    private Integer createdBy;

    @Basic(optional = false)
    @Column(name = "CREATED_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
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
    private Integer versionNumber;

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

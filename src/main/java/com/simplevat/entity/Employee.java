package com.simplevat.entity;

import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

@NamedQueries({
    @NamedQuery(name = "employeesForDropdown",
            query = "SELECT c.id as value, CONCAT(c.firstName, c.middleName, c.lastName) as label"
                    + " FROM Employee c where c.deleteFlag = FALSE order by c.firstName, c.lastName")
    ,    
    @NamedQuery(name = "allEmployees",
            query = "SELECT c "
            + "FROM Employee c where c.deleteFlag = FALSE order by c.firstName, c.lastName")
    ,
    @NamedQuery(name = "employeeByEmail",
            query = "SELECT c "
            + "FROM Employee c where c.email =:email")
    ,
    @NamedQuery(name = "employeesByName",
            query = "SELECT c FROM Employee c WHERE (c.firstName LIKE :name or c.lastName LIKE :name) and c.deleteFlag = FALSE order by c.firstName, c.lastName")
})
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
    @Column(name = "MOBILE_NUMBER")
    private String mobileNumber;

    @Basic
    @Column(name = "ADDRESS_LINE1")
    private String addressLine1;

    @Basic
    @Column(name = "ADDRESS_LINE2")
    private String addressLine2;

    @Basic
    @Column(name = "ADDRESS_LINE3")
    private String addressLine3;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COUNTRY_CODE")
    private Country country;

    @Basic
    @Column(name = "POST_ZIP_CODE")
    private String postZipCode;

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

package com.simplevat.entity;

import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
    @NamedQuery(name = "findAllUsers",
            query = "SELECT u FROM User u where u.deleteFlag = FALSE  ORDER BY u.isActive DESC,u.firstName ASC")
})
@Entity
@Table(name = "USER")
@Data
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "USER_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Basic
    @Column(name = "FIRST_NAME")
    private String firstName;

    @Basic(optional = false)
    @Column(name = "USER_EMAIL", unique = true)
    private String userEmail;

    @Basic
    @Column(name = "LAST_NAME")
    private String lastName;

    @Basic
    @Column(name = "DATE_OF_BIRTH")
    @Convert(converter = DateConverter.class)
    private LocalDateTime dateOfBirth;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "COMPANY_ID")
    private Company company;

    @Column(name = "CREATED_BY")
    @Basic(optional = false)
    private Integer createdBy;

    @Column(name = "CREATED_DATE")
    @ColumnDefault(value = "CURRENT_TIMESTAMP")
    @Basic(optional = false)
    private LocalDateTime createdDate;

    @Basic
    @Column(name = "LAST_UPDATED_BY")
    private Integer lastUpdatedBy;

    @Basic
    @Convert(converter = DateConverter.class)
    @Column(name = "LAST_UPDATE_DATE")
    private LocalDateTime lastUpdateDate;

    @Basic(optional = false)
    @ColumnDefault(value = "0")
    @Column(name = "IS_ACTIVE")
    private Boolean isActive = true;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean deleteFlag = Boolean.FALSE;

    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Basic(optional = false)
    @Version
    private Integer versionNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ROLE_CODE")
    private Role role;

    @Basic(optional = false)
    @Column(name = "USER_PASSWORD")
    private String password;

    @Basic
    @Lob
    @Column(name = "PROFILE_IMAGE")
    private byte[] profileImageBinary;

    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "EMPLOYEE_ID")
    private Contact employeeId;
    
    
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

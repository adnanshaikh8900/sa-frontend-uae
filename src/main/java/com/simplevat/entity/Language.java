package com.simplevat.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.Basic;
import javax.persistence.Version;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
    @NamedQuery(name = "allLanguages",
            query = "SELECT l FROM Language l where l.deleteFlag=false ORDER BY l.defaultFlag DESC, l.orderSequence,l.languageName ASC ")
})

@Entity
@Table(name = "LANGUAGE")
@Data
public class Language implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "LANGUAGE_CODE")
    private int languageCode;

    @Column(name = "LANGUAGE_NAME")
    @Basic(optional = false)
    private String languageName;
    @Basic
    @Column(name = "LANGUAGE_DESCRIPTION")
    private String languageDescription;

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
    
}

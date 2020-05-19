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
 * Created by mohsin on 3/12/2017.
 */
@NamedQueries({
    @NamedQuery(name = "allTitles",
            query = "SELECT t FROM Title t where t.deleteFlag=false ORDER BY t.defaultFlag DESC, t.orderSequence,t.titleName ASC ")
})

@Entity
@Table(name = "TITLE")
@Data
public class Title implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "TITLE_CODE")
    private int titleCode;
    @Basic(optional = false)
    @Column(name = "TITLE_NAME")
    private String titleName;
    @Basic
    @Column(name = "TITLE_DESCRIPTION")
    private String titleDescription;

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

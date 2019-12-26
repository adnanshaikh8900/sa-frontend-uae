package com.simplevat.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by Uday on 9/28/2017.
 */
@NamedQueries({
    @NamedQuery(name = "allVatCategory",
            query = "SELECT v FROM VatCategory v  where v.deleteFlag = FALSE order by v.defaultFlag DESC, v.orderSequence,v.name ASC ")
})
@Entity
@Table(name = "VAT_CATEGORY")
@Data
@NoArgsConstructor
public class VatCategory implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "ID")
    private Integer id;
    @Basic
    @Column(name = "NAME")
    private String name;
    @Basic
    @Column(name = "VAT")
    private BigDecimal vat;
    @Column(name = "DEFAULT_FLAG")
    @ColumnDefault(value = "'N'")
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
    private Boolean deleteFlag = Boolean.FALSE;
    @Column(name = "VERSION_NUMBER")
    @ColumnDefault(value = "1")
    @Version
    private Integer versionNumber;
    @Transient
    private String vatLabel;

    public VatCategory(Integer id) {
        this.id = id;
    }
    
    public String getVatLabel() {
        return name + "(" + vat + ")";
    }

}

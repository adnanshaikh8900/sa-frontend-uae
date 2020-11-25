package com.simplevat.entity;


import com.simplevat.entity.converter.DateConverter;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 *  Created By Zain Khan On 20-11-2020
 */

@Data
@Entity
@Table(name = "CUSTOMIZE_INVOICE_TEMPLATE")
@TableGenerator(name = "INCREMENT_INITIAL_VALUE", initialValue = 1000)

@NamedQueries({
        @NamedQuery(name = "allInvoicesPrefix", query = "select i from CustomizeInvoiceTemplate i where i.type = :type and i.deleteFlag = false "),
        @NamedQuery(name = "lastInvoiceSuffixNo", query = "select i from CustomizeInvoiceTemplate i where i.type = :type order by i.id desc"),
})
public class CustomizeInvoiceTemplate implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "PREFIX")
    private String prefix;

    @Column(name = "SUFFIX")
    private Integer suffix;

    @Column(name = "TYPE")
    @Basic
    private Integer type;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean deleteFlag = Boolean.FALSE;

    @Column(name = "CREATED_BY")
    @Basic(optional = false)
    private Integer createdBy;


}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Basic;
import lombok.Data;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "PATCH")
@Data
public class Patch implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ID")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "EXECUTION_DATE")
    @Basic(optional = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date executionData;

    @Basic(optional = false)
    @Column(name = "PATCH_NO", length = 255)
    private String patchNo;
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.entity;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.Data;

/**
 *
 * @author daynil
 */
@Data
@Entity
@Table(name = "DOCUMENT_TEMPLATE")
@NamedQueries({ @NamedQuery(name = "DocumentTemplate.findAll", query = "SELECT d FROM DocumentTemplate d"),
		@NamedQuery(name = "DocumentTemplate.findById", query = "SELECT d FROM DocumentTemplate d WHERE d.id = :id"),
		@NamedQuery(name = "DocumentTemplate.findByName", query = "SELECT d FROM DocumentTemplate d WHERE d.name = :name"),
		@NamedQuery(name = "DocumentTemplate.findByType", query = "SELECT d FROM DocumentTemplate d WHERE d.type = :type") })

public class DocumentTemplate implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Basic(optional = false)
	@Column(name = "ID")
	private Integer id;

	@Basic(optional = false)
	@Column(name = "NAME")
	private String name;

	@Basic(optional = false)
	@Column(name = "TYPE")
	private Integer type;

	@Basic(optional = false)
	@Lob
	@Column(name = "TEMPLATE")
	private byte[] template;

	public DocumentTemplate() {
	}

	public DocumentTemplate(Integer id) {
		this.id = id;
	}

	public DocumentTemplate(Integer id, String name, Integer type, byte[] template) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.template = template;
	}

	@Override
	public int hashCode() {
		int hash = 0;
		hash += (id != null ? id.hashCode() : 0);
		return hash;
	}

	@Override
	public boolean equals(Object object) {
		// Warning - this method won't work in the case the id fields are not set
		if (!(object instanceof DocumentTemplate)) {
			return false;
		}
		DocumentTemplate other = (DocumentTemplate) object;
		return !((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id)));
	}

	@Override
	public String toString() {
		return "com.simplevat.entity.DocumentTemplate[ id=" + id + " ]";
	}

}

package com.simplevat.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;

/**
 * Created By Zain Khan On 19-10-2020
 */


@Entity
@Table(name = "SIMPLEVAT_MODULES")
@Data
@NoArgsConstructor

@NamedQueries({
        @NamedQuery(name = "listOfSimplevatModules", query = "SELECT sm FROM SimplevatModules sm Where sm.deleteFlag=false"),
        @NamedQuery(name= "moduleListByRoleCode",query = "SELECT sm FROM SimplevatModules sm ,RoleModuleRelation rm WHERE sm.simplevatModuleId =rm.simplevatModule.simplevatModuleId AND rm.role.roleCode=:roleCode")
       })
public class SimplevatModules {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "SIMPLEVAT_MODULE_ID")
    private Integer simplevatModuleId;

    @Column(name = "SIMPLEVAT_MODULE_NAME")
    @Basic(optional = false)
    private String simplevatModuleName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_SIMPLEVAT_MODULE_ID")
    private SimplevatModules parentModule;

    @Column(name = "DEFAULT_FLAG")
    @ColumnDefault(value = "'N'")
    @Basic(optional = false)
    private Character defaltFlag;

    @Column(name = "ORDER_SEQUENCE")
    @Basic(optional = true)
    private Integer orderSequence;

    @Column(name = "DELETE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private boolean deleteFlag;

    @Column(name = "SELECTABLE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean selectableFlag = Boolean.FALSE;

    @Column(name = "EDITABLE_FLAG")
    @ColumnDefault(value = "0")
    @Basic(optional = false)
    private Boolean editableFlag = Boolean.FALSE;

    @Column(name = "MODULE_TYPE")
    @Basic(optional = false)
    private String moduleType;




//    @OneToMany(mappedBy = "simplevatModules", fetch = FetchType.LAZY)
//    private List<RoleModuleRelation> roleModuleRelationList;
//
//    public SimplevatModules(Integer simplevatModuleId) {
//        this.simplevatModuleId = simplevatModuleId;
//    }
}


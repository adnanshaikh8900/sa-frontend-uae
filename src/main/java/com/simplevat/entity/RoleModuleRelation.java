package com.simplevat.entity;

import com.simplevat.entity.bankaccount.ChartOfAccount;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * Created By Zain Khan On 19-10-2020
 */

@Entity
@Table(name = "ROLE_MODULE_RELATION")
@Getter
@Setter

public class RoleModuleRelation {

        @Id
        @Column(name = "ID")
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "SIMPLEVAT_MODULE_ID")
        private SimplevatModules simplevatModule;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "ROLE_CODE")
        private Role role;


}

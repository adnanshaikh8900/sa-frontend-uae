package com.simplevat.entity;

import com.simplevat.constant.ModuleActionEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.entity.bankaccount.TransactionCategory;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import lombok.Data;
import org.springframework.lang.Nullable;

/**
 * @author saurabhg.
 */
@NamedQueries({
    @NamedQuery(name = "findByModuleTypeAndAction",
            query = "SELECT jm FROM JournalEntryMapping jm "
            + "where w.moduleType = :moduleType and action = :action")
})
@Entity
@Table(name = "JOURNAL_ENTRY_MAPPING")
@Data
public class JournalEntryMapping implements Serializable {

    private static final long serialVersionUID = -6038849464759772457L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(name = "MODULE_TYPE")
    private PostingReferenceTypeEnum moduleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTION")
    private ModuleActionEnum action;

    @Nullable
    @ManyToOne
    @JoinColumn(name = "FIRST_JOURNAL_TRANSACTION_CATEGORY")
    private TransactionCategory firstJounralTransactionCategory;

    @Column(name = "FIRST_JOURNAL_TRANSACTION_TYPE")
    private Character firstJounralTransactionType;

    @Nullable
    @ManyToOne
    @JoinColumn(name = "SECOND_JOURNAL_TRANSACTION_CATEGORY")
    private TransactionCategory secondJounralTransactionCategory;

    @Column(name = "SECOND_JOURNAL_TRANSACTION_TYPE")
    private Character secondJounralTransactionType;

}

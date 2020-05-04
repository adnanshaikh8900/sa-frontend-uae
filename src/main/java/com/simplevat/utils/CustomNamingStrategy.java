package com.simplevat.utils;

import org.hibernate.boot.model.naming.*;

/**
 * A custom naming strategy implementation which uses following naming conventions:
 * <ul>
 * <li>Table names are lower case and in plural form. Words are separated with '_' character.</li>
 * <li>Column names are lower case and words are separated with '_' character.</li>
 * </ul>
 *
 * @author Petri Kainulainen
 */
public class CustomNamingStrategy implements ImplicitNamingStrategy {


    public Identifier determinePrimaryTableName(ImplicitEntityNameSource implicitEntityNameSource) {
        return null;
    }

    public Identifier determineJoinTableName(ImplicitJoinTableNameSource implicitJoinTableNameSource) {
        return null;
    }

    public Identifier determineCollectionTableName(ImplicitCollectionTableNameSource implicitCollectionTableNameSource) {
        return null;
    }

    public Identifier determineDiscriminatorColumnName(ImplicitDiscriminatorColumnNameSource implicitDiscriminatorColumnNameSource) {
        return null;
    }

    public Identifier determineTenantIdColumnName(ImplicitTenantIdColumnNameSource implicitTenantIdColumnNameSource) {
        return null;
    }

    public Identifier determineIdentifierColumnName(ImplicitIdentifierColumnNameSource implicitIdentifierColumnNameSource) {
        return null;
    }

    public Identifier determineBasicColumnName(ImplicitBasicColumnNameSource implicitBasicColumnNameSource) {
        return null;
    }

    public Identifier determineJoinColumnName(ImplicitJoinColumnNameSource implicitJoinColumnNameSource) {
        return null;
    }

    public Identifier determinePrimaryKeyJoinColumnName(ImplicitPrimaryKeyJoinColumnNameSource implicitPrimaryKeyJoinColumnNameSource) {
        return null;
    }

    public Identifier determineAnyDiscriminatorColumnName(ImplicitAnyDiscriminatorColumnNameSource implicitAnyDiscriminatorColumnNameSource) {
        return null;
    }

    public Identifier determineAnyKeyColumnName(ImplicitAnyKeyColumnNameSource implicitAnyKeyColumnNameSource) {
        return null;
    }

    public Identifier determineMapKeyColumnName(ImplicitMapKeyColumnNameSource implicitMapKeyColumnNameSource) {
        return null;
    }

    public Identifier determineListIndexColumnName(ImplicitIndexColumnNameSource implicitIndexColumnNameSource) {
        return null;
    }

    public Identifier determineForeignKeyName(ImplicitForeignKeyNameSource implicitForeignKeyNameSource) {
        return null;
    }

    public Identifier determineUniqueKeyName(ImplicitUniqueKeyNameSource implicitUniqueKeyNameSource) {
        return null;
    }

    public Identifier determineIndexName(ImplicitIndexNameSource implicitIndexNameSource) {
        return null;
    }
}
package com.simplevat.dao;

import com.simplevat.entity.Role;

import java.util.List;

/**
 * Created by mohsin on 3/3/2017.
 */
public interface RoleDao {

    List<Role> getRoles();

    Role getRoleById(Integer roleCode);
}

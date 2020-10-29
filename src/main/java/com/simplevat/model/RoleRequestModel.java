package com.simplevat.model;


import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
public class RoleRequestModel {
private int roleID;
private String roleName;
private String roleDescription;
private List<Integer> moduleListIds;

}

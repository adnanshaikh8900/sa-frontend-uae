package com.simplevat.rest.contactController;

import com.simplevat.rest.PaginationModel;
import lombok.Data;

@Data
public class ContactRequestFilterModel extends PaginationModel{
    private String name;
    private String email;
    private Integer contactType;

}

package com.simplevat.rest.reconsilationcontroller;

import com.simplevat.rest.PaginationModel;
import lombok.Getter;

@Getter
public class ReconcileStatusRequestModel extends PaginationModel {

    private Integer bankId;
}

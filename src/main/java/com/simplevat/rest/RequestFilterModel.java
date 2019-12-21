/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest;

import lombok.Data;

/**
 *
 * @author uday
 */
@Data
public class RequestFilterModel {
    private Integer pageNo;
    private Integer pageSize;
}

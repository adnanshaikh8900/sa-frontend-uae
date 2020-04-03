package com.simplevat.service;

import com.simplevat.entity.CompanySetting;

public abstract class CompanySettingService extends SimpleVatService<Integer, CompanySetting> {

	public  abstract CompanySetting getSeting();
}

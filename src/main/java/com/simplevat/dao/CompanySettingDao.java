package com.simplevat.dao;

import com.simplevat.entity.CompanySetting;

public interface CompanySettingDao extends Dao<Integer, CompanySetting> {

	public CompanySetting getSeting();

}

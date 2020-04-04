package com.simplevat.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.CompanySettingDao;
import com.simplevat.entity.CompanySetting;

@Repository
public class CompanySettingDaoImpl extends AbstractDao<Integer, CompanySetting> implements CompanySettingDao {

	@Override
	public CompanySetting getSeting() {

		List<CompanySetting> companySettingList = this.executeNamedQuery("getSetting");
		return companySettingList != null && !companySettingList.isEmpty() ? companySettingList.get(0) : null;
	}

}

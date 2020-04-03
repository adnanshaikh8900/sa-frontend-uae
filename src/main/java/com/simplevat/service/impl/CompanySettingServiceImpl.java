package com.simplevat.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.dao.CompanySettingDao;
import com.simplevat.dao.Dao;
import com.simplevat.entity.CompanySetting;
import com.simplevat.service.CompanySettingService;

@Service
public class CompanySettingServiceImpl extends CompanySettingService {

	@Autowired
	private CompanySettingDao companySettingDao;

	@Override
	protected Dao<Integer, CompanySetting> getDao() {
		return companySettingDao;
	}

	@Override
	public CompanySetting getSeting() {
		{
			return companySettingDao.getSeting();
		}
	}

}

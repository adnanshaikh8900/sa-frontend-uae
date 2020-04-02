package com.simplevat.dao.impl;

import com.simplevat.dao.CountryDao;
import com.simplevat.entity.Country;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;

/**
 * Created by mohsinh on 3/10/2017.
 */
@Repository
public class CountryDaoImpl extends AbstractDao<Integer, Country> implements CountryDao {

	@Override
	public List<Country> getCountries() {
		return this.executeNamedQuery("allCountries");
	}

	@Override
	public Country getCountry(Integer countryId) {
		return this.findByPK(countryId);
	}

	@Override
	public Country getDefaultCountry() {
		List<Country> countries = getCountries();
		if (CollectionUtils.isNotEmpty(countries)) {
			return countries.get(0);
		}
		return null;
	}
}

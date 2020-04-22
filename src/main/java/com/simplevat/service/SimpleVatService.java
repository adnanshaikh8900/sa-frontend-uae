package com.simplevat.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.simplevat.dao.AbstractFilter;
import com.simplevat.dao.ActivityDao;
import com.simplevat.dao.Dao;
import com.simplevat.entity.Activity;
import com.simplevat.exceptions.ServiceException;
import com.simplevat.service.exceptions.ServiceErrorCode;

public abstract class SimpleVatService<PK, ENTITY> {

	@Autowired
	private ActivityDao activityDao;

	public ENTITY findByPK(PK pk) {
		ENTITY returnEntity = getDao().findByPK(pk);
		if (returnEntity == null) {
			throw new ServiceException("", ServiceErrorCode.RecordDoesntExists);
		}
		return returnEntity;
	}

	public List<ENTITY> executeNamedQuery(String namedQuery) {
		return getDao().executeNamedQuery(namedQuery);
	}

	public void persist(ENTITY entity, PK pk) {
		persist(entity, pk, null);

	}

	protected void persist(ENTITY entity, PK pk, Activity activity) {
		if (pk != null) {
			ENTITY returnEntity = getDao().findByPK(pk);
			if (returnEntity != null) {
				throw new ServiceException("", ServiceErrorCode.RecordAlreadyExists);
			}
		}

		getDao().persist(entity);
		persistActivity(entity, activity, " Created ");
	}

	public void persist(ENTITY entity) {
		persist(entity, null);
	}

	public ENTITY update(ENTITY entity, PK pk) {
		return update(entity, pk, null);
	}

	public ENTITY update(ENTITY entity) {
		return update(entity, null);
	}

	protected ENTITY update(ENTITY entity, PK pk, Activity activity) {
		// commenting this as we are calling update for save and update method both
		// ENTITY returnEntity = getDao().findByPK(pk);
		// if(returnEntity == null) {
		// throw new ServiceException("", ServiceErrorCode.RecordDoesntExists);
		// }
		entity = getDao().update(entity);
		persistActivity(entity, activity, " Updated ");
		return entity;
	}

	public void delete(ENTITY entity) {
		delete(entity, null);
	}

	public void delete(ENTITY entity, PK pk) {
		delete(entity, pk, null);
	}

	protected void delete(ENTITY entity, PK pk, Activity activity) {
		if (pk != null) {
			ENTITY returnEntity = getDao().findByPK(pk);
			if (returnEntity == null) {
				throw new ServiceException("", ServiceErrorCode.RecordDoesntExists);
			}
		}
		getDao().delete(entity);
		persistActivity(entity, activity, " Removed ");

	}

	public List<ENTITY> findByAttributes(Map<String, Object> attributes) {
		List<ENTITY> listEntity = new ArrayList<>();

		if (attributes != null && attributes.size() > 0) {
			listEntity = getDao().findByAttributes(attributes);
		}

		return listEntity;
	}

	public List<ENTITY> filter(AbstractFilter<ENTITY> filter) {
		List<ENTITY> listEntity = new ArrayList<>();
		if (filter != null) {
			listEntity = getDao().filter(filter);
		}
		return listEntity;

	}

	protected abstract Dao<PK, ENTITY> getDao();

	protected Activity getActivity(ENTITY entity) {
		return null;
	}

	private Activity getDefaultLogActivity(ENTITY entity, String activityCode) {
		String moduleCode = entity.getClass().getSimpleName();
		Activity activity = new Activity();
		activity.setModuleCode(moduleCode);
		activity.setActivityCode(activityCode);
		activity.setField1("");
		activity.setField2("");
		activity.setField3(moduleCode + " " + activityCode);
		activity.setLoggingRequired(true);
		activity.setLastUpdateDate(LocalDateTime.now());
		return activity;
	}

	private void persistActivity(ENTITY entity, Activity activity, String activityCode) {
		if (activity == null) {
			activity = getDefaultLogActivity(entity, activityCode);
		}
		if (activity.isLoggingRequired()) {
			activityDao.persist(activity);
		}
	}

	public ENTITY getFirstElement(List<ENTITY> list) {

		if (list != null && !list.isEmpty()) {
			return list.get(0);
		}

		return null;
	}

}

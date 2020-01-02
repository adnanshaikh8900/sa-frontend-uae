package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.VatCategoryFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.VatCategoryDao;
import com.simplevat.entity.Journal;
import com.simplevat.entity.VatCategory;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

@Repository
public class VatCategoryDaoImpl extends AbstractDao<Integer, VatCategory> implements VatCategoryDao {

    @Override
    public List<VatCategory> getVatCategoryList() {
        List<VatCategory> vatCategoryList = this.executeNamedQuery("allVatCategory");
        return vatCategoryList;
    }

    @Override
    public List<VatCategory> getVatCategorys(String name) {
        TypedQuery<VatCategory> query = getEntityManager().createQuery("SELECT v FROM VatCategory v  where v.deleteFlag = FALSE AND v.name LIKE '%'||:searchToken||'%' order by v.defaultFlag DESC, v.orderSequence ASC", VatCategory.class);
        query.setParameter("searchToken", name);
        List<VatCategory> vatCategorys = query.getResultList();
        if (vatCategorys != null && !vatCategorys.isEmpty()) {
            return vatCategorys;
        }
        return null;
    }

    @Override
    public VatCategory getDefaultVatCategory() {
        TypedQuery<VatCategory> query = getEntityManager().createQuery("SELECT v FROM VatCategory v WHERE v.deleteFlag = false AND v.defaultFlag = 'Y'", VatCategory.class);
        List<VatCategory> vatCategory = query.getResultList();
        if (vatCategory != null && !vatCategory.isEmpty()) {
            return vatCategory.get(0);
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteByIds(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            for (Integer id : ids) {
                VatCategory vatCategory = findByPK(id);
                vatCategory.setDeleteFlag(Boolean.TRUE);
                update(vatCategory);
            }
        }
    }

	@Override
	public List<VatCategory> getVatCategoryList(Map<VatCategoryFilterEnum, Object> filterDataMap) {

		List<DbFilter> dbFilters = new ArrayList();
		filterDataMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		List<VatCategory> vatCategories = this.executeQuery(dbFilters);
		return vatCategories;

	}
}

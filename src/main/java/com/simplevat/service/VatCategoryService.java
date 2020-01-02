package com.simplevat.service;

import com.simplevat.constant.dbfilter.VatCategoryFilterEnum;
import com.simplevat.entity.VatCategory;
import java.util.List;
import java.util.Map;

public abstract class VatCategoryService extends SimpleVatService<Integer, VatCategory> {

    public abstract List<VatCategory> getVatCategoryList();

    public abstract List<VatCategory> getVatCategorys(String name);

    public abstract VatCategory getDefaultVatCategory();

    public abstract void deleteByIds(List<Integer> ids);

	public abstract List<VatCategory> getVatCategoryList(Map<VatCategoryFilterEnum, Object> filterDataMap);
}

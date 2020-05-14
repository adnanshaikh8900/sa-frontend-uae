package com.simplevat.dao;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.rest.PaginationModel;

import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

public abstract class AbstractDao<PK, ENTITY> implements Dao<PK, ENTITY> {

	private final String andClause = " and ";
	private final String whereClause = " where ";

	protected Class<ENTITY> entityClass;

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private EntityManagerFactory emf;

	@SuppressWarnings("unchecked")
	public AbstractDao() {
		ParameterizedType genericSuperclass = (ParameterizedType) getClass().getGenericSuperclass();
		this.entityClass = (Class<ENTITY>) genericSuperclass.getActualTypeArguments()[1];
	}

	@Override
	public ENTITY findByPK(PK pk) {
		return entityManager.find(entityClass, pk);
	}

	@Override
	public List<ENTITY> executeNamedQuery(String namedQuery) {
		return entityManager.createNamedQuery(namedQuery, entityClass).getResultList();
	}

	@Override
	public List<ENTITY> executeQuery(List<DbFilter> dbFilters) {
		StringBuilder queryBuilder = new StringBuilder("SELECT o FROM ").append(entityClass.getName()).append(" o ");
		int i = 0;
		for (DbFilter dbFilter : dbFilters) {
			if (dbFilter.getValue() != null && !dbFilter.getValue().toString().isEmpty()) {
				if (i > 0) {
					queryBuilder.append(andClause);
				} else {
					queryBuilder.append(whereClause);
				}
				queryBuilder.append("o.").append(dbFilter.getDbCoulmnName()).append(dbFilter.getCondition());
				i++;
			}
		}

		TypedQuery<ENTITY> typedQuery = entityManager.createQuery(queryBuilder.toString(), entityClass);
		for (DbFilter dbFilter : dbFilters) {
			if (dbFilter.getValue() != null && !dbFilter.getValue().toString().isEmpty()) {
				typedQuery.setParameter(dbFilter.getDbCoulmnName(), dbFilter.getValue());
			}
		}

		return typedQuery.getResultList();
	}

	@Override
	public List<ENTITY> executeQuery(List<DbFilter> dbFilters, PaginationModel paginationModel) {
		StringBuilder queryBuilder = new StringBuilder("FROM ").append(entityClass.getName());
		int i = 0;
		DbFilter orderByFilter = null;
		for (DbFilter dbFilter : dbFilters) {
			boolean orderBy = isOrderBy(dbFilter);
			if (dbFilter.getValue() != null && !dbFilter.getValue().toString().isEmpty() && !orderBy) {
				if (i > 0) {
					queryBuilder.append(andClause);
				} else {
					queryBuilder.append(whereClause);
				}
				queryBuilder.append(dbFilter.getDbCoulmnName()).append(dbFilter.getCondition());
				i++;
			} else if (orderBy) {
				orderByFilter = dbFilter;
			}
		}
		if (paginationModel != null && paginationModel.getSortingCol() != null
				&& !paginationModel.getSortingCol().isEmpty() && !paginationModel.getSortingCol().contains(" ") && !paginationModel.getSortingCol().contains("-1") ) {
			queryBuilder.append(" order by " + paginationModel.getSortingCol() + " " + paginationModel.getOrder());
		}

		TypedQuery<ENTITY> typedQuery = entityManager.createQuery(queryBuilder.toString(), entityClass);
		for (DbFilter dbFilter : dbFilters) {
			if (dbFilter.getValue() != null && !dbFilter.getValue().toString().isEmpty() && !isOrderBy(dbFilter)) {
				typedQuery.setParameter(dbFilter.getDbCoulmnName(), dbFilter.getValue());
			}
		}

		if (paginationModel != null && !paginationModel.isPaginationDisable()) {
			typedQuery.setFirstResult(paginationModel.getPageNo());
			typedQuery.setMaxResults(paginationModel.getPageSize());
		}

		return typedQuery.getResultList();
	}

	@Override
	public Integer getResultCount(List<DbFilter> dbFilters) {

		StringBuilder queryBuilder = new StringBuilder("FROM ").append(entityClass.getName());
		int i = 0;
		DbFilter orderByFilter = null;
		for (DbFilter dbFilter : dbFilters) {
			boolean orderBy = isOrderBy(dbFilter);
			if (dbFilter.getValue() != null && !dbFilter.getValue().toString().isEmpty() && !orderBy) {
				if (i > 0) {
					queryBuilder.append(andClause);
				} else {
					queryBuilder.append(whereClause);
				}
				queryBuilder.
				// append("o.").
						append(dbFilter.getDbCoulmnName()).append(dbFilter.getCondition());
				i++;
			} else if (orderBy) {
				orderByFilter = dbFilter;
			}
		}

		TypedQuery<ENTITY> typedQuery = entityManager.createQuery(queryBuilder.toString(), entityClass);
		for (DbFilter dbFilter : dbFilters) {
			if (dbFilter.getValue() != null && !dbFilter.getValue().toString().isEmpty() && !isOrderBy(dbFilter)) {
				typedQuery.setParameter(dbFilter.getDbCoulmnName(), dbFilter.getValue());
			}
		}
		List<ENTITY> result = typedQuery.getResultList();
		return result != null && !result.isEmpty() ? result.size() : 0;
	}

	@Override
	@Transactional
	public ENTITY persist(ENTITY entity) {
		entityManager.persist(entity);
		entityManager.flush();
		entityManager.refresh(entity);
		return entity;
	}

	@Override
	@Transactional
	public ENTITY update(ENTITY entity) {
		return entityManager.merge(entity);
	}

	@Override
	@Transactional
	public void delete(ENTITY entity) {
		entityManager.remove(entityManager.contains(entity) ? entity : entityManager.merge(entity));
	}

	@Override
	public EntityManager getEntityManager() {
		return this.entityManager;
	}

	@Override
	public List<ENTITY> findByAttributes(Map<String, Object> attributes) {
		List<ENTITY> results;
		// set up the Criteria query
		CriteriaBuilder cb = entityManager.getCriteriaBuilder();
		CriteriaQuery<ENTITY> cq = cb.createQuery(entityClass);
		Root<ENTITY> foo = cq.from(entityClass);

		List<Predicate> predicates = new ArrayList<>();
		for (String s : attributes.keySet()) {
			if (foo.get(s) != null) {
				if (attributes.get(s) instanceof String)
					predicates.add(cb.like(foo.get(s), "%" + attributes.get(s) + "%"));

				if (!(attributes.get(s) instanceof String))
					predicates.add(cb.equal(foo.get(s), attributes.get(s)));
			}
		}
		cq.where(predicates.toArray(new Predicate[] {}));
		TypedQuery<ENTITY> q = entityManager.createQuery(cq);

		results = q.getResultList();
		return results;
	}

	@Override
	public List<ENTITY> filter(AbstractFilter<ENTITY> filter) {
		CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
		CriteriaQuery<ENTITY> criteriaQuery = cb.createQuery(entityClass);
		Root<ENTITY> root = criteriaQuery.from(entityClass);
		filter.buildPredicates(root, cb);
		filter.addOrderCriteria(root, cb);
		List<Predicate> predicates = filter.getPredicates();
		if (predicates != null && !predicates.isEmpty()) {
			criteriaQuery.where(predicates.toArray(new Predicate[predicates.size()]));
		}
		List<Order> orders = filter.getOrders();
		if (orders != null && !orders.isEmpty()) {
			criteriaQuery.orderBy(orders);
		}
		TypedQuery<ENTITY> query = getEntityManager().createQuery(criteriaQuery);
		filter.addPagination(query);
		return query.getResultList();

	}

	@Override
	public void importData(List<ENTITY> entities) {
		EntityManager entityManager = emf.createEntityManager();
		entityManager.setFlushMode(FlushModeType.COMMIT);
		EntityTransaction transaction = null;
		int entityCount = entities.size();
		int batchSize = 10;
		try {

			transaction = entityManager.getTransaction();
			transaction.begin();

			for (int i = 0; i < entityCount; i++) {
				if (i > 0 && i % batchSize == 0) {

					entityManager.flush();
					entityManager.clear();
					transaction.commit();
					transaction.begin();
				}
				ENTITY entity = entities.get(i);
				entityManager.persist(entity);
			}

			transaction.commit();
		} catch (RuntimeException e) {
			if (transaction != null && transaction.isActive()) {
				transaction.rollback();
			}
			throw e;
		} finally {
			entityManager.close();
		}

	}

	@Override
	public List<ENTITY> dumpData() {
		@SuppressWarnings("unchecked")
		List<ENTITY> resultList = entityManager.createQuery("Select t from " + entityClass.getSimpleName() + " t")
				.getResultList();
		return resultList;
	}

	private boolean isOrderBy(DbFilter dbFilter) {
		return (dbFilter.getValue() != null && !dbFilter.getValue().toString().isEmpty()
				&& (dbFilter.getValue().toString().equalsIgnoreCase(ORDERBYENUM.ASC.toString())
						|| dbFilter.getValue().toString().equalsIgnoreCase(ORDERBYENUM.DESC.toString())));
	}
}

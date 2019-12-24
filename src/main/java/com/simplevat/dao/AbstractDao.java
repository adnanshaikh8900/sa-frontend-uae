package com.simplevat.dao;

import com.simplevat.constant.dbfilter.DbFilter;
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
        List<ENTITY> result = entityManager.createNamedQuery(namedQuery,
                entityClass).getResultList();
        return result;
    }

    @Override
    public List<ENTITY> executeQuery(List<DbFilter> dbFilters) {
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM ").append(entityClass.getName()).append(" o ");
        int i = 0;
        for (DbFilter dbFilter : dbFilters) {
            if (dbFilter.getValue() != null && !dbFilter.getValue().toString().isEmpty()) {
                if (i > 0) {
                    queryBuilder.append(" and ");
                } else {
                    queryBuilder.append(" where ");
                }
                queryBuilder.append("o.").append(dbFilter.getDbCoulmnName()).append(dbFilter.getCondition());
                i++;
            }
        }

        TypedQuery<ENTITY> typedQuery = entityManager.createQuery(queryBuilder.toString(), entityClass);
        for (DbFilter dbFilter : dbFilters) {
            if (dbFilter.getValue() != null) {
                typedQuery.setParameter(dbFilter.getDbCoulmnName(), dbFilter.getValue());
            }
        }

        List<ENTITY> result = typedQuery.getResultList();
        return result;
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
    public List<ENTITY> findByAttributes(Map<String, String> attributes) {
        List<ENTITY> results;
        //set up the Criteria query
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ENTITY> cq = cb.createQuery(entityClass);
        Root<ENTITY> foo = cq.from(entityClass);

        List<Predicate> predicates = new ArrayList<Predicate>();
        for (String s : attributes.keySet()) {
            if (foo.get(s) != null) {
                predicates.add(cb.like(foo.get(s), "%" + attributes.get(s) + "%"));
            }
        }
        cq.where(predicates.toArray(new Predicate[]{}));
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
        if (predicates != null && predicates.size() > 0) {
            criteriaQuery.where(predicates.toArray(new Predicate[predicates.size()]));
        }
        List<Order> orders = filter.getOrders();
        if (orders != null && orders.size() > 0) {
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
        List<ENTITY> resultList = entityManager.createQuery("Select t from " + entityClass.getSimpleName() + " t").getResultList();
        return resultList;
    }

}

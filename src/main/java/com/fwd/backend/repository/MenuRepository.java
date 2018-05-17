package com.fwd.backend.repository;

import com.fwd.backend.domain.Menu;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;


/**
 * Repository for Menu entity
 * 
 * @author moe
 *
 */
@RepositoryRestResource(collectionResourceRel = "menu", path = "menu")
public interface MenuRepository extends CrudRepository<Menu, Long>, PagingAndSortingRepository<Menu, Long> {
    
    public abstract List<Menu> findByTypeAndActiveAndStartTimeLessThanAndEndTimeGreaterThanOrderByOrdersAsc(String type, boolean active, Date startDate, Date endDate);

    @RestResource(path = "all", rel = "all")
    public abstract Page<Menu> findByTitleContainsIgnoreCaseOrTypeContainsIgnoreCaseOrShortDescriptionContainsIgnoreCaseOrDescriptionContainsIgnoreCase(@Param("q") String q1, @Param("q") String q2, @Param("q") String q3, @Param("q") String q4, Pageable pageable);
    
}

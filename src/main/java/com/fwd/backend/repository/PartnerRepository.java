package com.fwd.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fwd.backend.domain.Partner;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

/**
 * Repository for partner entity
 * 
 * @author moe
 *
 */
@RepositoryRestResource(collectionResourceRel = "partner", path = "partner")
public interface PartnerRepository extends CrudRepository<Partner, Long>, PagingAndSortingRepository<Partner, Long> {
    
    @RestResource(path = "approval", rel = "approval")
    Page<Partner> findByApproval(@Param("q") boolean approval, Pageable pageable);
    
    List<Partner> findByApproval(boolean approval);
}

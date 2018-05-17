package com.fwd.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fwd.backend.domain.Partner;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Repository for partner entity
 * 
 * @author moe
 *
 */
@RepositoryRestResource(collectionResourceRel = "partner", path = "partner")
public interface PartnerRepository extends CrudRepository<Partner, Long>, PagingAndSortingRepository<Partner, Long> {
    
    public abstract List<Partner> findByApproval(boolean approval);
    
}

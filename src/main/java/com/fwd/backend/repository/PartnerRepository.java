package com.fwd.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fwd.backend.domain.Partner;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repository for Department entity
 * 
 * @author moe
 *
 */
public interface PartnerRepository extends JpaRepository<Partner, Long> {
     @Query
    List<Partner> findByApproval(@Param("approval") boolean approval);
    
}

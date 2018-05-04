package ec.com.magmasoft.lava.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ec.com.magmasoft.lava.domain.Department;
import ec.com.magmasoft.lava.domain.Partner;
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

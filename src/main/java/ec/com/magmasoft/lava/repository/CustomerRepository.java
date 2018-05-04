package ec.com.magmasoft.lava.repository;

import ec.com.magmasoft.lava.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Repository for Department entity
 * 
 * @author moe
 *
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {

}

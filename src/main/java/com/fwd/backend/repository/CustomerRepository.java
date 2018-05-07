package com.fwd.backend.repository;

import com.fwd.backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Repository for Department entity
 * 
 * @author moe
 *
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {

}

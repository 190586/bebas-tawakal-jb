package com.fwd.backend.facade;

import com.fwd.backend.domain.Customer;
import com.fwd.backend.repository.CustomerRepository;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Facade for manage department operations
 * 
 * @author moe
 *
 */
@RestController
public class CustomerAdministrationFacade {

	@Autowired
	private CustomerRepository customerRepository;

	/**
	 * Get a list of all partner in the database
	 * 
	 * @return
	 */
	@RequestMapping("/customers")
	public List<Customer> getCustomers() {
		return customerRepository.findAll();
	}
}
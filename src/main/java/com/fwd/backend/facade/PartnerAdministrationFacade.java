package com.fwd.backend.facade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fwd.backend.domain.Partner;
import com.fwd.backend.repository.PartnerRepository;

/**
 * Facade for manage department operations
 * 
 * @author moe
 *
 */
@RestController
public class PartnerAdministrationFacade {

	@Autowired
	private PartnerRepository partnerRepository;

	/**
	 * Get a list of all partner in the database
	 * 
	 * @return
	 */
	@RequestMapping("/partners")
	public List<Partner> getPartners() {
		return partnerRepository.findAll();
	}
}
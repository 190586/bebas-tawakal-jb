package ec.com.magmasoft.lava.facade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ec.com.magmasoft.lava.domain.Department;
import ec.com.magmasoft.lava.repository.DepartmentRepository;

/**
 * Facade for manage department operations
 * 
 * @author moe
 *
 */
@RestController
public class DepartmentAdministrationFacade {

	@Autowired
	private DepartmentRepository departmentRepository;

	/**
	 * Get a list of all departments in the database
	 * 
	 * @return
	 */
	@RequestMapping("/departments")
	public List<Department> getDepartments() {
		return departmentRepository.findAll();
	}
}
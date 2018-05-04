package ec.com.magmasoft.lava.facade;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import ec.com.magmasoft.lava.TestApplication;
import ec.com.magmasoft.lava.domain.Department;
import ec.com.magmasoft.lava.repository.DepartmentRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = TestApplication.class)
public class DeparmentAdministrationFacadeTest {

	@Autowired
	private DepartmentRepository departmentRepository;

	@Autowired
	private DepartmentAdministrationFacade departmentAdministrationFacade;

	@Test
	public void laListaDebeTenerDosDepartamentos() throws Exception {
		loadDepartments();
		Assert.assertEquals(2, departmentAdministrationFacade.getDepartments()
				.size());
	}

	private void loadDepartments() {
		departmentRepository.save(new Department());
		departmentRepository.save(new Department());
	}

}

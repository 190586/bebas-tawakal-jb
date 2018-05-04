package ec.com.magmasoft.lava.facade;

import ec.com.magmasoft.lava.domain.Menu;
import ec.com.magmasoft.lava.repository.MenuRepository;
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
public class MenuAdministrationFacade {

	@Autowired
	private MenuRepository menuRepository;

	/**
	 * Get a list of all partner in the database
	 * 
	 * @return
	 */
	@RequestMapping("/menus")
	public List<Menu> getMenus() {
		return menuRepository.findAll();
	}
}
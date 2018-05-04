
package ec.com.magmasoft.lava.services;
import ec.com.magmasoft.lava.domain.Menu;
import ec.com.magmasoft.lava.repository.MenuRepository;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
public class HomePageService {

    @Autowired
    MenuRepository menuRepository;
    
    public List<Menu> getHomeSlider() {
        Date now = new Date();
        List<Menu> menu = menuRepository.findTop5ByTypeAndActiveAndStartTimeLessThanAndEndTimeGreaterThanOrderByOrdersAsc(Menu.HOME_SLIDER_TYPE, true, now, now);
        
        return menu;
    }
    
    public List<Menu> getMenu(String menuType) {
        Date now = new Date();
        List<Menu> menu = menuRepository.findByTypeAndActiveAndStartTimeLessThanAndEndTimeGreaterThanOrderByOrdersAsc(menuType, true, now, now);
        
        return menu;
    }
    
    
}


package com.fwd.backend.service;
import com.fwd.backend.domain.Menu;
import com.fwd.backend.repository.MenuRepository;
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

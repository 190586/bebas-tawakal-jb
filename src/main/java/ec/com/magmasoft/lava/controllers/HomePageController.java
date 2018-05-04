/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ec.com.magmasoft.lava.controllers;

import ec.com.magmasoft.lava.domain.Customer;
import ec.com.magmasoft.lava.domain.Partner;
import ec.com.magmasoft.lava.repository.CustomerRepository;
import ec.com.magmasoft.lava.repository.PartnerRepository;
import ec.com.magmasoft.lava.services.HomePageService;
import ec.com.magmasoft.lava.utils.CustomLogger;
import ec.com.magmasoft.lava.utils.RC;
import ec.com.magmasoft.lava.utils.RF;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author hendrara
 */
@Controller
@RequestMapping({"/home"})
public class HomePageController {
    
     @Autowired
    private HomePageService homePageService;
    
    @Autowired
    CustomerRepository customerRepository;
    
    @Autowired
    PartnerRepository partnerRepository;
    
    private static final Logger eventLogger = LoggerFactory.getLogger(CustomLogger.EVENT);
    private static final Logger errorLogger = LoggerFactory.getLogger(CustomLogger.ERROR);
    
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "/home";
    }
    
    @RequestMapping(value = "/home-slider", method = {RequestMethod.GET})
    public ResponseEntity<?> getHomeSlider() {
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            List results = homePageService.getHomeSlider();
            resp.put(RF.RESULTS, results);
            resp.put(RF.RESPONSE_CODE, RC.SUCCESS);
            resp.put(RF.RESPONSE_MESSAGE, RC.SUCCESS_DESC);
        } catch (Exception ex) {
            resp.put(RF.RESPONSE_CODE, RC.UNKNOWN_FAIL);
            resp.put(RF.RESPONSE_MESSAGE, RC.UNKNOWN_FAIL_DESC);
            // errorLogger.error(ex.getMessage(), ex);
        }
        entity = new ResponseEntity(resp, headers, HttpStatus.OK);

        return entity;
    }
    
    @RequestMapping(value = "/list-menus/{menuType}", method = {RequestMethod.GET})
    public ResponseEntity<?> getListMenus(@PathVariable String menuType) {
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            List results = homePageService.getMenu(menuType);
            resp.put(RF.RESULTS, results);
            resp.put(RF.RESPONSE_CODE, RC.SUCCESS);
            resp.put(RF.RESPONSE_MESSAGE, RC.SUCCESS_DESC);
        } catch (Exception ex) {
            resp.put(RF.RESPONSE_CODE, RC.UNKNOWN_FAIL);
            resp.put(RF.RESPONSE_MESSAGE, RC.UNKNOWN_FAIL_DESC);
            // errorLogger.error(ex.getMessage(), ex);
        }
        entity = new ResponseEntity(resp, headers, HttpStatus.OK);

        return entity;
    }
    
    @RequestMapping(value = "/add-customer", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addCustomer(@RequestBody Customer request) {
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            customerRepository.save(request);
            boolean success = true;
            resp.put(RF.RESULTS, success);
            resp.put(RF.RESPONSE_CODE, RC.SUCCESS);
            resp.put(RF.RESPONSE_MESSAGE, RC.SUCCESS_DESC);
        } catch (Exception ex) {
            resp.put(RF.RESPONSE_CODE, RC.UNKNOWN_FAIL);
            resp.put(RF.RESPONSE_MESSAGE, RC.UNKNOWN_FAIL_DESC);
        }
        entity = new ResponseEntity(resp, headers, HttpStatus.OK);
        return entity;
    }
    
    @RequestMapping(value = "/add-partner", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addPartner(@RequestBody Partner request) {
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            partnerRepository.save(request);
            boolean success = true;
            resp.put(RF.RESULTS, success);
            resp.put(RF.RESPONSE_CODE, RC.SUCCESS);
            resp.put(RF.RESPONSE_MESSAGE, RC.SUCCESS_DESC);
        } catch (Exception ex) {
            resp.put(RF.RESPONSE_CODE, RC.UNKNOWN_FAIL);
            resp.put(RF.RESPONSE_MESSAGE, RC.UNKNOWN_FAIL_DESC);
        }
        entity = new ResponseEntity(resp, headers, HttpStatus.OK);
        return entity;
    }
    
    @RequestMapping(value = "/list-partner", method = {RequestMethod.GET})
    public ResponseEntity<?> getListPartner() {
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            List<Partner> results = partnerRepository.findByApproval(true);
            resp.put(RF.RESULTS, results);
            resp.put(RF.RESPONSE_CODE, RC.SUCCESS);
            resp.put(RF.RESPONSE_MESSAGE, RC.SUCCESS_DESC);
        } catch (Exception ex) {
            resp.put(RF.RESPONSE_CODE, RC.UNKNOWN_FAIL);
            resp.put(RF.RESPONSE_MESSAGE, RC.UNKNOWN_FAIL_DESC);
            errorLogger.error(ex.getMessage(), ex);
        }
        entity = new ResponseEntity(resp, headers, HttpStatus.OK);

        return entity;
    }
    
    
}

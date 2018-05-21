/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fwd.backend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author hendrara
 */
@Controller
public class DefaultController {
    
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        return "login";
    }
    
    @RequestMapping(value = "/admin", method = RequestMethod.GET)
    public String index() {
      return "admin/content";
    }
    
    @RequestMapping(value = "/admin/user-content-panel", method = RequestMethod.GET)
    public String adminuserscontentpanel() {
        return "admin/user-content-panel";
    }
    
    @RequestMapping(value = "/admin/menu-content-panel", method = RequestMethod.GET)
    public String adminmenucontentpanel() {
        return "admin/menu-content-panel";
    }
    
    @RequestMapping(value = "/admin/customer-content-panel", method = RequestMethod.GET)
    public String admincustomercontentpanel() {
        return "admin/customer-content-panel";
    }
    
    @RequestMapping(value = "/admin/partner-content-panel", method = RequestMethod.GET)
    public String adminpartnercontentpanel() {
        return "admin/partner-content-panel";
    }
    
}

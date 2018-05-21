package com.fwd.backend.controllers;

import com.fwd.backend.domain.Customer;
import com.fwd.backend.domain.Menu;
import com.fwd.backend.repository.MenuRepository;
import com.fwd.backend.util.ImageUtil;
import com.fwd.backend.util.RC;
import com.fwd.backend.util.RF;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.RandomStringUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author rizad
 *
 */
@RestController
@RequestMapping("/api")
public class MenuAdministrationController {

    public final static String MENU_IMAGE_PATH = "image/";

    @Autowired
    Environment environment;
    
    @Autowired
    MenuRepository menuRepository;

    @RequestMapping(value = "/menucustom", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addMenu(@RequestBody Menu request) {
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            if (request.getImagePath() != null && !request.getImagePath().isEmpty()) {
                String pathHeader = MENU_IMAGE_PATH + RandomStringUtils.randomAlphanumeric(10) + "."
                        + ImageUtil.UPLOAD_IMAGE_TYPE;
                ImageUtil.createImage(request.getImagePath(), pathHeader);
                request.setImagePath(pathHeader);
            }

            menuRepository.save(request);
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

    @RequestMapping(value = "/menucustom/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> editMenu(@PathVariable("id") Long id, @RequestBody Menu request) {

        Menu menu = menuRepository.findOne(id);
        if (menu.getImagePath() != null && !menu.getImagePath().isEmpty() && request.isImagePathChanged()) {
            String pathImageHeader = environment.getProperty("fwd.path.image") + menu.getImagePath();
            ImageUtil.deleteFile(pathImageHeader);
        }

        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            if (request.getImagePath() != null && !request.getImagePath().isEmpty() && request.isImagePathChanged()) {
                String pathHeader = MENU_IMAGE_PATH + RandomStringUtils.randomAlphanumeric(10) + "."
                        + ImageUtil.UPLOAD_IMAGE_TYPE;
                ImageUtil.createImage(request.getImagePath(), pathHeader);
                request.setImagePath(pathHeader);
            } else {
                request.setImagePath(menu.getImagePath());
            }

            menuRepository.save(request);
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

    @RequestMapping(value = "/menucustom/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteMenu(@PathVariable("id") Long id) {

        Menu menu = menuRepository.findOne(id);
        if (menu.getImagePath() != null && !menu.getImagePath().isEmpty()) {
            String pathImageHeader = environment.getProperty("fwd.path.image") + menu.getImagePath();
            ImageUtil.deleteFile(pathImageHeader);
        }

        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            menuRepository.delete(id);
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
}

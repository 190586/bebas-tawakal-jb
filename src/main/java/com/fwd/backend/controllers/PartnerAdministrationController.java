package com.fwd.backend.controllers;

import static com.fwd.backend.controllers.MenuAdministrationController.MENU_IMAGE_PATH;
import com.fwd.backend.domain.Menu;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fwd.backend.domain.Partner;
import com.fwd.backend.repository.PartnerRepository;
import com.fwd.backend.util.ImageUtil;
import com.fwd.backend.util.RC;
import com.fwd.backend.util.RF;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author rizad
 *
 */
@RestController
@RequestMapping("/api")
public class PartnerAdministrationController {

    @Autowired
    private PartnerRepository partnerRepository;

    @RequestMapping(value = "/partnercustom", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addPartner(@RequestBody Partner request) {
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            if (request.getAvatarPath() != null && !request.getAvatarPath().isEmpty()) {
                String pathHeader = MENU_IMAGE_PATH + RandomStringUtils.randomAlphanumeric(10) + "."
                        + ImageUtil.UPLOAD_IMAGE_TYPE;
                ImageUtil.createImage(request.getAvatarPath(), pathHeader);
                request.setAvatarPath(pathHeader);
            }

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

    @RequestMapping(value = "/partnercustom/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> editMenu(@PathVariable("id") Long id, @RequestBody Partner request) {

        Partner partner = partnerRepository.findOne(id);
        if (partner.getAvatarPath() != null && !partner.getAvatarPath().isEmpty() && request.isAvatarPathChanged()) {
            String pathImageHeader = ImageUtil.PATH_UPLOAD + partner.getAvatarPath();
            ImageUtil.deleteFile(pathImageHeader);
        }

        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            if (request.getAvatarPath() != null && !request.getAvatarPath().isEmpty() && request.isAvatarPathChanged()) {
                String pathHeader = MENU_IMAGE_PATH + RandomStringUtils.randomAlphanumeric(10) + "."
                        + ImageUtil.UPLOAD_IMAGE_TYPE;
                ImageUtil.createImage(request.getAvatarPath(), pathHeader);
                request.setAvatarPath(pathHeader);
            } else {
                request.setAvatarPath(partner.getAvatarPath());
            }

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

    @RequestMapping(value = "/partnercustom/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteMenu(@PathVariable("id") Long id) {

        Partner partner = partnerRepository.findOne(id);
        if (partner.getAvatarPath() != null && !partner.getAvatarPath().isEmpty()) {
            String pathImageHeader = ImageUtil.PATH_UPLOAD + partner.getAvatarPath();
            ImageUtil.deleteFile(pathImageHeader);
        }

        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            partnerRepository.delete(id);
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

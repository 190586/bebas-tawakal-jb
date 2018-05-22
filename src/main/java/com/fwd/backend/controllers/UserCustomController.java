package com.fwd.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import java.security.Principal;
import com.fwd.backend.domain.User;
import com.fwd.backend.repository.UserRepository;
import com.fwd.backend.service.UserService;
import com.fwd.backend.util.RC;
import com.fwd.backend.util.RF;
import com.fwd.backend.util.ImageUtil;
import org.springframework.core.env.Environment;

@Controller
@RequestMapping("/api")
public class UserCustomController {

    public final static String AVATAR_IMAGE_PATH = "avatar/";
    public final static String PAGES_ICON_PATH = "icon/";
    
    @Autowired
    Environment environment;
    
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;
    
    @Autowired
    PasswordEncoder passwordEncoder;
    
    @RequestMapping(value = "/usercustom/view", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> viewUser(Principal principal) {
        String username = principal.getName();
        User user = userService.findActiveUserByUsername(username);
        user.setPassword("");
        user.setIdUser(Long.parseLong("0"));
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            resp.put(RF.RESULTS, user);
            resp.put(RF.RESPONSE_CODE, RC.SUCCESS);
            resp.put(RF.RESPONSE_MESSAGE, RC.SUCCESS_DESC);
        } catch (Exception ex) {
            resp.put(RF.RESPONSE_CODE, RC.UNKNOWN_FAIL);
            resp.put(RF.RESPONSE_MESSAGE, RC.UNKNOWN_FAIL_DESC);
        }
        entity = new ResponseEntity(resp, headers, HttpStatus.OK);
        return entity;
    }

    @RequestMapping(value = "/usercustom", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addUser(@RequestBody User request) {
        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            if (request.getAvatarPath() != null && !request.getAvatarPath().isEmpty()) {
                String pathAvatar = AVATAR_IMAGE_PATH + RandomStringUtils.randomAlphanumeric(10) + "."
                        + ImageUtil.UPLOAD_IMAGE_TYPE;
                ImageUtil.createImage(request.getAvatarPath(), pathAvatar);
                request.setAvatarPath(pathAvatar);
            }
            if(!request.getPassword().equals(""))
                request.setPassword(passwordEncoder.encode(request.getPassword()));

            userService.save(request);
            boolean success = true;
            resp.put(RF.RESULTS, success);
            resp.put(RF.RESPONSE_CODE, RC.SUCCESS);
            resp.put(RF.RESPONSE_MESSAGE, RC.SUCCESS_DESC);
        } catch (Exception ex) {
            ex.printStackTrace();
            resp.put(RF.RESPONSE_CODE, RC.UNKNOWN_FAIL);
            resp.put(RF.RESPONSE_MESSAGE, RC.UNKNOWN_FAIL_DESC);
        }
        entity = new ResponseEntity(resp, headers, HttpStatus.OK);
        return entity;
    }

    @RequestMapping(value = "/usercustom/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> editUser(@PathVariable("id") Long id, @RequestBody User request) {

        User user = userRepository.findOne(id);

        if (user.getAvatarPath() != null && !user.getAvatarPath().isEmpty() && request.isAvatarChanged()) {
            String pathIcons = environment.getProperty("fwd.path.image") + user.getAvatarPath();
            //delete image existing
            ImageUtil.deleteFile(pathIcons);
        }

        ResponseEntity<?> entity = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, Object> resp = new HashMap();
        try {
            if (request.getAvatarPath() != null && !request.getAvatarPath().isEmpty() && request.isAvatarChanged()) {
                String pathAvatar = AVATAR_IMAGE_PATH + RandomStringUtils.randomAlphanumeric(10) + "."
                        + ImageUtil.UPLOAD_IMAGE_TYPE;
                ImageUtil.createImage(request.getAvatarPath(), pathAvatar);
                request.setAvatarPath(pathAvatar);
            }
            if (request.getPassword().equalsIgnoreCase("*******")) {
                request.setPassword(user.getPassword());
            } else {
                if(!request.getPassword().equals(""))
                request.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            userService.save(request);
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

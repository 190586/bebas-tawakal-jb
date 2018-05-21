package com.fwd.backend.controllers;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
//import com.fwd.util.GlobalValue;

@Controller
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private Environment environment;

    @RequestMapping(value = "/images", method = RequestMethod.GET)
    public void showImage(@RequestParam(value = "path", required = true) String path, HttpServletResponse response) throws Exception {

        ByteArrayOutputStream jpegOutputStream = new ByteArrayOutputStream();
        String fullpath = environment.getProperty("fwd.path.image") + path;
        try {
            System.out.println("read image "+ fullpath);
            BufferedImage image = ImageIO.read(new File(fullpath));
            ImageIO.write(image, "png", jpegOutputStream);
        } catch (IllegalArgumentException e) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
        byte[] imgByte = jpegOutputStream.toByteArray();
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("image/png");
        ServletOutputStream responseOutputStream = response.getOutputStream();
        responseOutputStream.write(imgByte);
        responseOutputStream.flush();
        responseOutputStream.close();
    }

}

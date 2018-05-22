package com.fwd.backend.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;
import javax.xml.bind.DatatypeConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import sun.misc.BASE64Decoder;

public class ImageUtil {

    @Autowired
    private static Environment environment;

    public static String UPLOAD_IMAGE_TYPE = "png";

    public static void createImage(String image, String filename) {
        String fileType = UPLOAD_IMAGE_TYPE;
//        String path = environment.getProperty("fwd.path.image");
        String path = GlobalValue.PATH_IMAGE;
        try {
            BufferedImage bufImg = decodeToImage(image);
            File imgOutFile = new File(path + filename);
            ImageIO.write(bufImg, fileType, imgOutFile);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static BufferedImage decodeToImage(String imageString) {
        BufferedImage image = null;
        byte[] imageByte;
        try {
            BASE64Decoder decoder = new BASE64Decoder();
            imageByte = decoder.decodeBuffer(imageString);
            ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
            image = ImageIO.read(bis);
            bis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return image;
    }

    public static void deleteFile(String pathFile) {
        System.out.println("Path Filename " + pathFile);
        try {
            File file = new File(pathFile);
            if (file.delete()) {
                System.out.println(file.getName() + " is deleted!");
            } else {
                System.out.println("Delete operation is failed.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

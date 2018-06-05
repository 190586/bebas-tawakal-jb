package com.fwd.backend.domain;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import lombok.Data;

/**
 * Entity for menu table
 *
 * @author moe
 *
 */
@Data
@Entity
public class Menu {

    public static final String HOME_SLIDER_TYPE = "HOME-SLIDER";
    public static final String FIRST_MENU_TYPE = "FIRST-MENU";
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_menu")
    private Long id;

    @Column(name = "button_text", length = 255)
    private String buttonText;

    private Boolean active;

    @Column(name = "data_href")
    private Boolean dataHref;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "start_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;

    @Column(name = "end_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;

    @Column(name = "image_path", length = 100)
    private String imagePath;

    @Transient
    private boolean imagePathChanged = false;
    
    @Transient
    private String iconPath;
    
    @Column(name = "orders")
    private int orders;

    @Column(name = "short_description", length = 1000)
    private String shortDescription;

    @Column(name = "title", length = 100)
    private String title;

    @Column(name = "type", length = 30)
    private String type;

    @Column(name = "url", length = 100)
    private String url;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getButtonText() {
        return buttonText;
    }

    public void setButtonText(String buttonText) {
        this.buttonText = buttonText;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getDataHref() {
        return dataHref;
    }

    public void setDataHref(Boolean dataHref) {
        this.dataHref = dataHref;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public boolean isImagePathChanged() {
        return imagePathChanged;
    }

    public void setImagePathChanged(boolean imagePathChanged) {
        this.imagePathChanged = imagePathChanged;
    }
    
    public String getIconPath() {
        return iconPath;
    }

    public void setIconPath(String iconPath) {
        this.iconPath = iconPath;
    }

    public int getOrders() {
        return orders;
    }

    public void setOrders(int orders) {
        this.orders = orders;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    
    
}

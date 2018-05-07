package com.fwd.backend.domain;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;

/**
 * Entity for department table
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

	@Column(name = "button_text", length=255)
	private String buttonText;
        
        private Boolean active;
        
        @Column(name = "data_href")
        private Boolean dataHref;
        
        @Column(name = "description", length=1000)
	private String description;
        
        
        @Column(name = "start_time")
        @Temporal(TemporalType.TIMESTAMP)
	private Date startTime;
        
        
        @Column(name = "end_time")
        @Temporal(TemporalType.TIMESTAMP)
	private Date endTime;
        
        @Column(name = "image_path", length=100)
	private String imagePath;
        
        @Column(name = "orders")
	private int orders;
        
        @Column(name = "short_description", length=1000)
	private String shortDescription;
        
        @Column(name = "title", length=100)
	private String title;
        
        @Column(name = "type", length=30)
	private String type;
        
        @Column(name = "url", length=100)
	private String url;
}

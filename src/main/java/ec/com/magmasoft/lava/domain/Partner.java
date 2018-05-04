package ec.com.magmasoft.lava.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

/**
 * Entity for department table
 * 
 * @author moe
 *
 */
@Data
@Entity
public class Partner {

	@Id
        @Column(name = "id_partner")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

        @Column(name = "address", length=255)
	private String address;
        
        @Column(name = "approval")
	private Boolean approval;
        
        @Column(name = "avatar_path", length=255)
	private String avatarPath;
        
        @Column(name = "company_name", length=100)
	private String companyName;
        
        @Column(name = "email", length=100)
	private String email;
        
        @Column(name = "name", length=100)
	private String name;
         
        @Column(name = "partner_type", length=100)
	private String partnerType;
         
        @Column(name = "phone", length=20)
	private String phone;
        
        @Column(name = "phone_2", length=20)
	private String phone2;
         
        @Column(name = "content", length=1000)
	private String content;
        
        

}

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
public class Customer {

	@Id
        @Column(name = "id_customer")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Boolean approval;
        
        @Column(name = "avatar_path", length=255)
	private String avatarPath;
        
         @Column(name = "email", length=100)
	private String email;
         
        @Column(name = "name", length=100)
	private String name;
        
        @Column(name = "phone", length=20)
	private String phone;

}

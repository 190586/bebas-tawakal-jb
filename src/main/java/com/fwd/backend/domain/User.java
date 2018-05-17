package com.fwd.backend.domain;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;
import lombok.Data;

@Data
@Entity
public class User  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Long idUser;

    @Column(name = "password",length = 255)
    private String password;

    @Column(name = "role",length = 50)
    private String role;

    @Column(name = "avatar_path",length = 255)
    private String avatarPath;

    @Column(name = "username",length = 50)
    private String username;

    
    @Column(name = "fullname",length = 100)
    private String fullname;

    
    @Column(name = "active")
    private boolean active;
    
    @Transient
    private boolean avatarChanged = false;

    public User() {

    }

    public Long getIdUser() {
        return this.idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAvatarPath() {
        return this.avatarPath;
    }

    public void setAvatarPath(String avatarPath) {
        this.avatarPath = avatarPath;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isActive() {
        return this.active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public boolean isAvatarChanged() {
        return avatarChanged;
    }

    public void setAvatarChanged(boolean avatarChanged) {
        this.avatarChanged = avatarChanged;
    }

}

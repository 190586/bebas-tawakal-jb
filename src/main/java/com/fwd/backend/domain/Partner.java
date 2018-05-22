package com.fwd.backend.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

import lombok.Data;

/**
 * Entity for partner table
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

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "approval")
    private Boolean approval;

    @Column(name = "avatar_path", length = 255)
    private String avatarPath;
    
    @Transient
    private boolean avatarPathChanged = false;

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "partner_type", length = 100)
    private String partnerType;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "phone_2", length = 20)
    private String phone2;

    @Column(name = "content", length = 50000)
    private String content;
    
    @Column(name = "website", length = 300)
    private String website;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Boolean getApproval() {
        return approval;
    }

    public void setApproval(Boolean approval) {
        this.approval = approval;
    }

    public String getAvatarPath() {
        return avatarPath;
    }

    public void setAvatarPath(String avatarPath) {
        this.avatarPath = avatarPath;
    }

    public boolean isAvatarPathChanged() {
        return avatarPathChanged;
    }

    public void setAvatarPathChanged(boolean avatarPathChanged) {
        this.avatarPathChanged = avatarPathChanged;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPartnerType() {
        return partnerType;
    }

    public void setPartnerType(String partnerType) {
        this.partnerType = partnerType;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhone2() {
        return phone2;
    }

    public void setPhone2(String phone2) {
        this.phone2 = phone2;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    
    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

}

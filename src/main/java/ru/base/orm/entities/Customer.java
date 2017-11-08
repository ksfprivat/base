package ru.base.orm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;


@Entity
public class Customer {
    private int id;
    private String title;
    private String titleFull;
    private String department;
    private String post;
    private String city;
    private String street;
    private String building;
    private String district;
    private String inn;
    private String region;
    private Collection<Contact> contactsById;
    private Collection<Contract> contractsById;

    @Id
    @Column(name = "id", nullable = false)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "title", nullable = true, length = 255)
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Basic
    @Column(name = "titleFull", nullable = true, length = 255)
    public String getTitleFull() {
        return titleFull;
    }

    public void setTitleFull(String titleFull) {
        this.titleFull = titleFull;
    }

    @Basic
    @Column(name = "department", nullable = true, length = 255)
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Basic
    @Column(name = "post", nullable = true, length = 255)
    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    @Basic
    @Column(name = "city", nullable = true, length = 255)
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @Basic
    @Column(name = "street", nullable = true, length = 255)
    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    @Basic
    @Column(name = "building", nullable = true, length = 255)
    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    @Basic
    @Column(name = "district", nullable = true, length = 255)
    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    @Basic
    @Column(name = "INN", nullable = true, length = 255)
    public String getInn() {
        return inn;
    }

    public void setInn(String inn) {
        this.inn = inn;
    }

    @Basic
    @Column(name = "region", nullable = true, length = 255)
    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Customer customer = (Customer) o;

        if (id != customer.id) return false;
        if (title != null ? !title.equals(customer.title) : customer.title != null) return false;
        if (titleFull != null ? !titleFull.equals(customer.titleFull) : customer.titleFull != null) return false;
        if (department != null ? !department.equals(customer.department) : customer.department != null) return false;
        if (post != null ? !post.equals(customer.post) : customer.post != null) return false;
        if (city != null ? !city.equals(customer.city) : customer.city != null) return false;
        if (street != null ? !street.equals(customer.street) : customer.street != null) return false;
        if (building != null ? !building.equals(customer.building) : customer.building != null) return false;
        if (district != null ? !district.equals(customer.district) : customer.district != null) return false;
        if (inn != null ? !inn.equals(customer.inn) : customer.inn != null) return false;
        if (region != null ? !region.equals(customer.region) : customer.region != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (titleFull != null ? titleFull.hashCode() : 0);
        result = 31 * result + (department != null ? department.hashCode() : 0);
        result = 31 * result + (post != null ? post.hashCode() : 0);
        result = 31 * result + (city != null ? city.hashCode() : 0);
        result = 31 * result + (street != null ? street.hashCode() : 0);
        result = 31 * result + (building != null ? building.hashCode() : 0);
        result = 31 * result + (district != null ? district.hashCode() : 0);
        result = 31 * result + (inn != null ? inn.hashCode() : 0);
        result = 31 * result + (region != null ? region.hashCode() : 0);
        return result;
    }

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    public Collection<Contact> getContactsById() {
        return contactsById;
    }

    public void setContactsById(Collection<Contact> contactsById) {
        this.contactsById = contactsById;
    }

    @OneToMany(mappedBy = "customerByCustomerId")
    @JsonIgnore
    public Collection<Contract> getContractsById() {
        return contractsById;
    }

    public void setContractsById(Collection<Contract> contractsById) {
        this.contractsById = contractsById;
    }
}

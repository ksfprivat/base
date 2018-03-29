package ru.base.orm.entities;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;


@Entity
@Table(name = "contract")
public class Contract {
    private int id;
    private String title;
    private Date date;
    private Timestamp dateFinal;
    private String status;
    private Double amount;
    private String department;
    private String type;
    private Integer object;
    private Integer customerId;
    private Customer customerByCustomerId;

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
    @Column(name = "date", nullable = true)
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Basic
    @Column(name = "dateFinal", nullable = true)
    public Timestamp getDateFinal() {
        return dateFinal;
    }

    public void setDateFinal(Timestamp dateFinal) {
        this.dateFinal = dateFinal;
    }

    @Basic
    @Column(name = "status", nullable = true, length = 255)
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Basic
    @Column(name = "amount", nullable = true, precision = 4)
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
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
    @Column(name = "type", nullable = true, length = 255)
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Basic
    @Column(name = "object", nullable = true)
    public Integer getObject() {
        return object;
    }

    public void setObject(Integer object) {
        this.object = object;
    }

    @Basic
    @Column(name = "customer_id", nullable = true, insertable = false, updatable = false)
    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Contract contract = (Contract) o;

        if (id != contract.id) return false;
        if (title != null ? !title.equals(contract.title) : contract.title != null) return false;
        if (date != null ? !date.equals(contract.date) : contract.date != null) return false;
        if (dateFinal != null ? !dateFinal.equals(contract.dateFinal) : contract.dateFinal != null) return false;
        if (status != null ? !status.equals(contract.status) : contract.status != null) return false;
        if (amount != null ? !amount.equals(contract.amount) : contract.amount != null) return false;
        if (department != null ? !department.equals(contract.department) : contract.department != null) return false;
        if (type != null ? !type.equals(contract.type) : contract.type != null) return false;
        if (object != null ? !object.equals(contract.object) : contract.object != null) return false;
        if (customerId != null ? !customerId.equals(contract.customerId) : contract.customerId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (dateFinal != null ? dateFinal.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        result = 31 * result + (amount != null ? amount.hashCode() : 0);
        result = 31 * result + (department != null ? department.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (object != null ? object.hashCode() : 0);
        result = 31 * result + (customerId != null ? customerId.hashCode() : 0);
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    public Customer getCustomerByCustomerId() {
        return customerByCustomerId;
    }

    public void setCustomerByCustomerId(Customer customerByCustomerId) {
        this.customerByCustomerId = customerByCustomerId;
    }
}

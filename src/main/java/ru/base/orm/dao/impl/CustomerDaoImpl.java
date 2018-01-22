package ru.base.orm.dao.impl;

import ru.base.orm.dao.CustomerDao;
import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Contract;
import ru.base.orm.entities.Customer;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("CustomerDaoImpl")
public class CustomerDaoImpl implements CustomerDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Customer getCustomerById(int customerId) {
        return (Customer) sessionFactory.getCurrentSession().get(Customer.class, customerId);
    }

    @Override
    public Contact getContactById(int contactId) {
        return (Contact) sessionFactory.getCurrentSession().get(Contact.class, contactId);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Contact> getContacts() {
        return sessionFactory.getCurrentSession().createQuery("from Contact order by name").list();
    }

    @Override
    public Contract getContractById(int contractId) {
        return (Contract) sessionFactory.getCurrentSession().get(Contract.class, contractId);
    }

    @Override
    public Integer insertCustomer(Customer customer) {
        Integer id = (Integer) sessionFactory.getCurrentSession().save(customer);
        System.out.println("CUSTOMER_ID:"+id);
        return id;
    }

    @Override
    public void updateCustomer(Customer customer) {
        sessionFactory.getCurrentSession().update(customer);
    }

    @Override
    public void deleteCustomer(int customerId) {
        Customer customer = (Customer) sessionFactory.getCurrentSession().get(Customer.class, customerId);
        sessionFactory.getCurrentSession().delete(customer);
    }

    @Override
    public void insertContact(Contact contact) {
        sessionFactory.getCurrentSession().save(contact);
    }

    @Override
    public void updateContact(Contact contact) {
        sessionFactory.getCurrentSession().update(contact);
    }

    @Override
    public void deleteContact(Contact contact) {
        sessionFactory.getCurrentSession().delete(contact);
    }

    @Override
    public void insertContract(Contract contract) {
        sessionFactory.getCurrentSession().save(contract);
    }

    @Override
    public void deleteContract(Contract contract) {
        sessionFactory.getCurrentSession().delete(contract);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Customer> getCustomers() {
        return sessionFactory.getCurrentSession().createQuery("from Customer order by title").list();
    }

    @Override
    public List<Contact> getContactsById(int customerId) {
        Customer customer = (Customer) sessionFactory.getCurrentSession().get(Customer.class, customerId);
        return new ArrayList<Contact>(customer.getContactsById());
    }

    @Override
    public List<Contract> getContractsById(int customerId) {
        Customer customer = (Customer) sessionFactory.getCurrentSession().get(Customer.class, customerId);
        return new ArrayList<Contract>(customer.getContractsById());
    }

}

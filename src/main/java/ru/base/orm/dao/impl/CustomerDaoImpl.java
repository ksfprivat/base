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
    @SuppressWarnings("unchecked")
    public List<Contract> getContracts() {
        return sessionFactory.getCurrentSession().createQuery("from Contract order by title").list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Contract> getContractsByYear(int year) {
        return sessionFactory.getCurrentSession().createQuery("from Contract where date between '"+
                String.valueOf(year)+"/01/01' and '"+
                String.valueOf(year)+"/12/31' order by date").list();
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
    public Integer insertContact(Contact contact) {
        return (Integer) sessionFactory.getCurrentSession().save(contact);
    }

    @Override
    public void updateContact(Contact contact) {
        sessionFactory.getCurrentSession().update(contact);
    }

    @Override
    public void deleteContact(int contactId) {
        sessionFactory.getCurrentSession().delete(sessionFactory.getCurrentSession().get(Contact.class, contactId));
    }

    @Override
    public void insertContract(Contract contract) {
        sessionFactory.getCurrentSession().save(contract);
    }

    @Override
    public void deleteContract(int id) {
        sessionFactory.getCurrentSession().delete(sessionFactory.getCurrentSession().get(Contract.class, id));
    }

    @Override
    public void updateContract(Contract contract) {
        sessionFactory.getCurrentSession().update(contract);
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

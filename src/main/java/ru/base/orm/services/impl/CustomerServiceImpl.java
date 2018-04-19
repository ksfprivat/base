package ru.base.orm.services.impl;

import ru.base.orm.dao.CustomerDao;
import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Contract;
import ru.base.orm.entities.Customer;
import ru.base.orm.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("CustomerServiceImpl")
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerDao customerDAO;

    @Override
    @Transactional
    public Customer getCustomerById(int customerId) {
        return customerDAO.getCustomerById(customerId);
    }

    @Override
    @Transactional
    public Contact getContactById(int contactId) {
        return customerDAO.getContactById(contactId);
    }

    @Override
    @Transactional
    public Contract getContractById(int contractId) {
        return customerDAO.getContractById(contractId);
    }

    @Override
    @Transactional
    public Integer insertCustomer(Customer customer) {
        return customerDAO.insertCustomer(customer);
    }

    @Override
    @Transactional
    public void updateCustomer(Customer customer) {
        customerDAO.updateCustomer(customer);
    }

    @Override
    @Transactional
    public void deleteCustomer(int customerId) {
        customerDAO.deleteCustomer(customerId);
    }

    @Override
    @Transactional
    public Integer insertContact(Contact contact) {
        return customerDAO.insertContact(contact);
    }

    @Override
    @Transactional
    public void updateContact(Contact contact) {
        customerDAO.updateContact(contact);
    }

    @Override
    @Transactional
    public void deleteContact(int contactId) {
        customerDAO.deleteContact(contactId);
    }

    @Override
    @Transactional
    public Integer insertContract(Contract contract) {
       return customerDAO.insertContract(contract);
    }

    @Override
    @Transactional
    public void deleteContract(int id) {
        customerDAO.deleteContract(id);
    }

    @Override
    @Transactional
    public void updateContract(Contract contract) {
        customerDAO.updateContract(contract);
    }

    @Override
    @Transactional
    public List<Customer> getCustomers() {
        return customerDAO.getCustomers();
    }

    @Override
    @Transactional
    public List<Contact> getContacts() {
        return customerDAO.getContacts();
    }

    @Override
    @Transactional
    public List<Contract> getContracts() {
        return customerDAO.getContracts();
    }

    @Override
    @Transactional
    public List<Contract> getContractsByYear(int year) {
        return customerDAO.getContractsByYear(year);
    }

    @Override
    @Transactional
    public List<Contact> getContactsById(int customersId) {
        return customerDAO.getContactsById(customersId);
    }

    @Override
    @Transactional
    public List<Contract> getContractsById(int customerId) {
        return customerDAO.getContractsById(customerId);
    }
}

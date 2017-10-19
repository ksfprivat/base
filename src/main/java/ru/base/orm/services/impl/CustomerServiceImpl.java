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
    public void insertCustomer(Customer customer) {
        customerDAO.insertCustomer(customer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Customer customer) {
        customerDAO.deleteCustomer(customer);
    }

    @Override
    @Transactional
    public void insertContact(Contact contact) {
        customerDAO.insertContact(contact);
    }

    @Override
    @Transactional
    public void deleteContact(Contact contact) {
        customerDAO.deleteContact(contact);
    }

    @Override
    @Transactional
    public void insertContract(Contract contract) {
        customerDAO.insertContract(contract);
    }

    @Override
    @Transactional
    public void deleteContract(Contract contract) {
        customerDAO.deleteContract(contract);
    }

    @Override
    @Transactional
    public List<Customer> getCustomers() {
        return customerDAO.getCustomers();
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

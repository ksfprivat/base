package ru.base.orm.dao;

import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Contract;
import ru.base.orm.entities.Customer;

import java.util.List;


public interface CustomerDao {

    Customer getCustomerById(int customerId);

    Contact getContactById(int contactId);

    List<Contact> getContacts();

    Contract getContractById(int contractId);

    Integer insertCustomer(Customer customer);

    void updateCustomer(Customer customer);

    void deleteCustomer(int customerId);

    void insertContact(Contact contact);

    void updateContact(Contact contact);

    void deleteContact(Contact contact);

    void insertContract(Contract contract);

    void deleteContract(Contract contract);

    List<Customer> getCustomers();

    List<Contact> getContactsById(int customerId);

    List<Contract> getContractsById(int customerId);

}

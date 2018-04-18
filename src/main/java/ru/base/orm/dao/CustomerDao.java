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

    List<Contract> getContracts();
    List<Contract> getContractsByYear(int year);

    Integer insertCustomer(Customer customer);

    void updateCustomer(Customer customer);

    void deleteCustomer(int customerId);

    Integer insertContact(Contact contact);

    void updateContact(Contact contact);

    void deleteContact(int contactId);

    void insertContract(Contract contract);

    void deleteContract(int id);

    void updateContract(Contract contract);

    List<Customer> getCustomers();

    List<Contact> getContactsById(int customerId);

    List<Contract> getContractsById(int customerId);

}

package ru.base.orm.services;


import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Contract;
import ru.base.orm.entities.Customer;

import java.util.List;

public interface CustomerService {

    Customer getCustomerById(int customerId);

    Contact getContactById(int contactId);

    Contract getContractById(int contractId);

    Integer insertCustomer(Customer customer);

    void updateCustomer(Customer customer);

    void  deleteCustomer(int customerId);

    Integer insertContact(Contact contact);

    void updateContact(Contact contact);

    void deleteContact(int contactId);

    void insertContract(Contract contract);

    void deleteContract(Contract contract);

    void updateContract(Contract contract);

    List<Customer> getCustomers();

    List<Contact> getContacts();

    List<Contract> getContracts();

    List<Contact> getContactsById(int customersId);

    List<Contract> getContractsById(int customerId);

}

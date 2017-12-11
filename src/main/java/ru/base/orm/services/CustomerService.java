package ru.base.orm.services;


import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Contract;
import ru.base.orm.entities.Customer;

import java.util.List;

public interface CustomerService {

    Customer getCustomerById(int customerId);

    Contact getContactById(int contactId);

    Contract getContractById(int contractId);

    void  insertCustomer(Customer customer);

    void  deleteCustomer(Customer customer);

    void insertContact(Contact contact);

    void deleteContact(Contact contact);

    void  insertContract(Contract contract);

    void deleteContract(Contract contract);

    List<Customer> getCustomers();

    List<Contact> getContacts();

    List<Contact> getContactsById(int customersId);

    List<Contract> getContractsById(int customerId);

}

package ru.base.utils.datasourceTest;


import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Contract;
import ru.base.orm.entities.Customer;
import ru.base.orm.services.CustomerService;

import java.util.ArrayList;
import java.util.List;

public class DatasourceInsertTest {

    public static void main(String[] args) {
        System.out.println("Datasource Delete test");

        ApplicationContext ctx =
                new ClassPathXmlApplicationContext("dataSource.xml");

        CustomerService customerService =
                (CustomerService) ctx.getBean("CustomerServiceImpl");

//      Insert new Customer
//        Customer customer = new Customer();
//        customer.setTitle("Yandex");
//        customer.setCity("Moscow");

//      Insert new Contact
        Contact contact = new Contact();
        contact.setName("Bobuk2");
        contact.setCustomer(customerService.getCustomerById(809));

//      Insert new Contract
//        Contract contract = new Contract();
//        contract.setTitle("ZZZ BT/17");
//        contract.setCustomerByCustomer(customerService.getCustomerById(810));

        try {
//            customerService.insertCustomer(customer);
            customerService.insertContact(contact);
//            customerService.insertContract(contract);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }
}

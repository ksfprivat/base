package ru.base.utils.datasourceTest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Contract;
import ru.base.orm.entities.Customer;
import ru.base.orm.services.CustomerService;

import java.util.List;

public class DatasourceSelectTest {


    public static void main(String[] args) {

        System.out.println("Datasource read test");
        ApplicationContext ctx =
                new ClassPathXmlApplicationContext("dataSource.xml");

        CustomerService customerService =
                (CustomerService) ctx.getBean("CustomerServiceImpl");

        List<Customer> customers = customerService.getCustomers();

        for (Customer customer : customers) {
            System.out.println(customer.getId()+"\t"+customer.getTitle());

//            List<Contact> contacts = customerService.getContactsById(customer.getId());
//            for (Contact contact : contacts)
//                System.out.println("\t"+contact.getId()+"\t"+contact.getName());
            List<Contract> contracts = customerService.getContractsById(customer.getId());
            for (Contract contract : contracts)
                System.out.println("\t"+contract.getId()+"\t"+contract.getTitle()+"\t"+contract.getDate());
        }

    }
}


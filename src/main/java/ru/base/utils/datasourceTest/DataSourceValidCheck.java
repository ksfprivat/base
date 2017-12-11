package ru.base.utils.datasourceTest;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import ru.base.orm.entities.Contact;
import ru.base.orm.services.CustomerService;

import java.util.List;


public class DataSourceValidCheck {

    public static void main(String args[]) {

        ApplicationContext ctx =
                new ClassPathXmlApplicationContext("dataSource.xml");

        CustomerService customerService =
                (CustomerService) ctx.getBean("CustomerServiceImpl");

        List<Contact> contacts = customerService.getContacts();

        for (Contact contact: contacts) {
//            customerService.deleteContact(customerService.getContactById(2881));
            System.out.println(contact.getName()+":"+contact.getCustomer().getTitle());
//            try {
//                System.out.println(contact.getName()+":"+contact.getCustomer().getTitle());
//            } catch (Exception e) {
//                System.out.println(contact.getId()+":"+contact.getName()+":\t\t\tERROR");
////                customerService.deleteContact(customerService.getContactById(2881));
//            }


        }


    }
}

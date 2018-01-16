package ru.base.utils.datasourceTest;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import ru.base.orm.services.CustomerService;



public class DatasourceDeleteTest {
    public static void main(String[] args) {
        System.out.println("Datasource Delete test");

        ApplicationContext ctx =
                new ClassPathXmlApplicationContext("dataSource.xml");

        CustomerService customerService =
                (CustomerService) ctx.getBean("CustomerServiceImpl");


        try {
//            customerService.deleteCustomer(customerService.getCustomerById(810));
//            customerService.deleteContact(customerService.getContactById(2883));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }
}

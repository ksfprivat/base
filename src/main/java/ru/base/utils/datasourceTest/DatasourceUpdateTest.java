package ru.base.utils.datasourceTest;


import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import ru.base.orm.entities.Customer;
import ru.base.orm.services.CustomerService;

public class DatasourceUpdateTest {
    public static void main(String args[]) {
        ApplicationContext ctx =
                new ClassPathXmlApplicationContext("dataSource.xml");

        CustomerService customerService =
                (CustomerService) ctx.getBean("CustomerServiceImpl");
        System.out.println("Data update test");
        Customer customer = customerService.getCustomerById(730);

     //   customer.setTitle("Anna2");

      //  customerService.updateCustomer(customer);

        System.out.println(customer.getTitle());

    }
}

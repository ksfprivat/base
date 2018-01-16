package ru.base.controllers.REST;

import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.base.controllers.nodes.ContactNode;
import ru.base.controllers.nodes.CustomerNode;
import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Customer;
import ru.base.orm.services.CustomerService;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @RequestMapping(value = "getCustomerById", method = RequestMethod.GET)
    @ResponseBody
    public Customer getCustomerById(@RequestParam(value = "id") int id) {
        return customerService.getCustomerById(id);
    }

    @RequestMapping(value = "getCustomers", method = RequestMethod.POST)
    @ResponseBody
    public List<Customer> getCustomers() {
        return customerService.getCustomers();
    }

    @RequestMapping(value = "getCustomerNodes", method = RequestMethod.POST)
    @ResponseBody
    public List<CustomerNode> getCustomerNodes() {

        List<Customer> customers = customerService.getCustomers();
        List<CustomerNode> customerNodes = new ArrayList<CustomerNode>();

        for (Customer customer: customers) {
            customerNodes.add(new CustomerNode(customer.getId(), customer.getTitle()));
        }
        return customerNodes;
    }

    @RequestMapping(value = "updateCustomer", method = RequestMethod.GET)
    @ResponseBody
    public void updateCustomer(Customer customer) {
        customerService.updateCustomer(customer);
    }

    @RequestMapping(value = "insertCustomer", method = RequestMethod.GET)
    @ResponseBody
    public void insertCustomer(Customer customer) { customerService.insertCustomer(customer);}

    @RequestMapping(value = "deleteCustomer", method = RequestMethod.GET)
    @ResponseBody
    public void deleteCustomer(@RequestParam(value = "customerId") int customerId) {customerService.deleteCustomer(customerId);}
}


package ru.base.controllers.REST;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.base.controllers.nodes.CustomerNode;
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

}

package ru.base.controllers.REST;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.base.orm.entities.Contact;
import ru.base.orm.services.CustomerService;

import java.util.List;

@Controller
@RequestMapping("/")
public class ContactController {

   @Autowired
   private CustomerService customerService;

   @RequestMapping(value = "getContactsByCustomerId", method = RequestMethod.GET)
   @ResponseBody
   public List<Contact> getContactsByCustomerId() {
       return customerService.getContactsById(232);
   }

}

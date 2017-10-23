package ru.base.controllers.REST;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.base.controllers.nodes.ContactNode;
import ru.base.orm.entities.Contact;
import ru.base.orm.services.CustomerService;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/")
public class ContactController {

   @Autowired
   private CustomerService customerService;

   @RequestMapping(value = "getContactsByCustomerId", method = RequestMethod.POST)
   @ResponseBody
   public List<Contact> getContactsByCustomerId(@RequestParam(value = "id") int customerId) {
       return customerService.getContactsById(customerId);
   }

   @RequestMapping(value = "getContactNodesByCustomerId", method = RequestMethod.POST)
   @ResponseBody
   public List<ContactNode> getContactNodesByCustomerId(@RequestParam(value = "id") int customerId) {

      List<Contact> contacts = customerService.getContactsById(customerId);
      List<ContactNode> contactNodes = new ArrayList<ContactNode>();

      for (Contact contact: contacts) {
         contactNodes.add(new ContactNode(contact.getId(), contact.getName()));
      }

      return contactNodes;
   }
}

package ru.base.controllers.REST;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.base.controllers.items.ContactListItem;
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


   @RequestMapping(value = "getContactById", method = RequestMethod.GET)
   @ResponseBody
   public Contact getCustomerById(@RequestParam(value = "id") int id) {
        return customerService.getContactById(id);
    }

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

   @RequestMapping(value = "getAllContactsNodes", method = RequestMethod.POST)
   @ResponseBody
   public List<ContactListItem> getAllContactsNodes() {
      List<Contact> contacts = customerService.getContacts();
      List<ContactListItem> contactListItems = new ArrayList<ContactListItem>();

      for (Contact contact: contacts) {
          if (!contact.getName().equals(""))
                contactListItems.add(
                        new ContactListItem(contact.getId(), contact.getCustomerId(), contact.getName(),
                                contact.getPosition(), contact.getCustomer().getTitle()));
      }

      return contactListItems;
   }


    @RequestMapping(value = "updateContact", method = RequestMethod.GET)
    @ResponseBody
    void updateContact(Contact contact) {
        contact.setCustomer(customerService.getCustomerById(contact.getCustomerId()));
        customerService.updateContact(contact);
    }

    @RequestMapping(value = "deleteContact", method = RequestMethod.GET)
    @ResponseBody
    void deleteContact(@RequestParam(value = "contactId") int contactId) {
       customerService.deleteContact(contactId);
    }


    @RequestMapping(value = "insertContact", method = RequestMethod.GET)
    @ResponseBody
    Integer insertContact(Contact contact) {
       contact.setCustomer(customerService.getCustomerById(contact.getCustomerId()));
       return customerService.insertContact(contact);
    }
}

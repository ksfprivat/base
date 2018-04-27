package ru.base.controllers.REST;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.base.controllers.nodes.ContractNode;
import ru.base.orm.entities.Contact;
import ru.base.orm.entities.Contract;
import ru.base.orm.services.CustomerService;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/")
public class ContractController {

    @Autowired
    CustomerService customerService;

    @RequestMapping(value = "getContractsByCustomerId", method = RequestMethod.POST)
    @ResponseBody
    public List<Contract> getContractsByCustomerId(@RequestParam(value = "id") int customerId) {
        return customerService.getContractsById(customerId);
    }

    @RequestMapping(value = "getContractNodesByCustomerId", method = RequestMethod.POST)
    @ResponseBody
    public List<ContractNode> getContractNodeByCustomerId(@RequestParam(value = "id") int customerId) {
        List<Contract> contracts = customerService.getContractsById(customerId);
        List<ContractNode> contractNodes = new ArrayList<ContractNode>();
        DateFormat df = new SimpleDateFormat("yyyy.MM.dd");
        for (Contract contract : contracts) {
            contractNodes.add(new ContractNode(contract.getId(), contract.getTitle(), df.format(contract.getDate())));
        }
        return contractNodes;
    }
    
    private int parseContractNumber(String value) {
        StringBuilder resultStr = new StringBuilder();
        if ((value.charAt(0) + "").equals("0")) return 0;
        for (int i = 0; i < value.length(); i++) {
            if (Character.isDigit(value.charAt(i)))
                resultStr.append(value.charAt(i));
            else break;
        }
        return (resultStr.length() > 0) ? Integer.parseInt(resultStr.toString()) : 0;
    }

    @RequestMapping(value = "getNewContractNumber", method = RequestMethod.GET)
    @ResponseBody
    public int getNewContractNumber(@RequestParam(value = "year") int year) {
        List<Contract> contracts = customerService.getContractsByYear(year);
        int result = 0, contractNumber;

        for (Contract contract : contracts) {
            contractNumber = parseContractNumber(contract.getTitle());
            if (result < contractNumber) result = contractNumber;

        }
        return result + 1;
    }

    @RequestMapping(value = "updateContract", method = RequestMethod.GET)
    @ResponseBody
    void updateContract(Contract contract) {
        System.out.println(contract.getTitle());
        contract.setCustomerByCustomerId(customerService.getCustomerById(contract.getCustomerId()));
        customerService.updateContract(contract);
    }

    @RequestMapping(value = "deleteContract", method = RequestMethod.GET)
    @ResponseBody
    void deleteContract(@RequestParam(value = "id") int id) {
        customerService.deleteContract(id);
    }


    @RequestMapping(value = "insertContract", method = RequestMethod.GET)
    @ResponseBody
    Integer insertContact(Contract contract) {
        System.out.println("Controller:"+contract.getTitle());
        contract.setCustomerByCustomerId(customerService.getCustomerById(contract.getCustomerId()));
        return customerService.insertContract(contract);
    }
}


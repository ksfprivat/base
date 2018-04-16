package ru.base.controllers.REST;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.base.controllers.nodes.ContractNode;
import ru.base.orm.entities.Contract;
import ru.base.orm.services.CustomerService;

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

        for (Contract contract : contracts) {
            contractNodes.add(new ContractNode(contract.getId(), contract.getTitle()));
        }

        return contractNodes;
    }

    @RequestMapping(value = "updateContract", method = RequestMethod.GET)
    @ResponseBody
    void updateContract(Contract contract) {
//        contract.setCustomerByCustomerId(customerService.getCustomerById(contract.getCustomerId()));
//        customerService.updateContract(contract);
        System.out.println("In update controller:"+contract.getDate());
    }
}

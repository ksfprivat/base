package ru.base.utils.datasourceTest;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import ru.base.orm.entities.Contract;
import ru.base.orm.services.CustomerService;


import java.util.ArrayList;
import java.util.List;

public class ContractTitleGenerator {
    public static void main(String args[]) {

        System.out.println("Contract title generator");

        ApplicationContext ctx =
                new ClassPathXmlApplicationContext("dataSource.xml");

        CustomerService customerService =
                (CustomerService) ctx.getBean("CustomerServiceImpl");

        List<Contract> contracts = customerService.getContractsByYear(2015);
        int newContractNumber = 0;
        int contractNumber;
        List<Integer> numbers = new ArrayList<Integer>();

        for (Contract contract : contracts) {
            contractNumber = parseContractNumber(contract.getTitle());
            if (contractNumber > newContractNumber) newContractNumber = contractNumber;
            if (contractNumber != 0) {
                numbers.add(contractNumber);
                System.out.println(contract.getTitle());
            }
        }
        System.out.println(newContractNumber+1);
    }

      private static int parseContractNumber(String value) {
        StringBuilder resultStr = new StringBuilder();
        if ((value.charAt(0) + "").equals("0")) return 0;
        for (int i = 0; i < value.length();i++) {
            if (Character.isDigit(value.charAt(i)))
                resultStr.append(value.charAt(i));
            else break;
        }
        return (resultStr.length() > 0) ? Integer.parseInt(resultStr.toString()) : 0;
    }
}

package com.fwd.backend.controllers;

import com.fwd.backend.domain.Customer;
import com.fwd.backend.domain.Partner;
import com.fwd.backend.repository.CustomerRepository;
import com.fwd.backend.repository.PartnerRepository;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;
import org.jxls.template.SimpleExporter;

@Controller
@RequestMapping({"/api"})
public class ExportController {

    @Autowired
    CustomerRepository customerRepository;
    
    @Autowired
    PartnerRepository partnerRepository;

    /**
     * Handle request to download an XLS document
     */
    @RequestMapping(value = "/export/customer/xls", method = RequestMethod.GET)
    public void downloadCustomerExcel(HttpServletResponse response) {
        SimpleDateFormat sdf = new SimpleDateFormat("YYYYMMdd");
        Iterable<Customer> customers = customerRepository.findAll();
        Iterable<String> headers = Arrays.asList("Name", "Email", "Phone", "Approval");
        try {
            response.addHeader("Content-disposition", "attachment; filename=customer_" + sdf.format(new Date()) + ".xls");
            response.setContentType("application/vnd.ms-excel");
            new SimpleExporter().gridExport(headers, customers, "name, email, phone, approval, ", response.getOutputStream());
            response.flushBuffer();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Handle request to download an CSV document
     *
     * @param response
     */
    @RequestMapping(value = "/export/customer/csv", method = RequestMethod.GET)
    public void downloadCustomerCsv(HttpServletResponse response) {
        SimpleDateFormat sdf = new SimpleDateFormat("YYYYMMdd");
        response.setHeader("Content-Disposition", "attachment; filename=customer_" + sdf.format(new Date()) + ".csv");
        response.setContentType("text/csv");

        try {
            Iterable<Customer> customers = customerRepository.findAll();
            String[] header = {"Name", "Email", "Phone", "Approval"};
            ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

            csvWriter.writeHeader(header);

            for (Customer customer : customers) {
                csvWriter.write(customer, header);
            }
            csvWriter.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Handle request to download an XLS document
     */
    @RequestMapping(value = "/export/partner/xls", method = RequestMethod.GET)
    public void downloadPartnerExcel(HttpServletResponse response) {
        SimpleDateFormat sdf = new SimpleDateFormat("YYYYMMdd");
        Iterable<Partner> partners = partnerRepository.findAll();
        Iterable<String> headers = Arrays.asList("Company Name", "Email", "PIC Name", "Phone", "Address", "Content", "Website", "Approval");
        try {
            response.addHeader("Content-disposition", "attachment; filename=partner_" + sdf.format(new Date()) + ".xls");
            response.setContentType("application/vnd.ms-excel");
            new SimpleExporter().gridExport(headers, partners, "companyName, email, name, phone, address, content, website, approval, ", response.getOutputStream());
            response.flushBuffer();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Handle request to download an CSV document
     *
     * @param response
     */
    @RequestMapping(value = "/export/partner/csv", method = RequestMethod.GET)
    public void downloadPartnerCsv(HttpServletResponse response) {
        SimpleDateFormat sdf = new SimpleDateFormat("YYYYMMdd");
        response.setHeader("Content-Disposition", "attachment; filename=partner_" + sdf.format(new Date()) + ".csv");
        response.setContentType("text/csv");

        try {
            Iterable<Partner> partners = partnerRepository.findAll();
            String[] header = {"CompanyName", "Email", "Name", "Phone", "Address", "Content", "Website", "Approval"};
            ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

            csvWriter.writeHeader(header);

            for (Partner partner : partners) {
                csvWriter.write(partner, header);
            }
            csvWriter.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
    
}

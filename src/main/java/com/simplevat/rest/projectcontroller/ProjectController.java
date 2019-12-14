/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.projectcontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.criteria.ProjectCriteria;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Country;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Project;
import com.simplevat.entity.Title;
import com.simplevat.helper.ContactHelper;
import com.simplevat.service.ContactService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TitleService;
import com.simplevat.constant.ContactTypeConstant;
import com.simplevat.contact.model.ContactModel;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private TitleService titleService;

    @Autowired
    private CountryService countryService;

    @GetMapping(value = "/getprojects")
    public ResponseEntity getProjects() throws Exception {
        ProjectCriteria projectCriteria = new ProjectCriteria();
        projectCriteria.setActive(Boolean.TRUE);
        List<Project> projects = projectService.getProjectsByCriteria(projectCriteria);

        if (projects == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @DeleteMapping(value = "/deleteproject")
    public ResponseEntity deleteProject(@RequestParam(value = "id") Integer id) throws Exception {
        try {
            Project project = projectService.findByPK(id);

            if (project == null) {
                return new ResponseEntity(HttpStatus.NOT_FOUND);

            } else {
                project.setDeleteFlag(Boolean.TRUE);
                projectService.update(project);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping(value = "/deleteprojects")
    public ResponseEntity deleteProjects(@RequestBody DeleteModel ids) throws Exception {
        try {
            projectService.deleteByIds(ids.getIds());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping(value = "/editproject")
    public ResponseEntity editProject(@RequestParam(value = "id") Integer id) throws Exception {
        Project project = projectService.findByPK(id);

        if (project == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @GetMapping(value = "/getcontactbyName")
    public ResponseEntity getContacts(@RequestParam(value = "searchQuery") String searchQuery) {
        List<Contact> contact = contactService.getContacts(searchQuery, ContactTypeConstant.CUSTOMER);
        if (contact == null && contact.isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);

        }
        return new ResponseEntity<>(contact, HttpStatus.OK);
    }

    @Deprecated
    @GetMapping(value = "/getcurrenncy")
    public ResponseEntity getCurrency() {
        try {
            List<Currency> currencies = currencyService.getCurrencies();
            if (currencies != null && !currencies.isEmpty()) {
                return new ResponseEntity<>(currencies, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @GetMapping(value = "/gettitle")
    public ResponseEntity getTitle(@RequestParam(value = "titleStr") String titleStr) {
        List<Title> titleSuggestion = new ArrayList<>();
        List<Title> titles = titleService.getTitles();
        Iterator<Title> titleIterator = titles.iterator();
        if (titleIterator == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);

        } else {
            while (titleIterator.hasNext()) {
                Title title = titleIterator.next();
                if (title.getTitleDescription() != null
                        && !title.getTitleDescription().isEmpty()
                        && title.getTitleDescription().toUpperCase().contains(titleStr.toUpperCase())) {
                    titleSuggestion.add(title);
                }
            }

            return new ResponseEntity<>(titleSuggestion, HttpStatus.OK);
        }
    }

    @Deprecated
    @GetMapping(value = "/getcountry")
    public ResponseEntity getCountry() {
        try {
            List<Country> countries = countryService.getCountries();
            if (countries != null && !countries.isEmpty()) {
                return new ResponseEntity<>(countries, HttpStatus.OK);
            } else {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @PostMapping(value = "/saveprojectcontact")
    public ResponseEntity saveContact(@RequestBody ContactModel contactModel, @RequestParam(value = "id") Integer id) {

        Contact contact = new Contact();
        ContactHelper contactHelper = new ContactHelper();
        contact = contactHelper.getContact(contactModel);
        contact.setCreatedBy(id);
        contact.setCreatedDate(LocalDateTime.now());
        contact.setDeleteFlag(Boolean.FALSE);
        contact.setContactType(ContactTypeConstant.CUSTOMER);
        if (contact.getContactId() != null && contact.getContactId() > 0) {
            this.contactService.update(contact);
        } else {

            this.contactService.persist(contact);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(value = "/saveproject")
    public ResponseEntity saveProject(@RequestBody Project project, @RequestParam(value = "id") Integer id) throws Exception {
        project.setCreatedBy(id);
        project.setCreatedDate(LocalDateTime.now());
        if (project.getProjectId() != null && project.getProjectId() > 0) {
            projectService.update(project);
        } else {
            projectService.persist(project);
        }
        return new ResponseEntity<>(HttpStatus.OK);

    }

}

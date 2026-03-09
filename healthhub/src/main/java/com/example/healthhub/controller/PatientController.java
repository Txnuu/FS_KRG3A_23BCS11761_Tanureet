package com.example.healthhub.controller;

import com.example.healthhub.dto.PatientDTO;
import com.example.healthhub.entity.Patient;
import com.example.healthhub.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService service;

    @PostMapping
    public Patient create(@Valid @RequestBody PatientDTO dto){

        Patient patient = new Patient();
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setAge(dto.getAge());

        return service.save(patient);
    }

    @GetMapping
    public List<Patient> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Patient getById(@PathVariable Long id){
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}

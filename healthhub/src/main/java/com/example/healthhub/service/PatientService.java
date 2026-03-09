package com.example.healthhub.service;

import com.example.healthhub.entity.Patient;
import com.example.healthhub.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository repository;

    public Patient save(Patient patient){
        return repository.save(patient);
    }

    public List<Patient> getAll(){
        return repository.findAll();
    }

    public Patient getById(Long id){
        return repository.findById(id).orElse(null);
    }

    public void delete(Long id){
        repository.deleteById(id);
    }
}
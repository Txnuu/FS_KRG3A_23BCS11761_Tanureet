package com.example.healthhub.controller;

import com.example.healthhub.dto.*;
import com.example.healthhub.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // ✅ Create Patient
    @PostMapping
    public PatientDTO createPatient(@RequestBody PatientDTO dto) {
        return patientService.savePatient(dto);
    }

    // ✅ Get All Patients (Pagination)
    @GetMapping
    public Page<PatientDTO> getPatients(
            @RequestParam int page,
            @RequestParam int size) {
        return patientService.getPatients(page, size);
    }

    // ✅ Get Patient by ID
    @GetMapping("/{id}")
    public PatientDTO getPatient(@PathVariable Long id) {
        return patientService.getPatient(id);
    }
}
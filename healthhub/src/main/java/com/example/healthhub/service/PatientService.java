package com.example.healthhub.service;

import com.example.healthhub.entity.*;
import com.example.healthhub.dto.*;
import com.example.healthhub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;

import java.util.*;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    // ✅ Save Patient
    public PatientDTO savePatient(PatientDTO dto) {
        Patient patient = new Patient();
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setAge(dto.getAge());

        Patient saved = patientRepository.save(patient);
        return convertToDTO(saved);
    }

    // ✅ Get All (Pagination)
    public Page<PatientDTO> getPatients(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return patientRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    // ✅ Get by ID with appointments
    public PatientDTO getPatient(Long id) {
        Patient patient = patientRepository.findByIdWithAppointments(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return convertToDTO(patient);
    }

    // ✅ Convert Entity → DTO
    public PatientDTO convertToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();

        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setEmail(patient.getEmail());
        dto.setAge(patient.getAge());

        if (patient.getAppointments() != null) {
            List<String> dates = patient.getAppointments()
                    .stream()
                    .map(Appointment::getDate)
                    .toList();
            dto.setAppointmentDates(dates);
        }

        return dto;
    }
}
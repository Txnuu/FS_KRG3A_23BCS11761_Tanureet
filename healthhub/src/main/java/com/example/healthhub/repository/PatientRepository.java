package com.example.healthhub.repository;

import com.example.healthhub.entity.Patient;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.*;

import java.util.*;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("SELECT p FROM Patient p WHERE p.age > :age")
    List<Patient> findPatientsOlderThan(@Param("age") int age);

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.appointments")
    List<Patient> findAllWithAppointments();

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.appointments WHERE p.id = :id")
    Optional<Patient> findByIdWithAppointments(@Param("id") Long id);

    Page<Patient> findAll(Pageable pageable);

    Optional<Patient> findByEmail(String email);
}
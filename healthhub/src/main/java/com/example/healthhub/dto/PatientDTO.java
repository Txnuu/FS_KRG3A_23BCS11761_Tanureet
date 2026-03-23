package com.example.healthhub.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class PatientDTO {

    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @Min(1)
    private int age;

    private List<String> appointmentDates;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public List<String> getAppointmentDates() { return appointmentDates; }
    public void setAppointmentDates(List<String> appointmentDates) { this.appointmentDates = appointmentDates; }
}
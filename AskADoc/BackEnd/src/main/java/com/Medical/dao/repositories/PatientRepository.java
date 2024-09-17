package com.Medical.dao.repositories;

import com.Medical.dao.entities.Patient;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient,Integer> {
    Optional<Patient> findByEmail(String email);
}

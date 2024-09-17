package com.Medical.dao.repositories;

import com.Medical.dao.entities.Doctor;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByEmail(String email);
}

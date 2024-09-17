package com.Medical.dao.repositories;

import com.Medical.dao.entities.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
}

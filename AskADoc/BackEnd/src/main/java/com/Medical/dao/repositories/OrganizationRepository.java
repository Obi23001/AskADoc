package com.Medical.dao.repositories;

import com.Medical.dao.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization,Integer> {
	Optional<Organization> findByEmail(String email);
}

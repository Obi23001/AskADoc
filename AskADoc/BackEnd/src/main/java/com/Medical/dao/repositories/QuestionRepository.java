package com.Medical.dao.repositories;

import com.Medical.dao.entities.Patient;
import com.Medical.dao.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
	List<Question> findByPatient(Patient patient);
}

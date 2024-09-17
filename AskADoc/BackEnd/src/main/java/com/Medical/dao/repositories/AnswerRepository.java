package com.Medical.dao.repositories;

import com.Medical.dao.entities.Answer;
import com.Medical.dao.entities.Question;

import java.util.List; 
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestion(Question question);
}

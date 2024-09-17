package com.Medical.services;

import com.Medical.dao.entities.Answer;
import com.Medical.dao.entities.Question;
import com.Medical.dao.requests.AnswerRequest;
import com.Medical.dao.requests.QuestionRequest;
import java.util.List;

public interface QuestionService {

    Question askAQuestion(String userEmail, QuestionRequest request);
    
    Answer answerQuestion(String doctorEmail, AnswerRequest request);
    
    List<Question> getAllQuestions();
    
    List<Answer> getAllAnswers(Question question);

    Question getQuestionById(Long questionId);
}

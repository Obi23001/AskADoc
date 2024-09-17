package com.Medical.dao.requests;

import lombok.Data;

@Data
public class AppointmentRequest {
    private String doctorEmail;
    private String appointmentDateTime;
}
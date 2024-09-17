package com.Medical.dao.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String certificateName; // Name of the certificate

    @Lob
    @Column(name = "certificate_file", columnDefinition = "LONGBLOB")
    private byte[] certificateFile; // File of the certificate

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    @JsonBackReference
    private Doctor doctor; // The doctor associated with this certificate
}


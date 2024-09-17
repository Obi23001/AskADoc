package com.Medical;

import com.Medical.security.role.Role;
import com.Medical.security.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class MainApplication {

    public static void main(String[] args) {
        SpringApplication.run(com.Medical.MainApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(RoleRepository roleRepository){
        return args -> {
            if (roleRepository.findByName("DOCTOR").isEmpty()){
                roleRepository.save(
                        Role.builder().name("DOCTOR").build()
                );
            }
            if (roleRepository.findByName("PATIENT").isEmpty()){
                roleRepository.save(
                        Role.builder().name("PATIENT").build()
                );
            }
            if (roleRepository.findByName("ORGANIZATION").isEmpty()){
                roleRepository.save(
                        Role.builder().name("ORGANIZATION").build()
                );
            }
        };
    }

}
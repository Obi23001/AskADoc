package com.Medical.security.user;

import com.Medical.security.role.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.security.Principal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "TYPE", length = 40)
@EntityListeners(AuditingEntityListener.class)//To keep track when the user was created
//Its necessary to add @EnableJpaAuditing in the SpringBootApplication Class
public abstract class User implements UserDetails, Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    @Column(unique = true)
    private String email;
    private String password;
    private String city;
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> roles;

    private boolean accountLocked;
    private boolean enabled;
    private boolean verified; 

    @Lob
    @Column(name = "profile_image", columnDefinition="LONGBLOB")
    private byte[] profileImage;

    //For the audite Listener
    @CreatedDate
    @Column(nullable = false, updatable = false)//Don't modifie the date of creation
    private LocalDate createdDate;

    @LastModifiedDate
    @Column(insertable = false)//
    private LocalDate lastModifiedDate;

    //Overrided Methods of UserDetails and Principal
    @Override
    public String getName() {
        //since email is our unique identifier
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles
                .stream()
                .map(r -> new SimpleGrantedAuthority(r.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public String getFullName(){
        return firstName+" "+lastName;
    }
}

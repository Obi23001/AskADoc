package com.Medical.security.email;

import lombok.Getter;

@Getter
public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account");//Spring & Thymeleaf are smart to look up by default in /templates
    private final String name;

    EmailTemplateName(String name) {
        this.name = name;
    }
}

package com.example.server.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BreadcrumbItem {
    private String label;
    private String url;

    public BreadcrumbItem(String label, String url) {
        this.label = label;
        this.url = url;
    }

    // Getters & Setters
}


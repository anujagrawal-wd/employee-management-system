package com.anuj.ems.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DepartmentRequest {

    @NotBlank(message = "Department code is required")
    @Size(
            max = 20,
            message = "Department code cannot exceed 20 characters"
    )
    private String departmentCode;

    @NotBlank(message = "Department name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Department name must be between 2 and 100 characters"
    )
    private String name;

    @Size(
            max = 500,
            message = "Description cannot exceed 500 characters"
    )
    private String description;

    public DepartmentRequest() {
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
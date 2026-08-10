package com.anuj.ems.util;

import com.anuj.ems.dto.DepartmentRequest;
import com.anuj.ems.dto.DepartmentResponse;
import com.anuj.ems.entity.Department;

public class DepartmentMapper {

    private DepartmentMapper() {
        // Utility class
    }

    public static Department toEntity(DepartmentRequest request) {

        Department department = new Department();

        department.setDepartmentCode(request.getDepartmentCode());
        department.setName(request.getName());
        department.setDescription(request.getDescription());

        return department;
    }

    public static DepartmentResponse toResponse(Department department) {

        DepartmentResponse response = new DepartmentResponse();

        response.setId(department.getId());
        response.setDepartmentCode(department.getDepartmentCode());
        response.setName(department.getName());
        response.setDescription(department.getDescription());
        response.setStatus(department.getStatus());
        response.setCreatedAt(department.getCreatedAt());
        response.setUpdatedAt(department.getUpdatedAt());

        return response;
    }
}
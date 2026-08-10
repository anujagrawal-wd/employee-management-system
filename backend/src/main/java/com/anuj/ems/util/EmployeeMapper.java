package com.anuj.ems.util;

import com.anuj.ems.dto.EmployeeRequest;
import com.anuj.ems.dto.EmployeeResponse;
import com.anuj.ems.entity.Department;
import com.anuj.ems.entity.Employee;

public class EmployeeMapper {

    private EmployeeMapper() {
        // Utility class
    }

    public static Employee toEntity(
            EmployeeRequest request,
            Department department) {

        Employee employee = new Employee();

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setGender(request.getGender());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setDepartment(department);

        return employee;
    }

    public static EmployeeResponse toResponse(Employee employee) {

        EmployeeResponse response = new EmployeeResponse();

        response.setId(employee.getId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setPhone(employee.getPhone());
        response.setGender(employee.getGender());
        response.setDesignation(employee.getDesignation());
        response.setSalary(employee.getSalary());
        response.setJoiningDate(employee.getJoiningDate());
        response.setStatus(employee.getStatus());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());

        // Department information
        if (employee.getDepartment() != null) {

            response.setDepartmentId(
                    employee.getDepartment().getId()
            );

            response.setDepartmentCode(
                    employee.getDepartment().getDepartmentCode()
            );

            response.setDepartmentName(
                    employee.getDepartment().getName()
            );
        }

        return response;
    }
}
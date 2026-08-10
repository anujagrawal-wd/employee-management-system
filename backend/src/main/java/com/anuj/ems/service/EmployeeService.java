package com.anuj.ems.service;

import com.anuj.ems.dto.EmployeeRequest;
import com.anuj.ems.dto.EmployeeResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(
            EmployeeRequest request
    );

    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(
            Long id
    );

    EmployeeResponse updateEmployee(
            Long id,
            EmployeeRequest request
    );

    void deleteEmployee(
            Long id
    );

    List<EmployeeResponse> getEmployeesByDepartment(
            Long departmentId
    );

    Page<EmployeeResponse> searchEmployees(
            String search,
            int page,
            int size,
            String sortBy,
            String direction
    );

    List<EmployeeResponse> getRecentEmployees();

    EmployeeResponse getCurrentEmployee(
            String email
    );
}
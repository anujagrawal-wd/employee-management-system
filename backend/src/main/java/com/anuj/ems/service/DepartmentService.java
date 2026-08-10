package com.anuj.ems.service;

import com.anuj.ems.dto.DepartmentRequest;
import com.anuj.ems.dto.DepartmentResponse;
import com.anuj.ems.dto.DepartmentStatisticsResponse;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse createDepartment(DepartmentRequest request);

    List<DepartmentResponse> getAllDepartments();
    List<DepartmentStatisticsResponse> getDepartmentStatistics();

    DepartmentResponse getDepartmentById(Long id);

    DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request);

    void deleteDepartment(Long id);
}
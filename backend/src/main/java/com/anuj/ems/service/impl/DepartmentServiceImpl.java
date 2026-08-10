package com.anuj.ems.service.impl;

import com.anuj.ems.dto.DepartmentRequest;
import com.anuj.ems.dto.DepartmentResponse;
import com.anuj.ems.dto.DepartmentStatisticsResponse;
import com.anuj.ems.entity.Department;
import com.anuj.ems.exception.ResourceNotFoundException;
import com.anuj.ems.repository.DepartmentRepository;
import com.anuj.ems.repository.EmployeeRepository;
import com.anuj.ems.service.DepartmentService;
import com.anuj.ems.util.DepartmentMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository,
            EmployeeRepository employeeRepository) {

        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public DepartmentResponse createDepartment(
            DepartmentRequest request) {

        if (departmentRepository
                .existsByDepartmentCode(request.getDepartmentCode())) {

            throw new IllegalArgumentException(
                    "Department code already exists: "
                            + request.getDepartmentCode()
            );
        }

        if (departmentRepository
                .existsByNameIgnoreCase(request.getName())) {

            throw new IllegalArgumentException(
                    "Department name already exists: "
                            + request.getName()
            );
        }

        Department department =
                DepartmentMapper.toEntity(request);

        Department savedDepartment =
                departmentRepository.save(department);

        return DepartmentMapper.toResponse(savedDepartment);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(DepartmentMapper::toResponse)
                .toList();
    }

    @Override
    public DepartmentResponse getDepartmentById(Long id) {

        Department department =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found with id: "
                                                + id
                                ));

        return DepartmentMapper.toResponse(department);
    }

    @Override
    public DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request) {

        Department existingDepartment =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found with id: "
                                                + id
                                ));

        existingDepartment.setDepartmentCode(
                request.getDepartmentCode()
        );

        existingDepartment.setName(
                request.getName()
        );

        existingDepartment.setDescription(
                request.getDescription()
        );

        Department updatedDepartment =
                departmentRepository.save(existingDepartment);

        return DepartmentMapper.toResponse(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long id) {

        Department existingDepartment =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found with id: "
                                                + id
                                ));

        departmentRepository.delete(existingDepartment);
    }

    @Override
    public List<DepartmentStatisticsResponse>
    getDepartmentStatistics() {

        return employeeRepository.getDepartmentStatistics();
    }
}
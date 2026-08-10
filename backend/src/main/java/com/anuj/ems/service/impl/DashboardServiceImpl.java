package com.anuj.ems.service.impl;

import com.anuj.ems.dto.DashboardStatisticsResponse;
import com.anuj.ems.entity.EmployeeStatus;
import com.anuj.ems.repository.EmployeeRepository;
import com.anuj.ems.service.DashboardService;
import com.anuj.ems.util.EmployeeMapper;

import org.springframework.stereotype.Service;
import com.anuj.ems.dto.DepartmentStatisticsResponse;
import com.anuj.ems.dto.EmployeeResponse;

import java.util.List;
@Service
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;

    public DashboardServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public DashboardStatisticsResponse getStatistics() {

        DashboardStatisticsResponse response =
                new DashboardStatisticsResponse();

        response.setTotalEmployees(
                employeeRepository.count()
        );

        response.setActiveEmployees(
                employeeRepository.countByStatus(
                        EmployeeStatus.ACTIVE
                )
        );

        response.setInactiveEmployees(
                employeeRepository.countByStatus(
                        EmployeeStatus.INACTIVE
                )
        );

        response.setOnLeaveEmployees(
                employeeRepository.countByStatus(
                        EmployeeStatus.ON_LEAVE
                )
        );

        response.setTerminatedEmployees(
                employeeRepository.countByStatus(
                        EmployeeStatus.TERMINATED
                )
        );

        return response;
    }
    @Override
public List<DepartmentStatisticsResponse> getDepartmentStatistics() {

    return employeeRepository.getDepartmentStatistics();
}
@Override
public List<EmployeeResponse> getRecentEmployees() {

    return employeeRepository
            .findTop5ByOrderByJoiningDateDesc()
            .stream()
            .map(EmployeeMapper::toResponse)
            .toList();
}
}
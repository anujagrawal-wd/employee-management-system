package com.anuj.ems.service;
import com.anuj.ems.dto.DepartmentStatisticsResponse;
import com.anuj.ems.dto.EmployeeResponse;

import java.util.List;

import com.anuj.ems.dto.DashboardStatisticsResponse;

public interface DashboardService {

    DashboardStatisticsResponse getStatistics();
    List<DepartmentStatisticsResponse> getDepartmentStatistics();
    List<EmployeeResponse> getRecentEmployees();
}
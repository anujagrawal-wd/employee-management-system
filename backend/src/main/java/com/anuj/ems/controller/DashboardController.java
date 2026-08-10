package com.anuj.ems.controller;

import com.anuj.ems.dto.DashboardStatisticsResponse;
import com.anuj.ems.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.anuj.ems.dto.DepartmentStatisticsResponse;
import com.anuj.ems.dto.EmployeeResponse;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
@GetMapping("/statistics")
public ResponseEntity<DashboardStatisticsResponse> getStatistics() {

    return ResponseEntity.ok(
            dashboardService.getStatistics()
    );
}
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
@GetMapping("/department-distribution")
public ResponseEntity<List<DepartmentStatisticsResponse>> getDepartmentStatistics() {

    return ResponseEntity.ok(
            dashboardService.getDepartmentStatistics()
    );
}
@PreAuthorize("hasAnyRole('ADMIN', 'HR')")
@GetMapping("/recent-employees")
public ResponseEntity<List<EmployeeResponse>> getRecentEmployees() {

    return ResponseEntity.ok(
            dashboardService.getRecentEmployees()
    );
}

}
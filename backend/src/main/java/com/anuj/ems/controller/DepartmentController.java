package com.anuj.ems.controller;

import com.anuj.ems.dto.DepartmentRequest;
import com.anuj.ems.dto.DepartmentResponse;
import com.anuj.ems.dto.EmployeeResponse;
import com.anuj.ems.service.DepartmentService;
import com.anuj.ems.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.anuj.ems.dto.DepartmentStatisticsResponse;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

        private final DepartmentService departmentService;
        private final EmployeeService employeeService;

        public DepartmentController(
                        DepartmentService departmentService,
                        EmployeeService employeeService) {

                this.departmentService = departmentService;
                this.employeeService = employeeService;
        }

        @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
        @PostMapping
        public ResponseEntity<DepartmentResponse> createDepartment(
                        @Valid @RequestBody DepartmentRequest request) {

                DepartmentResponse response = departmentService.createDepartment(request);

                return new ResponseEntity<>(
                                response,
                                HttpStatus.CREATED);
        }

        @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
        @GetMapping
        public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {

                return ResponseEntity.ok(
                                departmentService.getAllDepartments());
        }

        @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
        @GetMapping("/{id}")
        public ResponseEntity<DepartmentResponse> getDepartmentById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                departmentService.getDepartmentById(id));
        }

        @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
        @PutMapping("/{id}")
        public ResponseEntity<DepartmentResponse> updateDepartment(
                        @PathVariable Long id,
                        @Valid @RequestBody DepartmentRequest request) {

                return ResponseEntity.ok(
                                departmentService.updateDepartment(id, request));
        }

        @PreAuthorize("hasRole('ADMIN')")
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteDepartment(
                        @PathVariable Long id) {

                departmentService.deleteDepartment(id);

                return ResponseEntity.noContent().build();
        }

        @GetMapping("/{departmentId}/employees")
        public ResponseEntity<List<EmployeeResponse>> getEmployeesByDepartment(
                        @PathVariable Long departmentId) {

                return ResponseEntity.ok(
                                employeeService.getEmployeesByDepartment(departmentId));
        }
        @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
@GetMapping("/statistics")
public ResponseEntity<List<DepartmentStatisticsResponse>>
getDepartmentStatistics() {

    return ResponseEntity.ok(
            departmentService.getDepartmentStatistics()
    );
}
}
package com.anuj.ems.controller;

import com.anuj.ems.dto.EmployeeRequest;
import com.anuj.ems.dto.EmployeeResponse;
import com.anuj.ems.service.EmployeeService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequestMapping("/api/employees")
@RestController
public class EmployeeController {

    private final EmployeeService employeeService;


    public EmployeeController(
            EmployeeService employeeService) {

        this.employeeService =
                employeeService;
    }


    /*
     * =========================================
     * CREATE EMPLOYEE
     * ADMIN + HR
     * =========================================
     */

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {

        EmployeeResponse response =
                employeeService.createEmployee(
                        request
                );


        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }


    /*
     * =========================================
     * GET ALL EMPLOYEES
     * ADMIN + HR
     *
     * EMPLOYEE SHOULD NOT USE THIS ENDPOINT
     * =========================================
     */

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {

        return ResponseEntity.ok(
                employeeService.getAllEmployees()
        );
    }


    /*
     * =========================================
     * GET CURRENT LOGGED-IN EMPLOYEE
     * EMPLOYEE ONLY
     * =========================================
     */

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<EmployeeResponse> getCurrentEmployee(
            Authentication authentication) {

        return ResponseEntity.ok(
                employeeService.getCurrentEmployee(
                        authentication.getName()
                )
        );
    }


    /*
     * =========================================
     * GET EMPLOYEE BY ID
     * ADMIN + HR
     * =========================================
     */

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                employeeService.getEmployeeById(
                        id
                )
        );
    }


    /*
     * =========================================
     * UPDATE EMPLOYEE
     * ADMIN + HR
     * =========================================
     */

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {

        return ResponseEntity.ok(
                employeeService.updateEmployee(
                        id,
                        request
                )
        );
    }


    /*
     * =========================================
     * DELETE EMPLOYEE
     * ADMIN ONLY
     * =========================================
     */

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(
            @PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return ResponseEntity.noContent()
                .build();
    }


    /*
     * =========================================
     * SEARCH EMPLOYEES
     * ADMIN + HR
     * =========================================
     */

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeResponse>> searchEmployees(

            @RequestParam(
                    required = false
            )
            String search,

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "10"
            )
            int size,

            @RequestParam(
                    defaultValue = "id"
            )
            String sortBy,

            @RequestParam(
                    defaultValue = "asc"
            )
            String direction) {

        return ResponseEntity.ok(
                employeeService.searchEmployees(
                        search,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }


    /*
     * =========================================
     * RECENT EMPLOYEES
     * ADMIN + HR
     * =========================================
     */

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping("/recent")
    public ResponseEntity<List<EmployeeResponse>> getRecentEmployees() {

        return ResponseEntity.ok(
                employeeService.getRecentEmployees()
        );
    }
}
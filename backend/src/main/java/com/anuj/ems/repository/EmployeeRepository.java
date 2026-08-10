package com.anuj.ems.repository;

import com.anuj.ems.dto.DepartmentStatisticsResponse;
import com.anuj.ems.entity.Employee;
import com.anuj.ems.entity.EmployeeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmailIgnoreCase(String email);

    Page<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName,
            String lastName,
            String email,
            Pageable pageable
    );

    List<Employee> findByDepartmentId(Long departmentId);

    long countByStatus(EmployeeStatus status);

    @Query("""
        SELECT new com.anuj.ems.dto.DepartmentStatisticsResponse(
            d.departmentCode,
            d.name,
            COUNT(e.id)
        )
        FROM Department d
        LEFT JOIN Employee e
            ON e.department.id = d.id
        GROUP BY d.id, d.departmentCode, d.name
        ORDER BY d.name
        """)
    List<DepartmentStatisticsResponse> getDepartmentStatistics();

    List<Employee> findTop5ByOrderByJoiningDateDesc();
}
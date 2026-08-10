package com.anuj.ems.repository;

import com.anuj.ems.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByDepartmentCode(String departmentCode);

    boolean existsByNameIgnoreCase(String name);
}
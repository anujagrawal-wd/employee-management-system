package com.anuj.ems.service.impl;

import com.anuj.ems.dto.EmployeeRequest;
import com.anuj.ems.dto.EmployeeResponse;
import com.anuj.ems.entity.Department;
import com.anuj.ems.entity.Employee;
import com.anuj.ems.entity.Role;
import com.anuj.ems.entity.User;
import com.anuj.ems.exception.ResourceNotFoundException;
import com.anuj.ems.repository.DepartmentRepository;
import com.anuj.ems.repository.EmployeeRepository;
import com.anuj.ems.repository.UserRepository;
import com.anuj.ems.service.EmployeeService;
import com.anuj.ems.util.EmployeeMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeServiceImpl
        implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final DepartmentRepository departmentRepository;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.employeeRepository =
                employeeRepository;

        this.departmentRepository =
                departmentRepository;

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;
    }


    /*
     * =========================================
     * CREATE EMPLOYEE + USER ACCOUNT
     * =========================================
     */

    @Override
    @Transactional
    public EmployeeResponse createEmployee(
            EmployeeRequest request) {

        /*
         * Check employee email.
         */

        if (employeeRepository
                .findByEmailIgnoreCase(request.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Employee already exists with email: "
                            + request.getEmail()
            );
        }


        /*
         * Check user email.
         */

        if (userRepository.existsByEmail(
                request.getEmail()
        )) {

            throw new RuntimeException(
                    "A user account already exists with email: "
                            + request.getEmail()
            );
        }


        /*
         * Password is required for a new
         * employee login account.
         */

        if (request.getPassword() == null ||
                request.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required when creating an employee"
            );
        }


        /*
         * Find department.
         */

        Department department =
                departmentRepository.findById(
                        request.getDepartmentId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: "
                                        + request.getDepartmentId()
                        )
                );


        /*
         * Create employee.
         */

        Employee employee =
                EmployeeMapper.toEntity(
                        request,
                        department
                );


        Employee savedEmployee =
                employeeRepository.save(
                        employee
                );


        /*
         * Create corresponding User account.
         */

        User user = new User();

        user.setName(
                request.getFirstName()
                        + " "
                        + request.getLastName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(
                Role.EMPLOYEE
        );

        user.setEnabled(true);


        userRepository.save(user);


        return EmployeeMapper.toResponse(
                savedEmployee
        );
    }


    /*
     * =========================================
     * GET ALL EMPLOYEES
     * =========================================
     */

    @Override
    public List<EmployeeResponse> getAllEmployees() {

        return employeeRepository.findAll()
                .stream()
                .map(EmployeeMapper::toResponse)
                .toList();
    }


    /*
     * =========================================
     * GET EMPLOYEE BY ID
     * =========================================
     */

    @Override
    public EmployeeResponse getEmployeeById(
            Long id) {

        Employee employee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );


        return EmployeeMapper.toResponse(
                employee
        );
    }


    /*
     * =========================================
     * GET CURRENT EMPLOYEE
     * =========================================
     */

    @Override
    public EmployeeResponse getCurrentEmployee(
            String email) {

        Employee employee =
                employeeRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with email: "
                                                + email
                                )
                        );


        return EmployeeMapper.toResponse(
                employee
        );
    }


    /*
     * =========================================
     * UPDATE EMPLOYEE
     * =========================================
     */

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(
            Long id,
            EmployeeRequest request) {

        Employee existingEmployee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );


        Department department =
                departmentRepository.findById(
                        request.getDepartmentId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: "
                                        + request.getDepartmentId()
                        )
                );


        String oldEmail =
                existingEmployee.getEmail();

        String newEmail =
                request.getEmail();


        /*
         * If email is being changed, make sure
         * another employee doesn't already use it.
         */

        if (!oldEmail.equalsIgnoreCase(newEmail)) {

            if (employeeRepository
                    .findByEmailIgnoreCase(newEmail)
                    .filter(employee ->
                            !employee.getId()
                                    .equals(id))
                    .isPresent()) {

                throw new RuntimeException(
                        "Another employee already exists with email: "
                                + newEmail
                );
            }


            /*
             * Also make sure another User isn't
             * already using the new email.
             */

            if (userRepository.existsByEmail(
                    newEmail
            )) {

                throw new RuntimeException(
                        "A user account already exists with email: "
                                + newEmail
                );
            }
        }


        existingEmployee.setEmployeeCode(
                request.getEmployeeCode()
        );

        existingEmployee.setFirstName(
                request.getFirstName()
        );

        existingEmployee.setLastName(
                request.getLastName()
        );

        existingEmployee.setEmail(
                newEmail
        );

        existingEmployee.setPhone(
                request.getPhone()
        );

        existingEmployee.setGender(
                request.getGender()
        );

        existingEmployee.setDesignation(
                request.getDesignation()
        );

        existingEmployee.setSalary(
                request.getSalary()
        );

        existingEmployee.setJoiningDate(
                request.getJoiningDate()
        );

        existingEmployee.setDepartment(
                department
        );


        Employee updatedEmployee =
                employeeRepository.save(
                        existingEmployee
                );


        /*
         * Update linked EMPLOYEE user account.
         */

        if (!oldEmail.equalsIgnoreCase(newEmail)) {

            userRepository
                    .findByEmail(oldEmail)
                    .ifPresent(user -> {

                        if (user.getRole()
                                == Role.EMPLOYEE) {

                            user.setEmail(newEmail);

                            user.setName(
                                    request.getFirstName()
                                            + " "
                                            + request.getLastName()
                            );

                            userRepository.save(user);
                        }

                    });

        } else {

            /*
             * Keep the User name synchronized
             * with the Employee name.
             */

            userRepository
                    .findByEmail(oldEmail)
                    .ifPresent(user -> {

                        if (user.getRole()
                                == Role.EMPLOYEE) {

                            user.setName(
                                    request.getFirstName()
                                            + " "
                                            + request.getLastName()
                            );

                            userRepository.save(user);
                        }

                    });
        }


        /*
         * Optional password update.
         *
         * If password is empty during edit,
         * the existing password remains unchanged.
         */

        if (request.getPassword() != null &&
                !request.getPassword()
                        .trim()
                        .isEmpty()) {

            userRepository
                    .findByEmail(newEmail)
                    .ifPresent(user -> {

                        if (user.getRole()
                                == Role.EMPLOYEE) {

                            user.setPassword(
                                    passwordEncoder.encode(
                                            request.getPassword()
                                    )
                            );

                            userRepository.save(user);
                        }

                    });
        }


        return EmployeeMapper.toResponse(
                updatedEmployee
        );
    }


    /*
     * =========================================
     * DELETE EMPLOYEE
     * =========================================
     */

    @Override
    @Transactional
    public void deleteEmployee(
            Long id) {

        Employee existingEmployee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );


        /*
         * Delete linked employee user account.
         */

        userRepository
                .findByEmail(
                        existingEmployee.getEmail()
                )
                .ifPresent(user -> {

                    if (user.getRole()
                            == Role.EMPLOYEE) {

                        userRepository.delete(user);
                    }

                });


        employeeRepository.delete(
                existingEmployee
        );
    }


    /*
     * =========================================
     * SEARCH EMPLOYEES
     * =========================================
     */

    @Override
    public Page<EmployeeResponse> searchEmployees(
            String search,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;


        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                sortDirection,
                                sortBy
                        )
                );


        Page<Employee> employees;


        if (search == null ||
                search.trim().isEmpty()) {

            employees =
                    employeeRepository.findAll(
                            pageable
                    );

        } else {

            employees =
                    employeeRepository
                            .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                                    search,
                                    search,
                                    search,
                                    pageable
                            );
        }


        return employees.map(
                EmployeeMapper::toResponse
        );
    }


    /*
     * =========================================
     * GET EMPLOYEES BY DEPARTMENT
     * =========================================
     */

    @Override
    public List<EmployeeResponse> getEmployeesByDepartment(
            Long departmentId) {

        Department department =
                departmentRepository.findById(
                        departmentId
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: "
                                        + departmentId
                        )
                );


        return employeeRepository
                .findByDepartmentId(
                        department.getId()
                )
                .stream()
                .map(EmployeeMapper::toResponse)
                .toList();
    }


    /*
     * =========================================
     * GET RECENT EMPLOYEES
     * =========================================
     */

    @Override
    public List<EmployeeResponse> getRecentEmployees() {

        return employeeRepository
                .findTop5ByOrderByJoiningDateDesc()
                .stream()
                .map(EmployeeMapper::toResponse)
                .toList();
    }
}
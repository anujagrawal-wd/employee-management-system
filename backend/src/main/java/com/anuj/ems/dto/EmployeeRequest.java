package com.anuj.ems.dto;

import com.anuj.ems.entity.Gender;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EmployeeRequest {

    @NotBlank(message = "Employee code is required")
    @Size(
            max = 20,
            message = "Employee code cannot exceed 20 characters"
    )
    private String employeeCode;


    @NotBlank(message = "First name is required")
    @Size(
            min = 2,
            max = 50,
            message = "First name must be between 2 and 50 characters"
    )
    private String firstName;


    @NotBlank(message = "Last name is required")
    @Size(
            min = 2,
            max = 50,
            message = "Last name must be between 2 and 50 characters"
    )
    private String lastName;


    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;


    @NotBlank(message = "Phone is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    private String phone;


    @NotNull(message = "Gender is required")
    private Gender gender;


    @NotBlank(message = "Designation is required")
    @Size(
            max = 100,
            message = "Designation cannot exceed 100 characters"
    )
    private String designation;


    @NotNull(message = "Salary is required")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Salary must be greater than 0"
    )
    private BigDecimal salary;


    @NotNull(message = "Joining date is required")
    @PastOrPresent(
            message = "Joining date cannot be in the future"
    )
    private LocalDate joiningDate;


    @NotNull(message = "Department is required")
    private Long departmentId;


    /*
     * Password for the employee login account.
     *
     * This is required when creating a new employee.
     * It is optional during employee update.
     */
    @Size(
            min = 8,
            max = 100,
            message = "Password must be between 8 and 100 characters"
    )
    private String password;


    public EmployeeRequest() {
    }


    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }


    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }


    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }


    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }


    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }


    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
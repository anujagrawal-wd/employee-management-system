package com.anuj.ems.dto;

public class DepartmentStatisticsResponse {

    private String departmentCode;
    private String departmentName;
    private long employeeCount;

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(long employeeCount) {
        this.employeeCount = employeeCount;
    }
    public DepartmentStatisticsResponse(
        String departmentCode,
        String departmentName,
        long employeeCount) {

    this.departmentCode = departmentCode;
    this.departmentName = departmentName;
    this.employeeCount = employeeCount;
}
}
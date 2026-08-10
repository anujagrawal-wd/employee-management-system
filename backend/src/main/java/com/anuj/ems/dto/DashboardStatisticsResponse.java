package com.anuj.ems.dto;

public class DashboardStatisticsResponse {

    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long onLeaveEmployees;
    private long terminatedEmployees;

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getActiveEmployees() {
        return activeEmployees;
    }

    public void setActiveEmployees(long activeEmployees) {
        this.activeEmployees = activeEmployees;
    }

    public long getInactiveEmployees() {
        return inactiveEmployees;
    }

    public void setInactiveEmployees(long inactiveEmployees) {
        this.inactiveEmployees = inactiveEmployees;
    }

    public long getOnLeaveEmployees() {
        return onLeaveEmployees;
    }

    public void setOnLeaveEmployees(long onLeaveEmployees) {
        this.onLeaveEmployees = onLeaveEmployees;
    }

    public long getTerminatedEmployees() {
        return terminatedEmployees;
    }

    public void setTerminatedEmployees(long terminatedEmployees) {
        this.terminatedEmployees = terminatedEmployees;
    }
}
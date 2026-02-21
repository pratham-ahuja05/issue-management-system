package com.issue_management.dto;

import com.issue_management.model.IssueStatus;

public class IssueUpdateRequest {

    private String title;
    private String description;
    private IssueStatus status;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Enum getter
    public IssueStatus getStatus() {
        return status;
    }

    // Enum setter
    public void setStatus(IssueStatus status) {
        this.status = status;
    }
}

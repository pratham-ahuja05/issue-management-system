package com.issue_management.exception;

public class IssueNotFoundException extends RuntimeException {

    public IssueNotFoundException(String message) {
        super(message);
    }

    public IssueNotFoundException(Long id) {
        super("Issue not found with id: " + id);
    }
}

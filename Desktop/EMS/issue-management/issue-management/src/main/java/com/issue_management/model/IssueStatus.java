package com.issue_management.model;

public enum IssueStatus {

    OPEN,
    POSSIBLE_DUPLICATE,
    DUPLICATE,          // ✅ confirmed duplicate
    IN_PROGRESS,
    RESOLVED,
    CLOSED;

    public boolean canTransitionTo(IssueStatus next) {

        return switch (this) {

            case OPEN ->
                    next == IN_PROGRESS
                            || next == POSSIBLE_DUPLICATE
                            || next == DUPLICATE;

            case POSSIBLE_DUPLICATE ->
                    next == OPEN
                            || next == IN_PROGRESS
                            || next == DUPLICATE;

            case DUPLICATE ->
                    false; // terminal state

            case IN_PROGRESS ->
                    next == RESOLVED;

            case RESOLVED ->
                    next == CLOSED;

            case CLOSED ->
                    false;
        };
    }
}

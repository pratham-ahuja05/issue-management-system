package com.issue_management.ai;

import com.issue_management.dto.IssueDuplicateDTO;
import com.issue_management.model.Issue;

import java.util.List;

public interface AIService {

    AIResponse analyzeIssue(String title, String description);

    List<IssueDuplicateDTO> findDuplicateIssues(
            String title,
            String description,
            List<Issue> existingIssues
    );
}

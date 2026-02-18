package com.issue_management.controller;

import com.issue_management.dto.IssueCreateRequest;
import com.issue_management.dto.IssueResponse;
import com.issue_management.dto.IssueUpdateRequest;
import com.issue_management.model.IssueStatus;
import com.issue_management.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/issues")
@CrossOrigin(origins = "*")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping
    public IssueResponse createIssue(@Valid @RequestBody IssueCreateRequest request) {
        return issueService.createIssue(request);
    }

    @GetMapping
    public Page<IssueResponse> getIssues(
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return issueService.getIssues(status, page, size, sortBy, direction);
    }

    @GetMapping("/{id}")
    public IssueResponse getIssueById(@PathVariable Long id) {
        return issueService.getIssueById(id);
    }

    @PutMapping("/{id}")
    public IssueResponse updateIssue(
            @PathVariable Long id,
            @RequestBody IssueUpdateRequest request
    ) {
        return issueService.updateIssue(id, request);
    }

    @PostMapping("/{id}/mark-duplicate")
    public IssueResponse markDuplicate(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body
    ) {
        return issueService.markAsDuplicate(id, body.get("duplicateId"));
    }

    @DeleteMapping("/{id}")
    public void deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
    }

    @PutMapping("/{id}/restore")
    public IssueResponse restoreIssue(@PathVariable Long id) {
        return issueService.restoreIssue(id);
    }

    @GetMapping("/search")
    public Page<IssueResponse> searchIssues(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return issueService.searchIssues(query, page, size, sortBy, direction);
    }
}

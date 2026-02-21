package com.issue_management.service;

import com.issue_management.ai.AIResponse;
import com.issue_management.ai.AIService;
import com.issue_management.dto.*;
import com.issue_management.exception.IssueNotFoundException;
import com.issue_management.model.Issue;
import com.issue_management.model.IssueStatus;
import com.issue_management.repository.IssueRepository;
import com.issue_management.util.SimilarityUtil;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class IssueService {

    private final IssueRepository repo;
    private final AIService aiService;

    public IssueService(IssueRepository repo, AIService aiService) {
        this.repo = repo;
        this.aiService = aiService;
    }

    // ================= CREATE =================
    public IssueResponse createIssue(IssueCreateRequest request) {

        Issue issue = new Issue();
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setCreatedBy(1L);
        issue.setUpdatedBy(1L);

        // 🔥 AI ANALYSIS
        AIResponse ai = aiService.analyzeIssue(
                issue.getTitle(),
                issue.getDescription()
        );

        issue.setAiPriority(ai.getPriority());
        issue.setAiCategory(ai.getCategory());
        issue.setAiSummary(ai.getSummary());

        issue.setStatus(IssueStatus.OPEN);

        Issue saved = repo.save(issue);

        return mapToResponse(saved, List.of());
    }

    // ================= GET ALL =================
    public Page<IssueResponse> getIssues(
            IssueStatus status,
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Issue> issues = (status == null)
                ? repo.findByDeletedFalse(pageable)
                : repo.findByStatusAndDeletedFalse(status, pageable);

        return issues.map(issue -> mapToResponse(issue, List.of()));
    }

    // ================= GET BY ID (SIMILARITY) =================
    public IssueResponse getIssueById(Long id) {

        Issue issue = repo.findByIdWithDuplicates(id)
                .orElseThrow(() -> new IssueNotFoundException(id));

        List<Issue> candidates =
                repo.findTop10ByDeletedFalseOrderByCreatedAtDesc();

        List<IssueDuplicateDTO> duplicates =
                SimilarityUtil.calculateSimilarities(issue, candidates);

        return mapToResponse(issue, duplicates);
    }

    // ================= UPDATE =================
    public IssueResponse updateIssue(Long id, IssueUpdateRequest request) {

        Issue issue = repo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IssueNotFoundException(id));

        if (request.getTitle() != null) issue.setTitle(request.getTitle());
        if (request.getDescription() != null) issue.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            if (!issue.getStatus().canTransitionTo(request.getStatus())) {
                throw new IllegalStateException(
                        "Invalid status transition: " +
                                issue.getStatus() + " → " + request.getStatus()
                );
            }
            issue.setStatus(request.getStatus());
        }

        issue.setUpdatedBy(1L);

        Issue saved = repo.save(issue);

        return mapToResponse(saved, List.of());
    }

    // ================= MARK DUPLICATE =================
    public IssueResponse markAsDuplicate(Long id, Long duplicateId) {

        Issue issue = repo.findByIdWithDuplicates(id)
                .orElseThrow(() -> new IssueNotFoundException(id));

        Issue duplicate = repo.findById(duplicateId)
                .orElseThrow(() -> new IssueNotFoundException(duplicateId));

        issue.getDuplicates().add(duplicate);

        // we keep POSSIBLE_DUPLICATE (no enum DUPLICATE exists)
        issue.setStatus(IssueStatus.POSSIBLE_DUPLICATE);

        Issue saved = repo.save(issue);

        return mapToResponse(saved, List.of());
    }

    // ================= DELETE =================
    public void deleteIssue(Long id) {
        Issue issue = repo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IssueNotFoundException(id));

        issue.setDeleted(true);
        repo.save(issue);
    }

    // ================= RESTORE =================
    public IssueResponse restoreIssue(Long id) {

        Issue issue = repo.findByIdAndDeletedTrue(id)
                .orElseThrow(() -> new IssueNotFoundException("Deleted issue not found: " + id));

        issue.setDeleted(false);
        return mapToResponse(repo.save(issue), List.of());
    }

    // ================= SEARCH =================
    public Page<IssueResponse> searchIssues(
            String query,
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return repo.searchActiveIssues(query, pageable)
                .map(issue -> mapToResponse(issue, List.of()));
    }

    // ================= MAPPER =================
    private IssueResponse mapToResponse(
            Issue issue,
            List<IssueDuplicateDTO> duplicates
    ) {

        IssueResponse r = new IssueResponse();

        r.setId(issue.getId());
        r.setTitle(issue.getTitle());
        r.setDescription(issue.getDescription());
        r.setStatus(issue.getStatus());
        r.setCreatedAt(issue.getCreatedAt());
        r.setUpdatedAt(issue.getUpdatedAt());
        r.setCreatedBy(issue.getCreatedBy());
        r.setUpdatedBy(issue.getUpdatedBy());

        r.setAiPriority(issue.getAiPriority());
        r.setAiCategory(issue.getAiCategory());
        r.setAiSummary(issue.getAiSummary());

        r.setPossibleDuplicates(duplicates);

        return r;
    }
}

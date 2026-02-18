package com.issue_management.dto;

import java.util.List;

public class IssueDuplicateDTO {

    private Long issueId;
    private String title;
    private double similarity;
    private List<String> matchedKeywords;

    public IssueDuplicateDTO() {}

    public IssueDuplicateDTO(Long issueId, String title, double similarity, List<String> matchedKeywords) {
        this.issueId = issueId;
        this.title = title;
        this.similarity = similarity;
        this.matchedKeywords = matchedKeywords;
    }

    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public double getSimilarity() { return similarity; }
    public void setSimilarity(double similarity) { this.similarity = similarity; }

    public List<String> getMatchedKeywords() { return matchedKeywords; }
    public void setMatchedKeywords(List<String> matchedKeywords) { this.matchedKeywords = matchedKeywords; }
}

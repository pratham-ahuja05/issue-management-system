package com.issue_management.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.issue_management.dto.IssueDuplicateDTO;
import com.issue_management.model.Issue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIServiceImpl implements AIService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.model}")
    private String model;

    public AIServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // ======================================================
    // ISSUE ANALYSIS
    // ======================================================
    @Override
    public AIResponse analyzeIssue(String title, String description) {
        try {

            String prompt = """
                    Analyze the issue and return STRICT JSON only.

                    Title: %s
                    Description: %s

                    {
                      "priority": "LOW | MEDIUM | HIGH | CRITICAL",
                      "category": "UI | BACKEND | DATABASE | DEVOPS | OTHER",
                      "summary": "one line summary"
                    }
                    """.formatted(title, description);

            String content = callGroq(prompt);

            String json = extractJsonObject(content);

            return objectMapper.readValue(json, AIResponse.class);

        } catch (Exception e) {
            return fallbackResponse();
        }
    }

    private AIResponse fallbackResponse() {
        AIResponse r = new AIResponse();
        r.setPriority("MEDIUM");
        r.setCategory("OTHER");
        r.setSummary("AI analysis unavailable");
        return r;
    }

    // ======================================================
    // DUPLICATE DETECTION
    // ======================================================
    @Override
    public List<IssueDuplicateDTO> findDuplicateIssues(
            String title,
            String description,
            List<Issue> existingIssues
    ) {
        try {

            if (existingIssues == null || existingIssues.isEmpty()) {
                return List.of();
            }

            StringBuilder issueList = new StringBuilder();

            for (Issue issue : existingIssues) {
                issueList.append("ID:")
                        .append(issue.getId())
                        .append(", Title:")
                        .append(issue.getTitle())
                        .append(", Description:")
                        .append(issue.getDescription())
                        .append("\n");
            }

            String prompt = """
                    Compare issues and detect duplicates.

                    New Issue:
                    Title: %s
                    Description: %s

                    Existing Issues:
                    %s

                    Return STRICT JSON array:
                    [
                      {
                        "id": 1,
                        "similarity": 0.85,
                        "keywords": ["timeout","payment"]
                      }
                    ]
                    """.formatted(title, description, issueList);

            String content = callGroq(prompt);

            String json = extractJsonArray(content);

            JsonNode array = objectMapper.readTree(json);

            List<IssueDuplicateDTO> results = new ArrayList<>();

            for (JsonNode node : array) {

                Long id = node.path("id").asLong();
                double similarity = node.path("similarity").asDouble();

                List<String> keywords = new ArrayList<>();
                node.path("keywords").forEach(k -> keywords.add(k.asText()));

                IssueDuplicateDTO dto = new IssueDuplicateDTO();
                dto.setIssueId(id);
                dto.setSimilarity(similarity);
                dto.setMatchedKeywords(keywords);

                // set title from DB
                existingIssues.stream()
                        .filter(i -> i.getId().equals(id))
                        .findFirst()
                        .ifPresent(i -> dto.setTitle(i.getTitle()));

                results.add(dto);
            }

            return results;

        } catch (Exception e) {
            return List.of();
        }
    }

    // ======================================================
    // JSON EXTRACTION HELPERS
    // ======================================================
    private String extractJsonObject(String text) {
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");
        if (start == -1 || end == -1) throw new RuntimeException("Invalid JSON");
        return text.substring(start, end + 1);
    }

    private String extractJsonArray(String text) {
        int start = text.indexOf("[");
        int end = text.lastIndexOf("]");
        if (start == -1 || end == -1) throw new RuntimeException("Invalid JSON");
        return text.substring(start, end + 1);
    }

    // ======================================================
    // GROQ CALL
    // ======================================================
    private String callGroq(String prompt) throws Exception {

        String url = "https://api.groq.com/openai/v1/chat/completions";

        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(message));
        requestBody.put("temperature", 0.1);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(url, request, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());

        return root
                .path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText();
    }
}

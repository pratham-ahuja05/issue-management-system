package com.issue_management.util;

import com.issue_management.dto.IssueDuplicateDTO;
import com.issue_management.model.Issue;

import java.util.*;
import java.util.stream.Collectors;

public class SimilarityUtil {

    private static final double TITLE_WEIGHT = 0.6;
    private static final double DESC_WEIGHT = 0.4;

    public static List<IssueDuplicateDTO> calculateSimilarities(
            Issue source,
            List<Issue> candidates
    ) {

        Set<String> sourceTitle = toWordSet(source.getTitle());
        Set<String> sourceDesc = toWordSet(source.getDescription());

        return candidates.stream()
                .filter(i -> !i.getId().equals(source.getId()))
                .map(candidate -> {

                    Set<String> titleWords = toWordSet(candidate.getTitle());
                    Set<String> descWords = toWordSet(candidate.getDescription());

                    double titleScore = jaccard(sourceTitle, titleWords);
                    double descScore = jaccard(sourceDesc, descWords);

                    double finalScore =
                            (titleScore * TITLE_WEIGHT) +
                                    (descScore * DESC_WEIGHT);

                    List<String> matched = new ArrayList<>();
                    matched.addAll(intersection(sourceTitle, titleWords));
                    matched.addAll(intersection(sourceDesc, descWords));

                    matched = matched.stream().distinct().limit(5).toList();

                    return new IssueDuplicateDTO(
                            candidate.getId(),
                            candidate.getTitle(),
                            round(finalScore),
                            matched
                    );
                })
                .sorted((a, b) -> Double.compare(b.getSimilarity(), a.getSimilarity()))
                .limit(5)
                .toList();
    }

    private static Set<String> toWordSet(String text) {
        if (text == null) return Set.of();

        return Arrays.stream(text.toLowerCase()
                        .replaceAll("[^a-z0-9 ]", " ")
                        .split("\\s+"))
                .filter(w -> w.length() >= 2)
                .collect(Collectors.toSet());
    }

    private static double jaccard(Set<String> a, Set<String> b) {
        if (a.isEmpty() || b.isEmpty()) return 0;

        Set<String> intersection = new HashSet<>(a);
        intersection.retainAll(b);

        Set<String> union = new HashSet<>(a);
        union.addAll(b);

        return (double) intersection.size() / union.size();
    }

    private static List<String> intersection(Set<String> a, Set<String> b) {
        Set<String> i = new HashSet<>(a);
        i.retainAll(b);
        return new ArrayList<>(i);
    }

    private static double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}

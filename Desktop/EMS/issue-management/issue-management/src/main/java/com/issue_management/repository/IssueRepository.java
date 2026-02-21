package com.issue_management.repository;

import com.issue_management.model.Issue;
import com.issue_management.model.IssueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface IssueRepository extends JpaRepository<Issue, Long> {

        Page<Issue> findByDeletedFalse(Pageable pageable);

        Page<Issue> findByStatusAndDeletedFalse(IssueStatus status, Pageable pageable);

        Optional<Issue> findByIdAndDeletedFalse(Long id);

        Optional<Issue> findByIdAndDeletedTrue(Long id);

        List<Issue> findTop10ByDeletedFalseOrderByCreatedAtDesc();

        List<Issue> findAllByIdIn(List<Long> ids);

        @Query("""
        SELECT DISTINCT i FROM Issue i
        LEFT JOIN FETCH i.duplicates
        WHERE i.id = :id AND i.deleted = false
    """)
        Optional<Issue> findByIdWithDuplicates(@Param("id") Long id);

        @Query("""
        SELECT DISTINCT i FROM Issue i
        LEFT JOIN FETCH i.duplicates
        WHERE i.deleted = false
    """)
        List<Issue> findAllWithDuplicates();

        @Query("""
        SELECT i FROM Issue i
        WHERE i.deleted = false
        AND (LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')))
    """)
        Page<Issue> searchActiveIssues(@Param("query") String query, Pageable pageable);
}

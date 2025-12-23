package com.example.taskmanager.repositories;

import com.example.taskmanager.models.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByProjectId(Long projectId, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.isCompleted = true")
    Long countCompletedTasks(@Param("projectId") Long projectId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    Long countTotalTasks(@Param("projectId") Long projectId);
    
    Optional<Task> findByIdAndProjectId(Long taskId, Long projectId);
    
    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Task> searchTasks(@Param("projectId") Long projectId, 
                           @Param("searchTerm") String searchTerm, 
                           Pageable pageable);
}

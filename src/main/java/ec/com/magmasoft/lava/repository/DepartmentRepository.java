package ec.com.magmasoft.lava.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ec.com.magmasoft.lava.domain.Department;

/**
 * Repository for Department entity
 * 
 * @author moe
 *
 */
public interface DepartmentRepository extends JpaRepository<Department, Long> {

}

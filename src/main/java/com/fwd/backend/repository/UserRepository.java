package com.fwd.backend.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.fwd.backend.domain.User;

@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public abstract interface UserRepository extends CrudRepository<User, Long>, PagingAndSortingRepository<User, Long> {

    public abstract User findByIdUserAndActive(int idUser, boolean active);

    public abstract User findByUsernameAndActive(String username, boolean active);
    
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    User findByUsernameCaseInsensitive(@Param("username") String username);


}

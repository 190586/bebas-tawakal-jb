package com.fwd.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fwd.backend.domain.User;
import com.fwd.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User register(User user) {
        User result = null;
        result = (User) this.userRepository.save(user);
        return result;
    }

    public User findActiveUserByIdUser(int userId) {
        return this.userRepository.findByIdUserAndActive(userId, true);
    }

    public User findActiveUserByUsername(String username) {
        return this.userRepository.findByUsernameAndActive(username, true);
    }

    public User save(User user) {
    	//user.setPassword(passwordEncoder.encode(user.getPassword()));
        return (User) this.userRepository.save(user);
    }

    public void delete(User user) {
        this.userRepository.delete(user);
    }
   
    
   
}

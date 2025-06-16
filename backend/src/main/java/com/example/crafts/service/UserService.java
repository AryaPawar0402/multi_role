package com.example.crafts.service;

import com.example.crafts.entity.User;
import com.example.crafts.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // ✅ only encode here
        return userRepository.save(user).getName() + " registered successfully!";
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public void updateProfile(String email, User updatedUser) {
        User user = getUserByEmail(email);
        if (user != null) {
            user.setName(updatedUser.getName());
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword())); // ✅ encode updated password here
            userRepository.save(user);
        }
    }
}

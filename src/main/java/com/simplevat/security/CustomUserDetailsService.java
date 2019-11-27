package com.simplevat.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.simplevat.entity.User;
import com.simplevat.service.UserServiceNew;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * The Class UserLoginService
 */
@Component
public class CustomUserDetailsService implements UserDetailsService
{
    @Autowired
    private UserServiceNew userService;

    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String emailAddress)
            throws UsernameNotFoundException {
        Optional<User> user = userService.getUserByEmail(emailAddress);

        if (user.isPresent()) {
            return new CustomUserDetails(user.get());
        } else {
            throw new UsernameNotFoundException("Email not found");
        }
    }

}
package com.fwd.backend.config;

import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;

import com.fwd.backend.domain.User;
import com.fwd.backend.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;


@Component("userDetailsService")
public class UserDetailsService implements
		org.springframework.security.core.userdetails.UserDetailsService {

	private final Logger log = LoggerFactory
			.getLogger(UserDetailsService.class);

	@Autowired
	private HttpServletRequest request;

	@Autowired
	private UserRepository userRepository;


	@Override
	@Transactional
	public UserDetails loadUserByUsername(final String login) {

		log.debug("Authenticating {}", login);
		String lowercaseLogin = login.toLowerCase();

		String ip = getClientIP();

		User userFromDatabase = userRepository
				.findByUsernameCaseInsensitive(lowercaseLogin);
		
		if (userFromDatabase == null) {
			throw new UsernameNotFoundException("User " + lowercaseLogin
					+ " was not found in the database");
		} 

		Collection<GrantedAuthority> grantedAuthorities = new ArrayList<>();
	//	for (Role authority : userFromDatabase.getRole()) {
			GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_"+
					userFromDatabase.getRole());
			grantedAuthorities.add(grantedAuthority);
		//}
		
		return new org.springframework.security.core.userdetails.User(
				userFromDatabase.getUsername(), userFromDatabase.getPassword(),
				grantedAuthorities);
	}

	public UserDetailsService() {
		super();
	}

	private String getClientIP() {
		String xfHeader = request.getHeader("X-Forwarded-For");
		if (xfHeader == null) {
			return request.getRemoteAddr();
		}
		return xfHeader.split(",")[0];
	}

}


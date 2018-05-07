package com.fwd.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.web.SpringBootServletInitializer;

@SpringBootApplication
public class TestApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(TestApplication.class, args);
	}

	// @Override
	// protected SpringApplicationBuilder configure(
	// SpringApplicationBuilder application) {
	// return application.sources(TestApplication.class);
	// }

}

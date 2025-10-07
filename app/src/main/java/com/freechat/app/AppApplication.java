package com.freechat.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.freechat" })
public class AppApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);

	}

}

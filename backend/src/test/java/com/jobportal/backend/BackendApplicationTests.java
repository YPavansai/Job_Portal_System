package com.jobportal.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BackendApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void testAnonymousGetJobs() throws Exception {
		mockMvc.perform(get("/api/jobs")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	void testUserAuthFlow() throws Exception {
		// 1. Register candidate
		String registerJson = "{" +
				"\"name\":\"Test Candidate\"," +
				"\"email\":\"candidate@test.com\"," +
				"\"password\":\"password123\"," +
				"\"role\":\"CANDIDATE\"" +
				"}";

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(registerJson))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.message").value("User registered successfully!"));

		// 2. Login candidate
		String loginJson = "{" +
				"\"email\":\"candidate@test.com\"," +
				"\"password\":\"password123\"" +
				"}";

		mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(loginJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").exists())
				.andExpect(jsonPath("$.name").value("Test Candidate"))
				.andExpect(jsonPath("$.role").value("CANDIDATE"));
	}

	@Test
	void testAdminRegistrationBlocked() throws Exception {
		String adminRegisterJson = "{" +
				"\"name\":\"Test Admin\"," +
				"\"email\":\"admin_register@test.com\"," +
				"\"password\":\"password123\"," +
				"\"role\":\"ADMIN\"" +
				"}";

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(adminRegisterJson))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testAdminLogin() throws Exception {
		String adminLoginJson = "{" +
				"\"email\":\"admin@gmail.com\"," +
				"\"password\":\"admin\"" +
				"}";

		mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(adminLoginJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").exists())
				.andExpect(jsonPath("$.name").value("System Admin"))
				.andExpect(jsonPath("$.role").value("ADMIN"));
	}
}

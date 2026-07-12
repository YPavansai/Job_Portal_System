package com.jobportal.backend.config;

import com.jobportal.backend.entity.*;
import com.jobportal.backend.repository.CandidateProfileRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure Admin user always exists
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        if (userRepository.count() > 1) {
            return; // Database already seeded or contains user accounts
        }

        // 1. Create Default Candidate User
        User candidate = User.builder()
                .name("Jane Smith")
                .email("candidate@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.CANDIDATE)
                .build();
        User savedCandidate = userRepository.save(candidate);

        // Pre-create profile for default candidate
        CandidateProfile profile = CandidateProfile.builder()
                .user(savedCandidate)
                .phone("+1 555-0101")
                .title("Software Engineer | React & Spring Boot")
                .bio("Dedicated full-stack software engineer with 3+ years of experience building modern web applications. Passionate about clean code, performance optimization, and scalable microservices.")
                .skills("React, JavaScript, Java, Spring Boot, PostgreSQL, Git, REST APIs")
                .education("B.S. in Computer Science - Stanford University")
                .experience("Software Engineering Intern - Google (6 months)\nAssociate Developer - TechCorp (2 years)")
                .resumeUrl("")
                .build();
        candidateProfileRepository.save(profile);

        // 2. Create Recruiter Users
        User googleRecruiter = User.builder()
                .name("Sundar Pichai")
                .email("recruiter@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.RECRUITER)
                .companyName("Google")
                .build();
        userRepository.save(googleRecruiter);

        User metaRecruiter = User.builder()
                .name("Mark Zuckerberg")
                .email("meta_recruiter@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.RECRUITER)
                .companyName("Meta Platforms")
                .build();
        userRepository.save(metaRecruiter);

        User netflixRecruiter = User.builder()
                .name("Reed Hastings")
                .email("netflix_recruiter@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.RECRUITER)
                .companyName("Netflix")
                .build();
        userRepository.save(netflixRecruiter);

        User stripeRecruiter = User.builder()
                .name("Patrick Collison")
                .email("stripe_recruiter@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.RECRUITER)
                .companyName("Stripe")
                .build();
        userRepository.save(stripeRecruiter);

        // 3. Seed Diverse Jobs
        List<Job> mockJobs = Arrays.asList(
                // Google Jobs
                Job.builder()
                        .title("AI Research Engineer")
                        .description("Join Google DeepMind to design and implement state-of-the-art agentic AI frameworks. You will research new architectures, collaborate on large-scale model training, and publish top-tier papers.")
                        .requirements("Ph.D. in Computer Science or related field\nExtensive Python, PyTorch/Jax experience\nStrong understanding of Transformers, LLMs, and reinforcement learning")
                        .location("London, UK (Hybrid)")
                        .salaryRange("$150,000 - $220,000")
                        .jobType(JobType.FULL_TIME)
                        .experienceLevel("Senior")
                        .postedBy(googleRecruiter)
                        .active(true)
                        .build(),

                Job.builder()
                        .title("Frontend Developer (React)")
                        .description("Help shape the future of our cloud dashboards. In this role, you will build responsive, accessible, and high-performance user interfaces using React, TypeScript, and modern state-management frameworks.")
                        .requirements("3+ years of React production experience\nStrong semantic HTML/CSS skills\nFamiliarity with Vite, Webpack, or similar bundling tools")
                        .location("San Francisco, CA")
                        .salaryRange("$110,000 - $145,000")
                        .jobType(JobType.FULL_TIME)
                        .experienceLevel("Mid-Level")
                        .postedBy(googleRecruiter)
                        .active(true)
                        .build(),

                Job.builder()
                        .title("Cloud Infrastructure Intern")
                        .description("Gain hands-on experience in building and configuring scalable global systems. Work directly alongside Senior SREs to monitor clusters, automate CI/CD pipelines, and manage container orchestrators.")
                        .requirements("Enrolled in a B.S. or M.S. in Computer Science program\nBasic Linux administration skills\nFamiliarity with Docker or Kubernetes is a plus")
                        .location("Sunnyvale, CA (Onsite)")
                        .salaryRange("$45 - $60 / hour")
                        .jobType(JobType.INTERNSHIP)
                        .experienceLevel("Entry-Level")
                        .postedBy(googleRecruiter)
                        .active(true)
                        .build(),

                // Meta Jobs
                Job.builder()
                        .title("Senior Android Engineer")
                        .description("Deliver high-fidelity features for billions of active users on Meta apps. You will optimize rendering pipelines, lead architectural overhauls, and collaborate on cross-functional teams.")
                        .requirements("5+ years of native Android application development\nProficient in Kotlin and Jetpack Compose\nDeep knowledge of multithreading, local databases, and offline synchronization")
                        .location("Seattle, WA")
                        .salaryRange("$170,000 - $240,000")
                        .jobType(JobType.FULL_TIME)
                        .experienceLevel("Senior")
                        .postedBy(metaRecruiter)
                        .active(true)
                        .build(),

                Job.builder()
                        .title("Product Manager (Metaverse)")
                        .description("Drive the product vision and roadmapping for the next generation of social virtual reality environments. Coordinate between hardware engineers, designers, and software leads.")
                        .requirements("4+ years of product management in gaming or VR space\nExcellent communication and cross-functional coordination\nData-driven decision making capabilities")
                        .location("Remote")
                        .salaryRange("$130,000 - $180,000")
                        .jobType(JobType.REMOTE)
                        .experienceLevel("Senior")
                        .postedBy(metaRecruiter)
                        .active(true)
                        .build(),

                Job.builder()
                        .title("Database Administrator")
                        .description("Maintain, secure, and optimize massive distributed database clusters. Identify bottlenecks, manage schema changes, and coordinate disaster recovery plans.")
                        .requirements("3+ years experience managing MySQL, PostgreSQL, or Oracle production systems\nStrong SQL scripting skills\nExperience with high-availability systems")
                        .location("Austin, TX")
                        .salaryRange("$95,000 - $130,000")
                        .jobType(JobType.CONTRACT)
                        .experienceLevel("Mid-Level")
                        .postedBy(metaRecruiter)
                        .active(true)
                        .build(),

                // Netflix Jobs
                Job.builder()
                        .title("Senior Platform Systems Engineer")
                        .description("Design high-throughput backend APIs to support global media encoding pipelines. You will optimize Java Spring Boot microservices and build resilient, auto-scaling AWS infrastructure.")
                        .requirements("6+ years in Java backend engineering\nProduction experience with Spring Boot, Spring Cloud, and JPA/Hibernate\nExperience with Redis caching and Kafka event streams")
                        .location("Los Gatos, CA")
                        .salaryRange("$200,000 - $280,000")
                        .jobType(JobType.FULL_TIME)
                        .experienceLevel("Senior")
                        .postedBy(netflixRecruiter)
                        .active(true)
                        .build(),

                Job.builder()
                        .title("Data Scientist (Algorithms)")
                        .description("Develop recommendations and user retention algorithms. Apply regression, clustering, and deep learning models to predict user preferences and improve personalization.")
                        .requirements("M.S. or Ph.D. in Statistics, Mathematics, or Data Science\nExpertise in Python, Pandas, NumPy, Scikit-Learn\nExperience building ETL pipelines with SQL / BigQuery")
                        .location("Remote")
                        .salaryRange("$160,000 - $210,000")
                        .jobType(JobType.REMOTE)
                        .experienceLevel("Mid-Level")
                        .postedBy(netflixRecruiter)
                        .active(true)
                        .build(),

                // Stripe Jobs
                Job.builder()
                        .title("Staff Security Architect")
                        .description("Lead threat modeling, code audits, and architectural designs for Stripe's core global checkout APIs. Mitigate vulnerabilities and ensure strict compliance benchmarks.")
                        .requirements("8+ years of cybersecurity architecture experience\nProficient in cryptography, OAuth, and web security standards\nFluent in Java, Ruby, or Go")
                        .location("New York, NY (Hybrid)")
                        .salaryRange("$220,000 - $310,000")
                        .jobType(JobType.FULL_TIME)
                        .experienceLevel("Senior")
                        .postedBy(stripeRecruiter)
                        .active(true)
                        .build(),

                Job.builder()
                        .title("Technical Support Specialist")
                        .description("Assist merchant engineers globally in integrating Stripe's checkout APIs. Debug customer webhooks, check logs, and write sample code templates in React and Spring Boot.")
                        .requirements("B.S. in Computer Science or equivalent software literacy\nSolid understanding of REST APIs, HTTP codes, and JSON payloads\nExcellent written communication")
                        .location("Dublin, Ireland (Hybrid)")
                        .salaryRange("$65,000 - $85,000")
                        .jobType(JobType.FULL_TIME)
                        .experienceLevel("Entry-Level")
                        .postedBy(stripeRecruiter)
                        .active(true)
                        .build(),

                Job.builder()
                        .title("Backend Engineer (Spring Boot)")
                        .description("Build highly reliable ledger APIs that process billions of events daily. Design schemas, implement transaction isolation rules, and optimize database read performance.")
                        .requirements("3+ years of Spring Boot development experience\nStrong foundation in relational databases (PostgreSQL/H2)\nSolid unit-testing methodologies (JUnit/Mockito)")
                        .location("Remote")
                        .salaryRange("$120,000 - $160,000")
                        .jobType(JobType.REMOTE)
                        .experienceLevel("Mid-Level")
                        .postedBy(stripeRecruiter)
                        .active(true)
                        .build(),

                Job.builder()
                        .title("QA Automation Analyst")
                        .description("Design, write, and execute automated regression test suites. Build test automation runners using Selenium, Cypress, or Playwright to improve delivery confidence.")
                        .requirements("2+ years experience in software test automation\nProficient with Javascript, Python, or Java test runners\nFamiliarity with CI/CD tools like Github Actions")
                        .location("Chicago, IL")
                        .salaryRange("$80,000 - $105,000")
                        .jobType(JobType.CONTRACT)
                        .experienceLevel("Mid-Level")
                        .postedBy(stripeRecruiter)
                        .active(true)
                        .build()
        );

        jobRepository.saveAll(mockJobs);
    }
}

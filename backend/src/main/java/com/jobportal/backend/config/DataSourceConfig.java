package com.jobportal.backend.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import javax.sql.DataSource;
import java.net.Socket;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(Environment env) {
        String mysqlUrl = env.getProperty("spring.datasource.url");
        String mysqlUsername = env.getProperty("spring.datasource.username");
        String mysqlPassword = env.getProperty("spring.datasource.password");
        String driverClassName = env.getProperty("spring.datasource.driver-class-name");

        // If the URL is explicitly set to H2 (e.g. in test environment), bypass MySQL checks entirely
        if (mysqlUrl != null && mysqlUrl.startsWith("jdbc:h2:")) {
            System.out.println(">>> H2 database URL detected. Connecting directly to H2...");
            return DataSourceBuilder.create()
                    .driverClassName(driverClassName != null ? driverClassName : "org.h2.Driver")
                    .url(mysqlUrl)
                    .username(mysqlUsername)
                    .password(mysqlPassword)
                    .build();
        }

        String host = "localhost";
        int port = 3306;

        try {
            if (mysqlUrl != null && mysqlUrl.startsWith("jdbc:mysql://")) {
                String cleanUrl = mysqlUrl.substring("jdbc:mysql://".length());
                int slashIndex = cleanUrl.indexOf('/');
                String hostPort = slashIndex != -1 ? cleanUrl.substring(0, slashIndex) : cleanUrl;
                if (hostPort.contains(":")) {
                    String[] parts = hostPort.split(":");
                    host = parts[0];
                    port = Integer.parseInt(parts[1]);
                } else {
                    host = hostPort;
                }
            }
        } catch (Exception e) {
            // Fallback parsing failed, use defaults
        }

        boolean mysqlAvailable = false;
        try (Socket socket = new Socket(host, port)) {
            mysqlAvailable = true;
        } catch (Exception e) {
            // MySQL port unreachable
        }

        if (mysqlAvailable) {
            System.out.println(">>> MySQL database detected at " + host + ":" + port + ". Connecting to MySQL...");
            return DataSourceBuilder.create()
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .url(mysqlUrl)
                    .username(mysqlUsername)
                    .password(mysqlPassword)
                    .build();
        } else {
            System.err.println(">>> WARNING: MySQL database unreachable at " + host + ":" + port + ".");
            System.err.println(">>> Falling back to local file-based H2 database (./data/jobportaldb)...");
            return DataSourceBuilder.create()
                    .driverClassName("org.h2.Driver")
                    .url("jdbc:h2:file:./data/jobportaldb;DB_CLOSE_DELAY=-1;MODE=MySQL")
                    .username("sa")
                    .password("")
                    .build();
        }
    }
}

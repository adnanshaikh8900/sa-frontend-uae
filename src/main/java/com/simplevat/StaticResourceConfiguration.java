package com.simplevat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.simplevat.utils.OSValidator;

@Configuration
public class StaticResourceConfiguration implements WebMvcConfigurer {

	private final Logger LOGGER = LoggerFactory.getLogger(StaticResourceConfiguration.class);

	@Value("${simplevat.filelocation}")
	private String fileLocationWindows;

	@Value("${simplevat.filelocation.linux}")
	private String fileLocationLinux;

	@Autowired
	OSValidator osVaidator;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		String fileLocation = "file:////" + fileLocationLinux;
		if (OSValidator.isWindows()) {
			fileLocation = "file:////" + fileLocationWindows;
			LOGGER.info("WINDOW SYSTEM");
		} else {
			LOGGER.info("LINUX SYSTEM");
		}
		registry.addResourceHandler("/file/**").addResourceLocations(fileLocation);
		registry.addResourceHandler("/swagger-ui.html**")
				.addResourceLocations("classpath:/META-INF/resources/swagger-ui.html");
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}

	/*
	 * set basePath for uploading file bases upon system specify path in properties
	 * file
	 */
	@Bean(name = { "basePath" })
	public String getFileBaseLocation() {

		String fileLocation = fileLocationLinux;
		if (OSValidator.isWindows()) {
			fileLocation = fileLocationWindows;
			LOGGER.info("WINDOW SYSTEM");
		} else {
			LOGGER.info("LINUX SYSTEM");
		}
		return fileLocation;
	}

}

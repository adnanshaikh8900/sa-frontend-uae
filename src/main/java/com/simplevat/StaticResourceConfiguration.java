package com.simplevat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.simplevat.helper.ExpenseRestHelper;
import com.simplevat.utils.OSValidator;

@Configuration
public class StaticResourceConfiguration implements WebMvcConfigurer {

	private final static Logger LOGGER = LoggerFactory.getLogger(ExpenseRestHelper.class);

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
}

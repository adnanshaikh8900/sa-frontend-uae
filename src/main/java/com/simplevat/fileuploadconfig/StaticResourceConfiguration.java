package com.simplevat.fileuploadconfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.simplevat.utils.OSValidator;

@Configuration
public class StaticResourceConfiguration implements WebMvcConfigurer {

	@Autowired
	OSValidator osVaidator;

	/* @link com.simplevat.fileuploadconfig.FileUploadConfig#getFileBaseLocation  */
	@Autowired
	private String basePath;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		/*
		 * map "/file/" to base folder to access file from server
		 */
		registry.addResourceHandler("/file/**").addResourceLocations(basePath);
		registry.addResourceHandler("/swagger-ui.html**")
				.addResourceLocations("classpath:/META-INF/resources/swagger-ui.html");
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}

}

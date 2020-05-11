package com.simplevat.configcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.constant.ConfigurationConstants;

import io.swagger.annotations.ApiOperation;


@RestController
@RequestMapping("/config")
public class ConfigController{

	@Autowired
	private Environment env;

	@ApiOperation(value = "Get Release Number")
	@GetMapping(value = "/getreleasenumber")
	public SimpleVatConfigModel getReleaseNumber()
	{
		SimpleVatConfigModel config = new SimpleVatConfigModel();
		if (env.getProperty(ConfigurationConstants.SIMPLEVAT_RELEASE) != null && !env.getProperty(ConfigurationConstants.SIMPLEVAT_RELEASE).isEmpty()) {
			config.setSimpleVatRelease(env.getProperty("SIMPLEVAT_RELEASE"));
		}
		else if (env.getProperty(ConfigurationConstants.GAE_VERSION) != null && !env.getProperty(ConfigurationConstants.GAE_VERSION).isEmpty()) {
			config.setSimpleVatRelease(env.getProperty(ConfigurationConstants.GAE_VERSION));
		}
		else {
			config.setSimpleVatRelease("Unknown");
		}

		return config;
	}
}

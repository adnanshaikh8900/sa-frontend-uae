package com.simplevat.configController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;

import java.io.Serializable;

@RestController
@RequestMapping("/config")
public class ConfigController implements Serializable {

	@Autowired
	private Environment env;

	@ApiOperation(value = "Get Release Number")
	@GetMapping(value = "/getreleasenumber")
	private SimpleVatConfigModel getReleaseNumber()
	{
		SimpleVatConfigModel config = new SimpleVatConfigModel();
		if (env.getProperty("SIMPLEVAT_RELEASE") != null && !env.getProperty("SIMPLEVAT_RELEASE").isEmpty()) {
			config.setSimpleVatRelease(env.getProperty("SIMPLEVAT_RELEASE"));
		}
		else if (env.getProperty("GAE_VERSION") != null && !env.getProperty("GAE_VERSION").isEmpty()) {
			config.setSimpleVatRelease(env.getProperty("GAE_VERSION"));
		}
		else {
			config.setSimpleVatRelease("Unknown");
		}

		return config;
	}
}

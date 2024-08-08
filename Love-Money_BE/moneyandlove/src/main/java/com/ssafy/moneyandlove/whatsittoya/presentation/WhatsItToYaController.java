package com.ssafy.moneyandlove.whatsittoya.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.whatsittoya.application.WhatsItToYaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/whats-it-to-ya")
@RequiredArgsConstructor
public class WhatsItToYaController {

	private final WhatsItToYaService whatsItToYaService;

	@GetMapping()
	public ResponseEntity<List<String>> getFiveKeyWords(){
		List<String> keywordList = whatsItToYaService.getFiveKeyWords();
		return ResponseEntity.ok(keywordList);
	}
}

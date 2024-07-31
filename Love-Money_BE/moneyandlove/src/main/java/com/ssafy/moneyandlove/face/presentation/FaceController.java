package com.ssafy.moneyandlove.face.presentation;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.face.application.FaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/face")
public class FaceController {

	private final FaceService faceService;

	@GetMapping
	public ResponseEntity<Map<String, String>> getPresignedUrl(@RequestParam Long userId, @RequestParam String prefix, @RequestParam String imageName) {
		Map<String, String> presignedUrl = faceService.getPresignedUrl( prefix, imageName, userId);
		return new ResponseEntity<>(presignedUrl, HttpStatus.OK);
	}
}

package com.ssafy.moneyandlove.face.presentation;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.face.application.FaceService;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/face")
public class FaceController {

	private final FaceService faceService;

	@GetMapping
	public ResponseEntity<Map<String, String>> getPresignedUrl(@LoginUser User loginUser, @RequestParam String prefix, @RequestParam String imageName) {
		Map<String, String> presignedUrl = faceService.getPresignedUrl( prefix, imageName, loginUser.getId());
		return new ResponseEntity<>(presignedUrl, HttpStatus.OK);
	}

	@GetMapping("/score")
	public ResponseEntity<Map<String, Integer>> getFaceScore(@LoginUser User loginUser) {
		Map<String, Integer> result = new HashMap<>();
		result.put("faceScore",faceService.getFaceScoreByUserId(loginUser.getId()));
		return ResponseEntity.ok(result);
	}

    @PutMapping("/score")
	public ResponseEntity<?> updateFaceScore(@LoginUser User loginUser, @RequestBody Map<String, Integer> score){
		faceService.updateFaceScore(loginUser.getId(), score.get("faceScore"));
		return ResponseEntity.ok().build();
	}

}

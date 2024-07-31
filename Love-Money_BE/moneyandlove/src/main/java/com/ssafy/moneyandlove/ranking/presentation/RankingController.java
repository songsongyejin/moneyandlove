package com.ssafy.moneyandlove.ranking.presentation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.ranking.application.RankingService;
import com.ssafy.moneyandlove.ranking.dto.RankingUserResponse;
import com.ssafy.moneyandlove.ranking.dto.UpdateRankingRequest;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rankings")
public class RankingController {

	private final RankingService rankingService;

	@PostMapping
	public ResponseEntity<RankingUserResponse> createRanking(@LoginUser User loginUser){
		rankingService.createRanking(loginUser.getId());
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> getRankings(@LoginUser User loginUser) {
		List<RankingUserResponse> rankList = rankingService.getTopRankings();
		RankingUserResponse myRank = rankingService.getMyRanking(loginUser.getId());

		Map<String, Object> response = new HashMap<>();
		response.put("rankList", rankList);
		response.put("myRank", myRank);

		return ResponseEntity.ok(response);
	}

	@PutMapping
	public ResponseEntity<?> updateRankingPoint(@LoginUser User loginUser, @RequestBody UpdateRankingRequest updateRankingRequest){
		rankingService.updateRankingPoint(loginUser.getId(), updateRankingRequest.getRankPoint());
		return ResponseEntity.status(HttpStatus.OK).build();
	}
}
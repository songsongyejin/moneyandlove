package com.ssafy.moneyandlove.ranking.presentation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.ranking.application.RankingService;
import com.ssafy.moneyandlove.ranking.dto.RankingUserResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rankings")
public class RankingController {

	private final RankingService rankingService;

	@GetMapping
	public ResponseEntity<Map<String, Object>> getRankings(@RequestParam Long userId) {
		List<RankingUserResponse> rankList = rankingService.getAllRankings();
		RankingUserResponse myRank = rankingService.getMyRanking(userId);

		Map<String, Object> response = new HashMap<>();
		response.put("rankList", rankList);
		response.put("myRank", myRank);

		return ResponseEntity.ok(response);
	}
}

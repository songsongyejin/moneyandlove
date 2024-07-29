package com.ssafy.moneyandlove.ranking.application;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.moneyandlove.ranking.domain.Ranking;
import com.ssafy.moneyandlove.ranking.dto.RankingResponse;
import com.ssafy.moneyandlove.ranking.dto.RankingUserResponse;
import com.ssafy.moneyandlove.ranking.repository.RankingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RankingService {

	private final RankingRepository rankingRepository;

	public List<RankingUserResponse> getAllRankings() {
		return rankingRepository.findAllRankings();
	}

	public RankingUserResponse getMyRanking(Long userId) {
		return rankingRepository.findMyRanking(userId);
	}

}



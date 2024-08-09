package com.ssafy.moneyandlove.ranking.application;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.ranking.domain.Ranking;
import com.ssafy.moneyandlove.ranking.dto.RankingUserResponse;
import com.ssafy.moneyandlove.ranking.repository.RankingRepository;
import com.ssafy.moneyandlove.user.domain.User;
import com.ssafy.moneyandlove.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RankingService {

	private final RankingRepository rankingRepository;
	private final UserRepository userRepository;

	public Map<String, Object> getTopRankings(int limit, Long userId) {
		List<RankingUserResponse> rankings = rankingRepository.findAllRankings();

		AtomicLong rank = new AtomicLong(1);
		// 순위를 계산하면서 목록을 구성
		List<RankingUserResponse> allRankList = rankings.stream()
				.peek(ranking -> ranking.putRankNumber(rank.getAndIncrement()))
				.collect(Collectors.toList());

		// 내 랭킹 찾기
		Ranking myRankingInfo = rankingRepository.findByUserId(userId)
				.orElseThrow(() -> new MoneyAndLoveException(ErrorType.RANKING_NOT_FOUND));

		Optional<RankingUserResponse> myRanking = allRankList.stream()
				.filter(ranking -> ranking.getRankingId().equals(myRankingInfo.getId()))
				.findFirst();

		List<RankingUserResponse> rankList = rankings.subList(0, Math.min(limit, rankings.size()));

		Map<String, Object> response = new HashMap<>();
		response.put("rankList", rankList);
		response.put("myRank", myRanking);

		return response;
	}

	public RankingUserResponse getMyRanking(Long userId) {
		return rankingRepository.findMyRanking(userId)
				.orElseThrow(()-> new MoneyAndLoveException(ErrorType.RANKING_USER_NOT_FOUND));
	}

	@Transactional
	public void updateRankingPoint(Long userId, Long rankPoint) {
		Ranking ranking = rankingRepository.findByUserId(userId)
			.orElseThrow(()-> new MoneyAndLoveException(ErrorType.RANKING_NOT_FOUND));
		ranking.updateRankingPoint(rankPoint);
		rankingRepository.save(ranking);
	}

	@Transactional
	public void createRanking(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(()->new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));
		Ranking newRanking = Ranking.builder().user(user).rankPoint(0L).build();
		rankingRepository.save(newRanking);
	}
}



package com.ssafy.moneyandlove.ranking.application;

import java.util.List;
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

	public List<RankingUserResponse> getTopRankings() {
		PageRequest pageRequest = PageRequest.of(0, 20);
		return rankingRepository.findTopRankings(pageRequest);
	}

	public RankingUserResponse getMyRanking(Long userId) {
		return rankingRepository.findMyRanking(userId)
				.orElseThrow(()-> new MoneyAndLoveException(ErrorType.RANKING_USER_NOT_FOUND));
	}

	@Transactional
	public void updateRankingPoint(Long userId, Long rankPoint) {
		Ranking ranking = rankingRepository.findByUserId(userId)
			.orElseThrow(()-> new MoneyAndLoveException(ErrorType.RANKING_NOT_FOUND));
		ranking.updateRankingPoint(ranking.getRankPoint()+rankPoint);
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



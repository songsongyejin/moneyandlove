package com.ssafy.moneyandlove.ranking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.moneyandlove.ranking.domain.Ranking;
import com.ssafy.moneyandlove.ranking.dto.RankingUserResponse;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Long> {

	Optional<Ranking> findByUserId(Long userId);

	@Query("SELECT new com.ssafy.moneyandlove.ranking.dto.RankingUserResponse(u.nickname, f.montageURL, r.rankPoint) " +
		"FROM Ranking r " +
		"JOIN r.user u " +
		"LEFT JOIN Face f ON f.user.id = u.id " +
		"ORDER BY r.rankPoint DESC")
	List<RankingUserResponse> findTopRankings(Pageable pageable);

	@Query("SELECT new com.ssafy.moneyandlove.ranking.dto.RankingUserResponse(u.nickname, f.montageURL, r.rankPoint) " +
		"FROM Ranking r " +
		"JOIN r.user u " +
		"LEFT JOIN Face f ON f.user.id = u.id " +
		"WHERE u.id = :userId")
	Optional <RankingUserResponse> findMyRanking(@Param("userId") Long userId);

}

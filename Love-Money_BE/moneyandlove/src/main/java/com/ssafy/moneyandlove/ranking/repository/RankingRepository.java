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

	@Query(value = "SELECT u.nickname AS nickName, f.montageurl AS montage, r.rank_point AS rankPoint, " +
			"ROW_NUMBER() OVER(ORDER BY r.rank_point DESC) AS rankNumber " +
			"FROM ranking r " +
			"JOIN user u ON r.user_id = u.user_id " +
			"LEFT JOIN face f ON f.user_id = u.user_id " +
			"ORDER BY r.rank_point DESC LIMIT :limit", nativeQuery = true)
	List<RankingUserResponse> findTopRankings(@Param("limit") int limit);

	@Query(value = "SELECT u.nickname AS nickName, f.montageurl AS montage, r.rank_point AS rankPoint, " +
			"ROW_NUMBER() OVER(ORDER BY r.rank_point DESC) AS rankNumber " +
			"FROM ranking r " +
			"JOIN user u ON r.user_id = u.user_id " +
			"LEFT JOIN face f ON f.user_id = u.user_id " +
			"WHERE u.user_id = :userId", nativeQuery = true)
	Optional<RankingUserResponse> findMyRanking(@Param("userId") Long userId);



}

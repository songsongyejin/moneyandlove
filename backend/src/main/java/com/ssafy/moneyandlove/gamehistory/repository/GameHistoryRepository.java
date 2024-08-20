package com.ssafy.moneyandlove.gamehistory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.moneyandlove.gamehistory.domain.GameHistory;
import com.ssafy.moneyandlove.gamehistory.dto.ReadGameHistoryResponse;

@Repository
public interface GameHistoryRepository extends JpaRepository<GameHistory, Long> {

	GameHistory findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);

	@Query("SELECT new com.ssafy.moneyandlove.gamehistory.dto.ReadGameHistoryResponse(" +
		"gh.id, gh.fromUser.nickname, gh.toUser.nickname, gh.fromUserSelectType, gh.toUserSelectType, gh.createdAt) " +
		"FROM GameHistory gh WHERE gh.fromUser.id = :fromUserId")
	List<ReadGameHistoryResponse> findGameHistoriesByFromUserId(@Param("fromUserId") Long fromUserId);

}

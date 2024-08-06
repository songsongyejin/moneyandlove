package com.ssafy.moneyandlove.gamehistory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.moneyandlove.gamehistory.domain.GameHistory;

@Repository
public interface GameHistoryRepository extends JpaRepository<GameHistory, Long> {
	List<GameHistory> findByFromUserId(Long fromUserId);
	GameHistory findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);
}

package com.ssafy.moneyandlove.user.repository;

import java.util.Optional;

import com.ssafy.moneyandlove.matching.dto.MatchingUserResponse;
import com.ssafy.moneyandlove.user.domain.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.moneyandlove.user.domain.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByKakaoId(Long kakaId);

	@Query("SELECT new com.ssafy.moneyandlove.matching.dto.MatchingUserResponse(u.id, u.nickname, u.profileURL, u.age, u.gender, :firstPosition, :matchType) " +
			"FROM User u WHERE u.id = :userId")
	MatchingUserResponse findUserDetailsById(@Param("userId") Long userId,
											 @Param("firstPosition") String firstPosition,
											 @Param("matchType") String matchType);

	@Query("SELECT u.gender FROM User u WHERE u.id = :userId")
	Gender findGenderByUserId(@Param("userId") Long userId);

	@Query("SELECT u.gamePoint FROM User u WHERE u.id = :userId")
	Long findgamePointByUserId(@Param("userId") Long userId);
}

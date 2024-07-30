package com.ssafy.moneyandlove.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.moneyandlove.user.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByKakaoId(Long kakaId);
}

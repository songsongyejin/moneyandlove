package com.ssafy.moneyandlove.user.repository;

import com.ssafy.moneyandlove.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

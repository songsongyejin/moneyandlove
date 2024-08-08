package com.ssafy.moneyandlove.whatsittoya.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ssafy.moneyandlove.whatsittoya.domain.WhatsItToYa;

@Repository
public interface WhatsItToYaRepository extends JpaRepository<WhatsItToYa, Long> {
	@Query(value = "SELECT word FROM whats_it_to_ya ORDER BY RAND() LIMIT 5", nativeQuery = true)
	List<String> findRandomWords();
}

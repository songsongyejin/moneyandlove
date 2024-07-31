package com.ssafy.moneyandlove.face.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.moneyandlove.face.domain.Face;

@Repository
public interface FaceRepository extends JpaRepository<Face, Long> {
	Optional<Face> findFaceByUserId(Long userId);
}

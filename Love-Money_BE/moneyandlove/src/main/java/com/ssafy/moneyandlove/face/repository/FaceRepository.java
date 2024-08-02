package com.ssafy.moneyandlove.face.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ssafy.moneyandlove.face.domain.Face;

@Repository
public interface FaceRepository extends JpaRepository<Face, Long> {
	Optional<Face> findFaceByUserId(Long userId);

	@Query(value = "SELECT f FROM Face f ORDER BY f.faceScore DESC")
	List<Face> findAllOrderByFaceScoreDesc();

	@Query("SELECT f.user.id FROM Face f ORDER BY f.faceScore DESC")
	List<Long> findAllUserIdsOrderByFaceScoreDesc();
}

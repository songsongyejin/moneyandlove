package com.ssafy.moneyandlove.face.application;

import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.Headers;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.face.domain.Face;
import com.ssafy.moneyandlove.face.repository.FaceRepository;
import com.ssafy.moneyandlove.user.domain.User;
import com.ssafy.moneyandlove.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FaceService {
	@Value("${cloud.s3.bucket}")
	private String bucket;

	private final AmazonS3 amazonS3;

	private final FaceRepository faceRepository;

	private final UserRepository userRepository;

	private static final String TOP_30_PERCENT_FACES_CACHE = "top30PercentFaces";

	public Map<String, String> getPresignedUrl(String prefix, String fileName, Long userId) {
		if (!prefix.isEmpty()) {
			fileName = createPath(prefix, fileName);
		}

		GeneratePresignedUrlRequest generatePresignedUrlRequest = getGeneratePresignedUrlRequest(bucket, fileName);
		URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

		//url 저장
		if(prefix.equals("montage")){
			saveUrlToFace(url, userId);
		}else{
			saveUrlToUser(url, userId);
		}

		return Map.of("url", url.toString());
	}

	private GeneratePresignedUrlRequest getGeneratePresignedUrlRequest(String bucket, String fileName) {
		GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, fileName)
			.withMethod(HttpMethod.PUT)
			.withExpiration(getPresignedUrlExpiration());

		generatePresignedUrlRequest.addRequestParameter(
			Headers.S3_CANNED_ACL,
			CannedAccessControlList.PublicRead.toString()
		);

		return generatePresignedUrlRequest;
	}

	private Date getPresignedUrlExpiration() {
		Date expiration = new Date();
		long expTimeMillis = expiration.getTime();
		expTimeMillis += 1000 * 60 * 2;
		expiration.setTime(expTimeMillis);

		return expiration;
	}

	private String createFileId() {
		return UUID.randomUUID().toString();
	}

	private String createPath(String prefix, String fileName) {
		String fileId = createFileId();
		return String.format("%s/%s", prefix, fileId + "-" + fileName);
	}

	@Transactional
	public void saveUrlToFace(URL url, Long userId) {
		String fullUrl = url.toString();
		String[] parts = fullUrl.split("\\?");
		Face face = faceRepository.findFaceByUserId(userId)
			.orElseThrow(()->new MoneyAndLoveException(ErrorType.FACE_NOT_FOUND));
		if(face.getMontageURL()!=null){
			//delete 로직
			String deleteUrl = face.getMontageURL();
			String splitStr = ".com/";
			String fileName = deleteUrl.substring(deleteUrl.lastIndexOf(splitStr) + splitStr.length());
			amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
		}
		face.changeMontageURL(parts[0]);
		faceRepository.save(face);

	}

	@Transactional
	public void saveUrlToUser(URL url, Long userId) {
		String fullUrl = url.toString();
		String[] parts = fullUrl.split("\\?");
		User user = userRepository.findById(userId)
			.orElseThrow(()->new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));
		if(user.getProfileURL()!=null){
			//delete 로직
			String deleteFullUrl = user.getProfileURL();
			String splitStr = ".com/";
			String fileName = deleteFullUrl.substring(deleteFullUrl.lastIndexOf(splitStr) + splitStr.length());
			amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
		}
		user.changeProfileURL(parts[0]);
		userRepository.save(user);
	}

	@Cacheable(value = TOP_30_PERCENT_FACES_CACHE)
	public Set<Long> getTop30PercentFaceUserIds() {
		List<Long> allUserIds = faceRepository.findAllUserIdsOrderByFaceScoreDesc();
		int top30Index = (int) (allUserIds.size() * 0.3);
		if (top30Index == 0) {
			top30Index = 1;
		}
		return allUserIds.subList(0, top30Index).stream().collect(Collectors.toCollection(LinkedHashSet::new));
	}

	@CacheEvict(value = "top30PercentFaces", allEntries = true)
	public void updateFaceScore(Long userId, int newScore) {
		Face face = faceRepository.findFaceByUserId(userId)
			.orElseThrow(()->new MoneyAndLoveException(ErrorType.FACE_NOT_FOUND));
		face.changeFaceScore(newScore);
		faceRepository.save(face);
	}

	public Integer getFaceScoreByUserId(Long userId) {
		return faceRepository.findFaceScoreByUserId(userId);
	}

	public void createFace(Long userId){
		User user = userRepository.findById(userId)
				.orElseThrow(()->new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));
		Face newFace = Face.builder()
				.user(user)
				.faceScore(0)
				.faceAuth(0)
				.montageURL(null)
				.build();
		faceRepository.save(newFace);
	}

}

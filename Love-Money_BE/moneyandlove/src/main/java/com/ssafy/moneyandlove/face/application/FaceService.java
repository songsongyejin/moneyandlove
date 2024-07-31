package com.ssafy.moneyandlove.face.application;

import java.net.URL;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
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
}

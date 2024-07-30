package com.ssafy.moneyandlove.common.jwt;

import java.time.Duration;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ssafy.moneyandlove.user.domain.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtProvider {

	@Value("${jwt.secret}")
	private String secret;

	public String generateToken(User user) {
		Date now = new Date();
		return Jwts.builder()
			.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
			.setIssuedAt(now)
			.setExpiration(new Date(now.getTime() + Duration.ofHours(2).toMillis()))
			.setSubject(user.getEmail())
			.claim("id", user.getId())
			.signWith(SignatureAlgorithm.HS256, secret)
			.compact();
	}

	public Long getUserId(String token) {
		Claims claims = validateToken(token);
		return claims.get("id", Long.class);
	}

	public Claims validateToken(String token) {
		try {
			return Jwts.parser()
				.setSigningKey(secret)
				.parseClaimsJws(token)
				.getBody();
		} catch (Exception e) {
			throw new IllegalArgumentException();
		}
	}

}

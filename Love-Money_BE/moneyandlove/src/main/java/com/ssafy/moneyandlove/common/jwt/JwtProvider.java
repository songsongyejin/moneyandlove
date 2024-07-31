package com.ssafy.moneyandlove.common.jwt;

import java.time.Duration;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
			.claim("nickname", user.getNickname())
			.signWith(SignatureAlgorithm.HS256, secret)
			.compact();
	}

	public String generateToken(User user, String secretKey) {
		Date now = new Date();
		return Jwts.builder()
			.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
			.setIssuedAt(now)
			.setExpiration(new Date(now.getTime() + Duration.ofHours(2).toMillis()))
			.setSubject(user.getEmail())
			.claim("id", user.getId())
			.claim("nickname", user.getNickname())
			.signWith(SignatureAlgorithm.HS256, secretKey)
			.compact();
	}

	public Authentication getAuthentication(String token) {
		Claims claims = validateToken(token);
		Set<SimpleGrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));

		return new UsernamePasswordAuthenticationToken(
			User.create(Long.parseLong(claims.get("id").toString()), (String)claims.get("nickname")), token, authorities);
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

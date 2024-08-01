package com.ssafy.moneyandlove.common.jwt;

import java.time.Duration;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.user.domain.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class JwtProvider {

	@Value("${jwt.secret}")
	private String secret;

	private SecretKey getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(this.secret);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String makeToken(User user) {
		Date now = new Date();

		return Jwts.builder()
			.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
			.setIssuedAt(now)
			.setExpiration(new Date(now.getTime() + Duration.ofMinutes(1).toMillis()))
			.setSubject(user.getEmail())
			.claim("id", user.getId())
			.claim("nickname", user.getNickname())
			.signWith(this.getSigningKey())
			.compact();
	}

	public Claims validateToken(String token) {
		try {
			return Jwts.parser()
				.setSigningKey(secret)
				.parseClaimsJws(token)
				.getBody();
		} catch (SecurityException | MalformedJwtException e) {
			throw new MoneyAndLoveException(ErrorType.TOKEN_INVALID);
		} catch (ExpiredJwtException e) {
			throw new MoneyAndLoveException(ErrorType.TOKEN_EXPIRED);
		} catch (IllegalArgumentException e) {
			throw new MoneyAndLoveException(ErrorType.TOKEN_NOT_EXIST);
		}
	}

	public Authentication getAuthentication(String token) {
		Claims claims = validateToken(token);
		Set<SimpleGrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));

		return new UsernamePasswordAuthenticationToken(
			User.create(Long.parseLong(claims.get("id").toString()), (String)claims.get("nickname")), token, authorities);
	}

}

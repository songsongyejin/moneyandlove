package com.ssafy.moneyandlove.common.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {

	@Value("${jwt.secret}")
	private String secret;

	// public String generateToken(User user) {
	// 	Date now = new Date();
	// 	return Jwts.builder()
	// 		.setExpiration(LocalDate.now().plus(100))
	// 		.setClaims("id", user.getId())
	// 		.signWith(SignatureAlgorithm.HS256, secret)
	// 		.compact();
	// }
}

package com.ssafy.moneyandlove.attendance.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ssafy.moneyandlove.common.TimeBaseEntity;
import com.ssafy.moneyandlove.user.domain.User;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Attendance extends TimeBaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private LocalDate attendanceDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	public static Attendance of(final User user, final LocalDate attendanceDate) {
		return Attendance.builder()
			.user(user)
			.attendanceDate(attendanceDate)
			.build();
	}
}

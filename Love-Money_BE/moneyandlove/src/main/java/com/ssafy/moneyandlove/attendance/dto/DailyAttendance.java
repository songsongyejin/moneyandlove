package com.ssafy.moneyandlove.attendance.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class DailyAttendance {

	public LocalDate attendanceDate;

	public boolean check;

	public static DailyAttendance of(LocalDate date, boolean check) {
		return DailyAttendance.builder()
			.attendanceDate(date)
			.check(check)
			.build();
	}
}

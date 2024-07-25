package com.ssafy.moneyandlove.attendance.application;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.attendance.domain.Attendance;
import com.ssafy.moneyandlove.attendance.dto.DailyAttendance;
import com.ssafy.moneyandlove.attendance.repository.AttendanceRepository;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {

	private static final int SIX_DAYS = 6;

	private final AttendanceRepository attendanceRepository;

	public void addAttendance(User user, LocalDate today) {
		attendanceRepository.save(Attendance.of(user, today));
	}

	public List<DailyAttendance> findWeeklyAttendance(User user, LocalDate today) {
		LocalDate monday = today.minusDays(today.getDayOfWeek().getValue() - DayOfWeek.MONDAY.getValue());
		LocalDate sunday = monday.plusDays(SIX_DAYS);
		List<LocalDate> attendancesForWeek = attendanceRepository.findAttendancesForWeek(user, monday, sunday);

		return calculateAttendance(attendancesForWeek, monday, sunday);
	}

	private List<DailyAttendance> calculateAttendance(List<LocalDate> attendancesForWeek, LocalDate monday, LocalDate sunday) {
		Set<LocalDate> attandanceDateSet = new HashSet<>(attendancesForWeek);
		List<DailyAttendance> dailyAttendances = new ArrayList<>();
		for (LocalDate date = monday; !date.isAfter(sunday); date = date.plusDays(1)) {
			if (attandanceDateSet.contains(date)) {
				dailyAttendances.add(DailyAttendance.of(date, true));
				continue;
			}
			dailyAttendances.add(DailyAttendance.of(date, false));
		}
		return dailyAttendances;
	}
}

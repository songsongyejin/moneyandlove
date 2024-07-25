package com.ssafy.moneyandlove.attendance.presentation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.attendance.application.AttendanceService;
import com.ssafy.moneyandlove.attendance.dto.DailyAttendance;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendance")
public class AttendanceController {

	private final AttendanceService attendanceService;

	@PostMapping
	public ResponseEntity<?> checkAttendance() {
		LocalDate now = LocalDate.now();
		User user = User.builder().id(1L).build();
		attendanceService.addAttendance(user, now);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public List<DailyAttendance> findWeeklyAttendance() {
		LocalDate now = LocalDate.now();
		User user = User.builder().id(1L).build();
		return attendanceService.findWeeklyAttendance(user, now);
	}
}

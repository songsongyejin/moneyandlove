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
import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendance")
public class AttendanceController {

	private final AttendanceService attendanceService;

	@PostMapping
	public ResponseEntity<?> checkAttendance(@LoginUser User loginUser) {
		LocalDate now = LocalDate.now();
		attendanceService.addAttendance(loginUser, now);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public List<DailyAttendance> findWeeklyAttendance(@LoginUser User loginUser) {
		LocalDate now = LocalDate.now();
		return attendanceService.findWeeklyAttendance(loginUser, now);
	}
}

package com.ssafy.moneyandlove.attendance;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendance")
public class AttendanceController {

	private final AttendanceService attendanceService;

	@PostMapping
	public void checkAttendance() {
		LocalDateTime now = LocalDateTime.now();
		User user = User.builder().id(1L).build();
		attendanceService.addAttendance(user, now);
	}
}

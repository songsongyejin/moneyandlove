package com.ssafy.moneyandlove.attendance;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.attendance.domain.Attendance;
import com.ssafy.moneyandlove.user.domain.User;

@Service
public class AttendanceService {

	private AttendanceRepository attendanceRepository;

	public void addAttendance(User user, LocalDateTime now) {
		attendanceRepository.save(Attendance.of(user, now));
	}
}

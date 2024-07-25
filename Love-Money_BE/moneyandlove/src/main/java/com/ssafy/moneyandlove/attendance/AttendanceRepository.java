package com.ssafy.moneyandlove.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.moneyandlove.attendance.domain.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}

package com.ssafy.moneyandlove.attendance.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.moneyandlove.attendance.domain.Attendance;
import com.ssafy.moneyandlove.user.domain.User;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	@Query("SELECT a.attendanceDate FROM Attendance a WHERE a.user = :user AND a.attendanceDate BETWEEN :startDate AND :endDate")
	List<LocalDate> findAttendancesForWeek(@Param("user") User user,
		@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

package com.ssafy.moneyandlove.chat.domain;

import com.ssafy.moneyandlove.common.TimeBaseEntity;
import com.ssafy.moneyandlove.user.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom extends TimeBaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "from_user_id")
	private User fromUser;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "to_user_id")
	private User toUser;

	public static ChatRoom of(Long roomId, User fromUser, User toUser) {
		return ChatRoom.builder()
				.id(roomId)
				.fromUser(fromUser)
				.toUser(toUser)
				.build();
	}
}

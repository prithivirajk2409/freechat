package com.freechat.config;

import java.net.URI;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.util.AbstractMap.SimpleEntry;

import com.freechat.entity.Room;
import com.freechat.entity.User;
import com.freechat.service.RoomService;
import com.freechat.service.UserService;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

	public ChatWebSocketHandler() {
		super();
	}

	@Autowired
	private RoomService roomService;

	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		URI uri = session.getUri();
		String query = uri.getQuery();
		Map<String, String> params = Arrays.stream(query.split("&")).map(s -> s.split("="))
				.collect(Collectors.toMap(a -> a[0], a -> a[1]));

		String userName = params.getOrDefault("userName", null);
		String userIdStr = params.getOrDefault("userId", null);
		String roomId = params.getOrDefault("roomId", null);

		Integer userId = userIdStr == null ? UserService.getUidseq().incrementAndGet() : Integer.valueOf(userIdStr);

		User user = new User(userName, userId);
		roomService.addSessionToRoom(session, user, roomId);
	}

	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		Room room = roomService.getRoomForSocketSession(session);
		String messageStr = message.getPayload().toString();
		SimpleEntry<String, WebSocketSession> entry = new SimpleEntry<>(messageStr, session);
		room.getMessageQueue().offer(entry);
		room.getHistory().add(messageStr);
	}

	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {

	}
}

package com.freechat.service;

import java.sql.Timestamp;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import com.freechat.entity.Room;
import com.freechat.entity.User;

@Component
public class RoomService {

	// roomId to room mapping
	private ConcurrentHashMap<String, Room> roomMap;

	// socket to room mapping
	private ConcurrentHashMap<WebSocketSession, Room> sessionToRoomMap;

	RoomService() {
		roomMap = new ConcurrentHashMap<>();
		sessionToRoomMap = new ConcurrentHashMap<>();
	}

	public Room createRoom(User user, String roomName) {
		String roomId = UUID.randomUUID().toString();
		Room room = new Room(roomId, roomName, user, new Timestamp(System.currentTimeMillis()));
		roomMap.put(roomId, room);
		return room;
	}

	public void addSessionToRoom(WebSocketSession session, User user, String roomId) throws Exception {
		Room room = roomMap.get(roomId);
		if (room.getActiveMembers().contains(user.getUserName())) {
			WebSocketSession oldSession = room.getActiveMembers().get(user.getUserName());
			if (oldSession.isOpen()) {
				oldSession.close();
			}
			room.getActiveMembers().remove(user.getUserName());
		}
		room.getActiveMembers().put(user.getUserName(), session);
		room.getMembers().add(user.getUserName());
		sessionToRoomMap.put(session, room);
	}

	public Room getRoomForSocketSession(WebSocketSession session) {
		return sessionToRoomMap.getOrDefault(session, null);
	}

	public Room getRoomForRoomId(String roomId) {
		return roomMap.getOrDefault(roomId, null);
	}
}
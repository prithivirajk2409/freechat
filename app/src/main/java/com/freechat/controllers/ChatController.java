package com.freechat.controllers;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.freechat.entity.Room;
import com.freechat.entity.User;
import com.freechat.service.RoomService;
import com.freechat.service.UserService;

@RestController
@RequestMapping("/chat")
//@CrossOrigin(origins = "*")
public class ChatController {

	@Autowired
	private RoomService roomService;

	private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

	@PostMapping(value = "/createRoom", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public ResponseEntity<Map<String, Object>> createRoom(@RequestBody Map<String, Object> body) {
		Map<String, Object> data = new HashMap<>();
		User user = new User(body.get("userName").toString());
		String roomName = body.get("roomName").toString();
		data.put("roomDetails", roomService.createRoom(user, roomName));
		return ResponseEntity.ok(data);
	}

	@GetMapping(value = "/room/{roomId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public ResponseEntity<Map<String, Object>> getRoomHistory(
			@PathVariable(name = "roomId", required = true) String roomId) {
		Map<String, Object> data = new HashMap<>();
		Room room = roomService.getRoomForRoomId(roomId);
		data.put("roomDetails", room);
		return ResponseEntity.ok(data);
	}
}
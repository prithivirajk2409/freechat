package com.freechat.entity;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Room {
	private String roomId;
	private String roomName;
	private User createdBy;
	private Timestamp createdAt;

	@JsonIgnore
	private ConcurrentHashMap<String, WebSocketSession> activeMembers;

	@JsonIgnore
	private BlockingQueue<SimpleEntry<String, WebSocketSession>> messageQueue;
	private List<String> history;
	private Set<String> members;

	@JsonIgnore
	private Thread poller;

	public Room(String roomId, String roomName, User createdBy, Timestamp createdAt) {
		super();
		this.roomId = roomId;
		this.roomName = roomName;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.activeMembers = new ConcurrentHashMap<>();
		this.messageQueue = new LinkedBlockingQueue<>();
		this.history = new ArrayList<>();
		this.setMembers(new HashSet<>());

		Runnable task = () -> {
			while (true) {
				try {
					SimpleEntry<String, WebSocketSession> msgEntry = messageQueue.take();
					ExecutorService executor = Executors.newFixedThreadPool(10);
					TextMessage textMessage = new TextMessage(msgEntry.getKey());
					for (WebSocketSession sessions : activeMembers.values()) {
						if (!msgEntry.getValue().equals(sessions) && sessions.isOpen()) {
							// send only to the sockets this
							executor.submit(() -> {
								try {
									// just push it to the executor - fire and forget
									sessions.sendMessage(textMessage);
								} catch (IOException e) {
									e.printStackTrace();
								}
							});
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

		};

		poller = new Thread(task);
		poller.start();

	}

	public void startPollingTask() {

	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public ConcurrentHashMap<String, WebSocketSession> getActiveMembers() {
		return activeMembers;
	}

	public void setActiveMembers(ConcurrentHashMap<String, WebSocketSession> activeMembers) {
		this.activeMembers = activeMembers;
	}

	public BlockingQueue<SimpleEntry<String, WebSocketSession>> getMessageQueue() {
		return messageQueue;
	}

	public void setMessageQueue(BlockingQueue<SimpleEntry<String, WebSocketSession>> messageQueue) {
		this.messageQueue = messageQueue;
	}

	public Thread getPoller() {
		return poller;
	}

	public void setPoller(Thread poller) {
		this.poller = poller;
	}

	public List<String> getHistory() {
		return history;
	}

	public void setHistory(List<String> history) {
		this.history = history;
	}

	public Set<String> getMembers() {
		return members;
	}

	public void setMembers(Set<String> members) {
		this.members = members;
	}
}
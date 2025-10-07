package com.freechat.service;

import java.util.concurrent.atomic.AtomicInteger;

public class UserService {

	private static AtomicInteger uidseq = new AtomicInteger();

	public static AtomicInteger getUidseq() {
		return uidseq;
	}

	public static void setUidseq(AtomicInteger uidseq) {
		UserService.uidseq = uidseq;
	}

}
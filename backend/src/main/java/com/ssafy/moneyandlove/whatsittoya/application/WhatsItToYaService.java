package com.ssafy.moneyandlove.whatsittoya.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.whatsittoya.repository.WhatsItToYaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WhatsItToYaService {

	private final WhatsItToYaRepository whatsItToYaRepository;

	public List<String> getFiveKeyWords() {
		return whatsItToYaRepository.findRandomWords();
	}
}

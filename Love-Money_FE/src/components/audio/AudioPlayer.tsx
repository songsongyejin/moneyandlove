import bgm from '../../assets/bgm/borabora.mp3'
import React from 'react';
import { useAudio } from '../../hooks/useAudio';

const AudioPlayer: React.FC = () => {
  useAudio(bgm); 
  return null;
};

export default AudioPlayer;
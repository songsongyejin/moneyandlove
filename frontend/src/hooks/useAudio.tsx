import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { audioState } from '../atom/audio';

export const useAudio = (audioSrc: string) => {
  const [audioData, setAudioData] = useRecoilState(audioState);

  useEffect(() => {
    if (!audioData.audio) {
      console.log("Creating new Audio object");
      const audio = new Audio(audioSrc);
      audio.loop = true;
      audio.volume = audioData.volume ?? 0.1; // 초기 볼륨 설정 (기본값 1.0)
      setAudioData({ audio, isPlaying: true, volume: audio.volume });
      audio.play();
    } else {
      console.log("Resuming audio playback");
      if (audioData.isPlaying) {
        audioData.audio.play();
      } else {
        audioData.audio.pause();
      }
    }

    return () => {
      if (audioData.audio) {
        console.log("Component unmounting, pausing audio");
        audioData.audio.pause();
      }
    };
  }, [audioSrc, audioData, setAudioData]);

  const play = () => {
    if (audioData.audio) {
      audioData.audio.play();
      setAudioData((prevState) => ({ ...prevState, isPlaying: true }));
    }
  };

  const pause = () => {
    if (audioData.audio) {
      audioData.audio.pause();
      setAudioData((prevState) => ({ ...prevState, isPlaying: false }));
    }
  };

  const setVolume = (volume: number) => {
    if (audioData.audio) {
      if (!audioData.isPlaying) {
        // Create a new Audio object if the audio is not playing
        const audio = new Audio(audioSrc);
        audio.loop = true;
        audio.volume = volume;
        setAudioData({ audio, isPlaying: true, volume });
        audio.play();
      } else {
        // Adjust volume of the existing audio object
        audioData.audio.volume = volume;
        setAudioData((prevState) => ({ ...prevState, volume }));
      }
    }
  };

  return { play, pause, isPlaying: audioData.isPlaying, volume: audioData.volume, setVolume };
};

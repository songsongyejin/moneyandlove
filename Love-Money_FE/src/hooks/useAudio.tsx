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
      setAudioData({ audio, isPlaying: true });
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

  return { play, pause, isPlaying: audioData.isPlaying };
};

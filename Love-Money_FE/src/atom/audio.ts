import { atom } from 'recoil';

export interface AudioState {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
}

export const audioState = atom<AudioState>({
  key: 'audioState',
  default: {
    audio: null,
    isPlaying: false,
  },
});
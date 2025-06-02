import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';

export const AutoVideoView = ({ source, style }: { source: string, style: object }) => {
  const player = useVideoPlayer(source, player => {
    player.addListener('sourceLoad', () => {
      player.play();
    });

    player.addListener('playToEnd', () => {
      player.replay();
    });

    player.muted = true;
    player.loop = true;
  });

  return (
    <VideoView player={player} style={style} nativeControls={false} />
  );
};
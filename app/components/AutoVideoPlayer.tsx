import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';

export const AutoVideoPlayer = ({ source, style }: { source: string, style: object }) => {
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
    <VideoView contentFit="contain" player={player} style={style} nativeControls={false} />
  );
};

export default AutoVideoPlayer;

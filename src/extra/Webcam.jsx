import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { drawhand, setHandDetector } from './ai';
import { useInterval } from './useInterval';

const WebCam = ({ hide = false, onSquareDetected = () => ({}) }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [net, setNet] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const { video } = webcamRef.current;
      const { videoWidth } = video;
      const { videoHeight } = video;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      
      const ctx = canvasRef.current.getContext('2d');
      const squareId = drawhand(hand, ctx);
      
      onSquareDetected(squareId);
    }
  };

  const runHandPose = async () => {
    const net = await setHandDetector();
    setModelLoaded(true);
    console.log('Handpose model Loaded');
    setNet(net);
  };

  useEffect(() => {
    runHandPose();
  }, []);

  useInterval(() => {
    if (net) {
      detect(net);
    }
  }, 150);

  if (!modelLoaded) return null;

  return (
    <>
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          top: '50%',
          textAlign: 'center',
          transform: 'rotateY(180deg) translateY(-50%)',
          zIndex: 1,
          width: 640,
          height: 480,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          top: '50%',
          textAlign: 'center',
          transform: 'rotateY(180deg) translateY(-50%)',
          zIndex: 1,
          width: 640,
          height: 480,
          pointerEvents: 'none',
          opacity: hide ? 0 : 1,
        }}
      />
    </>
  );
};

export default WebCam;
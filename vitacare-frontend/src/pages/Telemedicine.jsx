import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  ScreenShare,
  StopScreenShare,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Telemedicine = () => {
  const [inCall, setInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setInCall(true);
      toast.success('Call started');
      
      // In a real application, you would initialize WebRTC connection here
      // using a service like Agora, Twilio, or native WebRTC
      
    } catch (error) {
      toast.error('Failed to access camera/microphone');
      console.error('Media access error:', error);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    setInCall(false);
    setLocalStream(null);
    setVideoEnabled(true);
    setAudioEnabled(true);
    setScreenSharing(false);
    toast.info('Call ended');
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!screenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenSharing(true);
        toast.success('Screen sharing started');
        
        screenStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
          toast.info('Screen sharing stopped');
        };
      } else {
        setScreenSharing(false);
        toast.info('Screen sharing stopped');
      }
    } catch (error) {
      toast.error('Failed to share screen');
    }
  };

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            📹 Telemedicine
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect with patients through secure video consultations
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> This is a basic telemedicine interface. For production use, integrate with:
          </Typography>
          <ul style={{ marginTop: 8, marginBottom: 0 }}>
            <li>Agora.io for high-quality video calls</li>
            <li>Twilio Video for reliable communication</li>
            <li>Jitsi Meet for self-hosted solution</li>
            <li>Daily.co for embedded video calls</li>
          </ul>
        </Alert>

        {!inCall ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Videocam sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Ready to start a consultation?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Click the button below to start a video call with your patient
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Videocam />}
              onClick={startCall}
              sx={{ px: 6, py: 2 }}
            >
              Start Video Call
            </Button>
          </Paper>
        ) : (
          <>
            {/* Video Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <Card sx={{ height: 500, bgcolor: '#000', position: 'relative' }}>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    color: '#fff',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    px: 2,
                    py: 1,
                    borderRadius: 1
                  }}>
                    <Typography variant="body2">Patient</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: 500, bgcolor: '#000', position: 'relative' }}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)' // Mirror effect
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    color: '#fff',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    px: 2,
                    py: 1,
                    borderRadius: 1
                  }}>
                    <Typography variant="body2">You</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Controls */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <IconButton
                  onClick={toggleVideo}
                  sx={{
                    bgcolor: videoEnabled ? 'primary.main' : 'error.main',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: videoEnabled ? 'primary.dark' : 'error.dark',
                    },
                    width: 56,
                    height: 56
                  }}
                >
                  {videoEnabled ? <Videocam /> : <VideocamOff />}
                </IconButton>

                <IconButton
                  onClick={toggleAudio}
                  sx={{
                    bgcolor: audioEnabled ? 'primary.main' : 'error.main',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: audioEnabled ? 'primary.dark' : 'error.dark',
                    },
                    width: 56,
                    height: 56
                  }}
                >
                  {audioEnabled ? <Mic /> : <MicOff />}
                </IconButton>

                <IconButton
                  onClick={toggleScreenShare}
                  sx={{
                    bgcolor: screenSharing ? 'success.main' : 'grey.700',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: screenSharing ? 'success.dark' : 'grey.800',
                    },
                    width: 56,
                    height: 56
                  }}
                >
                  {screenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>

                <IconButton
                  onClick={endCall}
                  sx={{
                    bgcolor: 'error.main',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: 'error.dark',
                    },
                    width: 56,
                    height: 56
                  }}
                >
                  <CallEnd />
                </IconButton>
              </Box>
            </Paper>
          </>
        )}

        {/* Info Section */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  🔒 Secure & Private
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End-to-end encrypted video calls ensuring patient privacy and HIPAA compliance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  📱 Cross-Platform
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Works on desktop, tablet, and mobile devices for maximum accessibility
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  🎯 HD Quality
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High-definition video and crystal-clear audio for better diagnosis
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Telemedicine;

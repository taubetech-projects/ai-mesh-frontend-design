import { useEffect, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';
import { API_BASE } from '@/lib/http';
import { Button } from '@/components/ui/button';

interface AudioRecorderModalProps {
    onClose: () => void;
    onTranscriptionComplete: (transcription: string) => void;
}

export function AudioRecorderModal({
    onClose,
    onTranscriptionComplete,
}: AudioRecorderModalProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        startRecording();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (audioBlob) {
            transcribeAudio();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioBlob]);

    const stopMediaStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const startRecording = async () => {
        try {
            const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(userStream);

            // Setup audio visualization
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(userStream);
            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;

            // Setup media recorder
            const recorder = new MediaRecorder(userStream);
            mediaRecorderRef.current = recorder;

            const audioChunks: BlobPart[] = [];

            recorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const newAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                console.log("new audio blob after stop", newAudioBlob);
                setAudioBlob(newAudioBlob);
                userStream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setIsRecording(true);
            visualize();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please grant permission.');
            onClose();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }
        console.log("Recording stopped", audioBlob);
        setIsRecording(false);
    };

    const visualize = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyserRef.current!.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgb(17, 24, 39)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
                gradient.addColorStop(0, '#14b8a6');
                gradient.addColorStop(1, '#0d9488');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    };

    const transcribeAudio = async () => {
        if (!audioBlob) {
            console.error('No audio blob to transcribe.');
            return;
        }

        setIsTranscribing(true);
        try {
            const formData = new FormData();
            formData.append('file', audioBlob);

            const response = await fetch(`${API_BASE}/v1/transcribe`, {
                method: 'POST',
                headers: {
                    Authorization:
                        'Bearer amk_live_dev_1f3b2c9a.$2a$12$d6rQGxp8lQo1TyhdR4Qq7uPb4knRJhLKF47pea4j0ilI/TS1HarHS',
                },
                body: formData,
            });
            console.log("Audio Response", response);

            if (!response.ok) {
                throw new Error(`Transcription failed: ${response.statusText}`);
            }

            const data = await response.json();
            onTranscriptionComplete(data.transcribedText || '');
            onClose();
        } catch (error) {
            console.error('Error transcribing audio:', error);
            alert('Failed to transcribe audio. Please try again.');
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleFinish = () => {
        stopRecording();
    };

    const handleCancel = () => {
        stopMediaStream();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        {isRecording ? 'Recording...' : isTranscribing ? 'Transcribing...' : 'Ready'}
                    </h3>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-white"
                        disabled={isTranscribing}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={200}
                        className="w-full rounded-lg bg-gray-800"
                    />
                </div>

                {isRecording && (
                    <div className="flex items-center justify-center mb-4 gap-2 text-red-500">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Recording...</span>
                    </div>
                )}

                <div className="flex gap-3 mt-6">
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                        disabled={isTranscribing}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleFinish}
                        className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                        disabled={isTranscribing || !isRecording}
                    >
                        {isTranscribing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Finish
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

import { useRef } from "react";

type MicButtonProps = {
  onVoiceRecorded: (audioUrl: string) => void;
};

export default function MicButton({ onVoiceRecorded }: MicButtonProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingRef = useRef(false);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;
    chunksRef.current = [];
    recordingRef.current = true;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      onVoiceRecorded(url);

      stream.getTracks().forEach((t) => t.stop());
      recordingRef.current = false;
    };

    recorder.start();
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  return (
    <button
      className="mic-btn"
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      aria-label="Maintenir pour enregistrer"
    >
      <span className="mic-svg" />
    </button>
  );
}

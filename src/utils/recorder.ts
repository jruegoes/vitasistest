export async function getAudioStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({ audio: true });
  }  
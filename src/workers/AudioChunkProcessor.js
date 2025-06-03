// AudioChunkProcessor.js - Web Worker for audio processing

// Process incoming audio data
addEventListener('message', event => {
  const audioChunk = event.data.audioChunk;
  const sourceSampleRate = event.data.sourceSampleRate;
  const targetSampleRate = event.data.targetSampleRate || 16000;
  
  // Resample if needed
  let processedAudio = audioChunk;
  if (sourceSampleRate !== targetSampleRate) {
    console.log(`Resampling audio from ${sourceSampleRate}Hz to ${targetSampleRate}Hz`);
    processedAudio = linearResample(processedAudio, sourceSampleRate, targetSampleRate);
  }

  // Convert to 16bit little endian encoding
  const audioDataArray16b = floatTo16BitPCM(processedAudio);

  // Send back the processed audio buffer
  postMessage(audioDataArray16b);
});


// Convert Float32Array to 16-bit PCM
function floatTo16BitPCM(input) {
  // Each 32bit (4byte) float from input is converted to one 16bit (2byte) integer
  const buffer = new ArrayBuffer(input.length * 2);
  
  // Define view to raw buffer so we can set values as int16
  const view = new DataView(buffer);
  
  for (let i = 0; i < input.length; i++) {
    // Limit input to [-1, 1]
    const s = Math.max(-1, Math.min(1, input[i]));
    
    // Convert float32 to int16 and force little endian
    view.setInt16(2 * i, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  
  return buffer;
} 
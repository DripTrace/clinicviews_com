// import * as wav from 'wav';
// import * as fs from 'fs';

// public saveAudioAsWav() {
//     const rawAudioPath = this.audioStream.path.toString();
//     const wavAudioPath = rawAudioPath.replace(".raw", ".wav");

//     if (fs.existsSync(rawAudioPath)) {
//         console.log(`[Softphone] Converting audio log to .wav format`);
//         const reader = new wav.Reader();
//         const writer = new wav.FileWriter(wavAudioPath, {
//             channels: 1,
//             sampleRate: 8000,
//             bitDepth: 16
//         });

//         fs.createReadStream(rawAudioPath)
//             .pipe(reader)
//             .pipe(writer);

//         writer.on('done', () => {
//             console.log(`[Softphone] Audio log successfully converted to ${wavAudioPath}`);
//             fs.unlinkSync(rawAudioPath);
//         });
//     } else {
//         console.error(`[Softphone] No raw audio log found for conversion`);
//     }
// }
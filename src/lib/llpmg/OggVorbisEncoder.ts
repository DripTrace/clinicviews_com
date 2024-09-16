// // import * as fs from 'fs';
// // import * as opus from 'node-opus';

// // export class OggVorbisEncoder {
// //     private rawAudioData: Buffer;
// //     private sampleRate: number;
// //     private channels: number;

// //     constructor(rawAudioData: Buffer, sampleRate: number, channels: number) {
// //         this.rawAudioData = rawAudioData;
// //         this.sampleRate = sampleRate;
// //         this.channels = channels;
// //     }

// //     public async saveToFile(outputPath: string): Promise<void> {
// //         return new Promise((resolve, reject) => {
// //             console.log(`[OggVorbisEncoder] Starting encoding process. Sample rate: ${this.sampleRate}, Channels: ${this.channels}`);
// //             const opusEncoder = new opus.OpusEncoder(this.sampleRate, this.channels);
// //             const outputStream = fs.createWriteStream(outputPath);

// //             console.log(`[OggVorbisEncoder] Writing Ogg header`);
// //             const oggHeader = Buffer.from('OggS\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01', 'binary');
// //             outputStream.write(oggHeader);

// //             // Write OpusHead packet
// //             const opusHead = Buffer.alloc(19);
// //             opusHead.write('OpusHead', 0);
// //             opusHead.writeUInt8(1, 8); // Version
// //             opusHead.writeUInt8(this.channels, 9);
// //             opusHead.writeUInt16LE(3840, 10); // Pre-skip
// //             opusHead.writeUInt32LE(this.sampleRate, 12);
// //             opusHead.writeUInt16LE(0, 16); // Output gain
// //             opusHead.writeUInt8(0, 18); // Channel mapping family

// //             this.writeOggPage(outputStream, opusHead, 0, true);

// //             // Write OpusTags packet
// //             const opusTags = Buffer.from('OpusTags\x00\x00\x00\x00', 'binary');
// //             this.writeOggPage(outputStream, opusTags, 1, false);

// //             const chunkSize = 2 * this.channels * 960; // 20ms of audio at 48kHz
// //             let packetNumber = 2;
// //             let granulePosition = 0;

// //             console.log(`[OggVorbisEncoder] Starting to process audio chunks`);
// //             for (let i = 0; i < this.rawAudioData.length; i += chunkSize) {
// //                 const chunk = this.rawAudioData.slice(i, i + chunkSize);
// //                 let encodedChunk: Buffer;
// //                 try {
// //                     encodedChunk = opusEncoder.encode(chunk);
// //                 } catch (error) {
// //                     console.error(`[OggVorbisEncoder] Error encoding chunk:`, error);
// //                     reject(error);
// //                     return;
// //                 }

// //                 this.writeOggPage(outputStream, encodedChunk, packetNumber, false, granulePosition);

// //                 granulePosition += 960; // Increment by 20ms worth of samples
// //                 packetNumber++;
// //             }

// //             console.log(`[OggVorbisEncoder] Finished processing audio chunks. Total packets: ${packetNumber - 2}`);

// //             outputStream.end();

// //             outputStream.on('finish', () => {
// //                 console.log(`[OggVorbisEncoder] Ogg Opus file saved to ${outputPath}`);
// //                 resolve();
// //             });

// //             outputStream.on('error', (error) => {
// //                 console.error(`[OggVorbisEncoder] Error saving Ogg Opus file:`, error);
// //                 reject(error);
// //             });
// //         });
// //     }

// //     private writeOggPage(stream: fs.WriteStream, data: Buffer, packetNumber: number, isFirstPage: boolean, granulePosition: number = 0) {
// //         const pageHeader = Buffer.alloc(27);
// //         pageHeader.write('OggS', 0);
// //         pageHeader.writeUInt8(isFirstPage ? 0x02 : 0x00, 5);
// //         pageHeader.writeUInt32LE(granulePosition & 0xFFFFFFFF, 6);
// //         pageHeader.writeUInt32LE(Math.floor(granulePosition / Math.pow(2, 32)), 10);
// //         pageHeader.writeUInt32LE(1, 14); // Stream serial number
// //         pageHeader.writeUInt32LE(packetNumber, 18);

// //         // Calculate the number of segments
// //         const numSegments = Math.ceil(data.length / 255);
// //         pageHeader.writeUInt8(numSegments, 26);

// //         // Create segment table
// //         const segmentTable = Buffer.alloc(numSegments);
// //         for (let i = 0; i < numSegments - 1; i++) {
// //             segmentTable[i] = 255;
// //         }
// //         segmentTable[numSegments - 1] = data.length % 255;

// //         stream.write(pageHeader);
// //         stream.write(segmentTable);
// //         stream.write(data);
// //     }
// // }

// import * as fs from 'fs';
// import * as opus from 'node-opus';
// import { promisify } from 'util';

// export class OggVorbisEncoder {
//     private rawAudioData: Buffer;
//     private sampleRate: number;
//     private channels: number;

//     constructor(rawAudioData: Buffer, sampleRate: number, channels: number) {
//         this.rawAudioData = rawAudioData;
//         this.sampleRate = sampleRate;
//         this.channels = channels;
//     }

//     public async saveToFile(outputPath: string): Promise<void> {
//         const writeFileAsync = promisify(fs.writeFile);
//         const writeStream = fs.createWriteStream(outputPath);

//         console.log(`[OggVorbisEncoder] Starting encoding process. Sample rate: ${this.sampleRate}, Channels: ${this.channels}`);
        
//         // Initialize the encoder
//         const opusEncoder = new opus.OpusEncoder(this.sampleRate, this.channels);

//         // Write Ogg header and Opus packets asynchronously
//         await new Promise<void>((resolve, reject) => {
//             writeStream.on('error', reject);

//             const oggHeader = Buffer.from('OggS\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01', 'binary');
//             writeStream.write(oggHeader);

//             const opusHead = Buffer.alloc(19);
//             opusHead.write('OpusHead', 0);
//             opusHead.writeUInt8(1, 8); // Version
//             opusHead.writeUInt8(this.channels, 9);
//             opusHead.writeUInt16LE(3840, 10); // Pre-skip
//             opusHead.writeUInt32LE(this.sampleRate, 12);
//             opusHead.writeUInt16LE(0, 16); // Output gain
//             opusHead.writeUInt8(0, 18); // Channel mapping family

//             this.writeOggPage(writeStream, opusHead, 0, true);

//             const opusTags = Buffer.from('OpusTags\x00\x00\x00\x00', 'binary');
//             this.writeOggPage(writeStream, opusTags, 1, false);

//             const chunkSize = 2 * this.channels * 960;
//             let packetNumber = 2;
//             let granulePosition = 0;

//             console.log(`[OggVorbisEncoder] Starting to process audio chunks`);

//             for (let i = 0; i < this.rawAudioData.length; i += chunkSize) {
//                 const chunk = this.rawAudioData.slice(i, i + chunkSize);

//                 // Async encode each chunk
//                 let encodedChunk: Buffer;
//                 try {
//                     encodedChunk = opusEncoder.encode(chunk);
//                 } catch (error) {
//                     console.error(`[OggVorbisEncoder] Error encoding chunk:`, error);
//                     reject(error);
//                     return;
//                 }

//                 this.writeOggPage(writeStream, encodedChunk, packetNumber, false, granulePosition);
//                 granulePosition += 960;
//                 packetNumber++;
//             }

//             console.log(`[OggVorbisEncoder] Finished processing audio chunks. Total packets: ${packetNumber - 2}`);
            
//             writeStream.end(() => {
//                 console.log(`[OggVorbisEncoder] Ogg Opus file saved to ${outputPath}`);
//                 resolve();
//             });
//         });

//         console.log(`[OggVorbisEncoder] Ogg encoding process completed.`);
//     }

//     private writeOggPage(stream: fs.WriteStream, data: Buffer, packetNumber: number, isFirstPage: boolean, granulePosition: number = 0) {
//         const pageHeader = Buffer.alloc(27);
//         pageHeader.write('OggS', 0);
//         pageHeader.writeUInt8(isFirstPage ? 0x02 : 0x00, 5);
//         pageHeader.writeUInt32LE(granulePosition & 0xFFFFFFFF, 6);
//         pageHeader.writeUInt32LE(Math.floor(granulePosition / Math.pow(2, 32)), 10);
//         pageHeader.writeUInt32LE(1, 14); // Stream serial number
//         pageHeader.writeUInt32LE(packetNumber, 18);

//         const numSegments = Math.ceil(data.length / 255);
//         pageHeader.writeUInt8(numSegments, 26);

//         const segmentTable = Buffer.alloc(numSegments);
//         for (let i = 0; i < numSegments - 1; i++) {
//             segmentTable[i] = 255;
//         }
//         segmentTable[numSegments - 1] = data.length % 255;

//         stream.write(pageHeader);
//         stream.write(segmentTable);
//         stream.write(data);
//     }
// }

//-------- logs exist but error
import * as fs from 'fs';
import * as opus from 'node-opus';

export class OggVorbisEncoder {
    private rawAudioData: Buffer;
    private sampleRate: number;
    private channels: number;

    constructor(rawAudioData: Buffer, sampleRate: number, channels: number) {
        this.rawAudioData = rawAudioData;
        this.sampleRate = sampleRate;
        this.channels = channels;
    }

    public async saveToFile(outputPath: string): Promise<void> {
        console.time("[OggVorbisEncoder] Encoding Time");

        return new Promise((resolve, reject) => {
            const opusEncoder = new opus.OpusEncoder(this.sampleRate, this.channels);
            const outputStream = fs.createWriteStream(outputPath);

            // Handle write stream errors
            outputStream.on('error', (error) => {
                console.error("[OggVorbisEncoder] Write stream error:", error);
                reject(error);
            });

            const oggHeader = Buffer.from('OggS\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01', 'binary');
            outputStream.write(oggHeader);

            const opusHead = Buffer.alloc(19);
            opusHead.write('OpusHead', 0);
            opusHead.writeUInt8(1, 8); // Version
            opusHead.writeUInt8(this.channels, 9);
            opusHead.writeUInt16LE(3840, 10); // Pre-skip
            opusHead.writeUInt32LE(this.sampleRate, 12);
            opusHead.writeUInt16LE(0, 16); // Output gain
            opusHead.writeUInt8(0, 18); // Channel mapping family
            this.writeOggPage(outputStream, opusHead, 0, true);

            const opusTags = Buffer.from('OpusTags\x00\x00\x00\x00', 'binary');
            this.writeOggPage(outputStream, opusTags, 1, false);

            const chunkSize = 2 * this.channels * 960; // 20ms of audio at 48kHz
            let packetNumber = 2;
            let granulePosition = 0;

            for (let i = 0; i < this.rawAudioData.length; i += chunkSize) {
                const chunk = this.rawAudioData.slice(i, i + chunkSize);
                let encodedChunk: Buffer;
                try {
                    encodedChunk = opusEncoder.encode(chunk);
                } catch (error) {
                    console.error("[OggVorbisEncoder] Error encoding chunk:", error);
                    reject(error);
                    return;
                }

                this.writeOggPage(outputStream, encodedChunk, packetNumber, false, granulePosition);
                granulePosition += 960; // Increment by 20ms worth of samples
                packetNumber++;
            }

            outputStream.end();

            outputStream.on('finish', () => {
                console.log("[OggVorbisEncoder] Ogg Opus file saved to", outputPath);
                console.timeEnd("[OggVorbisEncoder] Encoding Time");
                resolve();
            });
        });
    }

    private writeOggPage(stream: fs.WriteStream, data: Buffer, packetNumber: number, isFirstPage: boolean, granulePosition: number = 0) {
        const pageHeader = Buffer.alloc(27);
        pageHeader.write('OggS', 0);
        pageHeader.writeUInt8(isFirstPage ? 0x02 : 0x00, 5);
        pageHeader.writeUInt32LE(granulePosition & 0xFFFFFFFF, 6);
        pageHeader.writeUInt32LE(Math.floor(granulePosition / Math.pow(2, 32)), 10);
        pageHeader.writeUInt32LE(1, 14); // Stream serial number
        pageHeader.writeUInt32LE(packetNumber, 18);

        const numSegments = Math.ceil(data.length / 255);
        pageHeader.writeUInt8(numSegments, 26);

        const segmentTable = Buffer.alloc(numSegments);
        for (let i = 0; i < numSegments - 1; i++) {
            segmentTable[i] = 255;
        }
        segmentTable[numSegments - 1] = data.length % 255;

        stream.write(pageHeader);
        stream.write(segmentTable);
        stream.write(data);
    }
}
// --------------------- logs exist but error

// clearing logs
// import * as fs from 'fs';

// export class OggVorbisEncoder {
//     private rawAudioData: Buffer;
//     private sampleRate: number;
//     private channels: number;

//     constructor(rawAudioData: Buffer, sampleRate: number, channels: number) {
//         this.rawAudioData = rawAudioData;
//         this.sampleRate = sampleRate;
//         this.channels = channels;
//     }

//     public encode(): Buffer {
//         console.log('Starting encoding process...');
//         const oggHeader = this.createOggHeader();
//         const vorbisHeader = this.createVorbisHeader();
//         const vorbisData = this.encodePcmToVorbis();

//         const oggData = Buffer.concat([oggHeader, vorbisHeader, vorbisData]);

//         console.log('Encoding complete.');
//         return oggData;
//     }

//     private createOggHeader(): Buffer {
//         const oggHeader = Buffer.alloc(27);
//         oggHeader.write('OggS', 0, 4, 'ascii');  
//         oggHeader.writeUInt8(0, 4);  
//         oggHeader.writeUInt8(0x02, 5);  
//         oggHeader.writeUInt32LE(0, 6);  
//         oggHeader.writeUInt32LE(0, 10); 
//         oggHeader.writeUInt32LE(1, 14); 
//         oggHeader.writeUInt32LE(0, 18); 
//         oggHeader.writeUInt32LE(0, 22); 
//         oggHeader.writeUInt8(1, 26);  
//         return oggHeader;
//     }

//     private createVorbisHeader(): Buffer {
//         const vorbisHeader = Buffer.alloc(30);
//         vorbisHeader.write('\x01vorbis', 0, 7, 'ascii');  
//         vorbisHeader.writeUInt32LE(0x00000100, 7);  
//         vorbisHeader.writeUInt8(this.channels, 11);  
//         vorbisHeader.writeUInt32LE(this.sampleRate, 12);  
//         vorbisHeader.writeUInt32LE(0, 16);  
//         vorbisHeader.writeUInt32LE(0, 20);  
//         vorbisHeader.writeUInt32LE(0, 24);  
//         vorbisHeader.writeUInt8(0, 28);  
//         vorbisHeader.writeUInt8(1, 29);  
//         return vorbisHeader;
//     }

//     private encodePcmToVorbis(): Buffer {
//         const vorbisData = this.rawAudioData.map(byte => byte ^ 0xAA);  
//         return Buffer.from(vorbisData);
//     }

//    public saveToFile(outputPath: string) {
//         const oggData = this.encode();
//         fs.writeFileSync(outputPath, oggData);
//         console.log(`Ogg Vorbis file saved to ${outputPath}`);
//     }
// }
// cleaning logs
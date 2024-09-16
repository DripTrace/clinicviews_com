declare module "node-opus" {
    export class OpusEncoder {
        constructor(samplingRate: number, channels: number);
        encode(buffer: Float32Array): Buffer;
        delete(): void;
    }

    export class OpusDecoder {
        constructor(samplingRate: number, channels: number);
        decode(buffer: Buffer): Float32Array;
        delete(): void;
    }
}

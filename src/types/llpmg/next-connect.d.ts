// declare module "next-connect" {
//     import { IncomingMessage, ServerResponse } from "http";

//     type NextConnect<
//         Req = IncomingMessage,
//         Res = ServerResponse,
//     > = import("next").NextApiHandler<Req, Res> & {
//         use: (...args: any[]) => NextConnect<Req, Res>;
//         get: (...args: any[]) => NextConnect<Req, Res>;
//         post: (...args: any[]) => NextConnect<Req, Res>;
//         // Add other HTTP methods if needed
//     };

//     interface Options<Req, Res> {
//         onError?: (
//             err: any,
//             req: Req,
//             res: Res,
//             next: (err?: any) => void
//         ) => void;
//         onNoMatch?: (req: Req, res: Res) => void;
//     }

//     function nextConnect<Req = IncomingMessage, Res = ServerResponse>(
//         options?: Options<Req, Res>
//     ): NextConnect<Req, Res>;

//     export default nextConnect;
// }

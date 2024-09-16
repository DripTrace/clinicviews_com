// "use client";

// import { useEffect, useState, useCallback } from "react";

// export const useWebSocket = (url: string) => {
//     const [socket, setSocket] = useState<WebSocket | null>(null);
//     const [lastMessage, setLastMessage] = useState<string | null>(null);

//     useEffect(() => {
//         console.log(
//             "[useWebSocket] Initializing WebSocket connection to:",
//             url
//         );
//         const ws = new WebSocket(url);
//         setSocket(ws);

//         ws.onopen = () => {
//             console.log("[useWebSocket] WebSocket connection established");
//         };

//         ws.onmessage = (event) => {
//             console.log(
//                 "[useWebSocket] WebSocket message received:",
//                 event.data
//             );
//             setLastMessage(event.data);
//         };

//         ws.onerror = (error) => {
//             console.error("[useWebSocket] WebSocket error:", error);
//         };

//         ws.onclose = (event) => {
//             console.log("[useWebSocket] WebSocket connection closed:", event);
//         };

//         return () => {
//             console.log("[useWebSocket] Closing WebSocket connection");
//             ws.close();
//         };
//     }, [url]);

//     const sendMessage = useCallback(
//         (message: string) => {
//             if (socket && socket.readyState === WebSocket.OPEN) {
//                 console.log(
//                     "[useWebSocket] Sending WebSocket message:",
//                     message
//                 );
//                 socket.send(message);
//             } else {
//                 console.error(
//                     "[useWebSocket] WebSocket is not open. ReadyState:",
//                     socket?.readyState
//                 );
//             }
//         },
//         [socket]
//     );

//     return { lastMessage, sendMessage };
// };

export default {};

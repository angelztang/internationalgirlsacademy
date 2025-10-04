import { useEffect } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";

ZoomMtg.setZoomJSLib("https://source.zoom.us/3.7.0/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

interface ZoomMeetingProps {
    meetingNumber: string;
    userName: string;
    userType: "admin" | "member" | "guest";
    meetingType: "presentation" | "normal";
}

interface SignatureResponse {
    signature: string;
}

export default function ZoomMeeting({
    meetingNumber,
    userName,
    userType,
    meetingType,
}: ZoomMeetingProps) {
    useEffect(() => {
        const joinMeeting = async () => {
            try {
                // Determine role
                const role =
                    userType === "admin" && meetingType === "presentation" ? 1 : 0;

                // Fetch signature from backend
                const res = await fetch(
                    `/get_signature?meeting_number=${meetingNumber}&role=${role}`
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch signature: ${res.statusText}`);
                }

                const { signature }: SignatureResponse = await res.json();

                ZoomMtg.init({
                    leaveUrl: "https://yourwebsite.com/leave",
                    success: () => {
                        ZoomMtg.join({
                            sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY as string,
                            signature,
                            meetingNumber,
                            passWord: "MEETING_PASS",
                            userName,
                            userEmail: "user@example.com",
                            success: () => {
                                console.log("Joined Zoom Meeting");
                            },
                            error: (err:Error) => {
                                console.error("Zoom join error:", err);
                            },
                        });
                    },
                    error: (err:Error) => {
                        console.error("Zoom init error:", err);
                    },
                });
            } catch (err) {
                console.error("Join meeting error:", err);
            }
        };

        joinMeeting();
    }, [meetingNumber, userName, userType, meetingType]);

    return (
        <div id="zmmtg-root">
            {/* Zoom injects its UI into this div */}
        </div>
    );
}

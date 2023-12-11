
export var dataChannel = null;
export var mediaST = null;
export var peerConn = null;
async function log(...msg) {
  //if (config?.client?.debug) {
  const dt = new Date();
  const ts = `${dt.getHours().toString().padStart(2, "0")}:${dt
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}.${dt
    .getMilliseconds()
    .toString()
    .padStart(3, "0")}`;
  // eslint-disable-next-line no-console
  console.log(ts, "webrtc", ...msg);
  // }
}


export async function webRTC(elementName = null, deviceId = null, rtcp = null) {
  //if (!config) config = await getConfig();
  //const suuid = streamName || "reowhite";
  log("client starting");
  //log(`server: http://${location.hostname}${config.server.encoderPort} stream: ${suuid}`);
    peerConn = new RTCPeerConnection();
    mediaST = new MediaStream();
    peerConn.oniceconnectionstatechange = () =>
        log("connection", peerConn.iceConnectionState);
    peerConn.onnegotiationneeded = async () => {
        const offer = await peerConn.createOffer();
        await peerConn.setLocalDescription(offer);
    const res = await fetch(
      `https://192.168.1.120:8002/stream/receiver/${deviceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: new URLSearchParams({
          suuid: `${deviceId}`,
            data: `${btoa(peerConn.localDescription?.sdp || "")}`,
        }),
      }
    );
    console.log(res);
    const data = res && res.ok ? await res.text() : "";
    if (data.length === 0) {
      log("cannot connect:", `https://192.168.1.120:8002`);
    } else {
        peerConn.setRemoteDescription(
        new RTCSessionDescription({
          type: "answer",
          sdp: atob(data),
        })
      );
      log("negotiation start:", offer);
    }
  };
    peerConn.ontrack = (event) => {
        mediaST.addTrack(event.track);
    const video =
      typeof elementName === "string"
        ? document.getElementById(elementName)
        : elementName;
    // @ts-ignore
        if (video instanceof HTMLVideoElement) video.srcObject = mediaST;
    else log("element is not a video element:", elementName);
    video.onloadeddata = async () =>
      log("resolution:", video.videoWidth, video.videoHeight);
    log("received track:", event.track, event.track.getSettings());
  };

  const res = await fetch(
    `https://192.168.1.120:8002/stream/codec/${deviceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({
        uuid: `${deviceId}`,
        url: `${rtcp}`,
      }),
    }
  );
  let streams = [];
  try {
    streams = res && res.ok ? await res.json() : [];
  } catch {
    /**/
  }
  if (streams.length === 0) {
    log("received no streams");
    return;
  }
  log("received streams:", streams);
  for (const s of streams) {
      peerConn.addTransceiver(s.Type, { direction: "sendrecv" });
  }

  dataChannel = peerConn.createDataChannel(deviceId);
  dataChannel.onmessage = (e) =>
    log("channel message:", dataChannel.label, "payload", e.data);
    dataChannel.onerror = (e) => log("channel error:", channel.label, "payload", e);
    dataChannel.onclose = () => log("channel close");
  dataChannel.onopen = () => {
    log("channel open");
    setInterval(() => dataChannel.send("ping"), 1000); // send ping becouse PION doesn't handle RTCSessionDescription.close()
    };
}

//window.onload = () => webRTC(2, "videoElem");

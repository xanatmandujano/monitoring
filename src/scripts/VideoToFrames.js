export const VideoToFramesMethod = {
  fps: 0,
  totalFrames: 1,
};

export class VideoToFrames {
  /**
   * Extracts frames from the video and returns them as an array of imageData
   * @param videoUrl url to the video file (html5 compatible format) eg: mp4
   * @param amount number of frames per second or total number of frames that you want to extract
   * @param type [fps, totalFrames] The method of extracting frames: Number of frames per second of video or the total number of frames acros the whole video duration. defaults to fps
   */

  static getFrames(videoUrl, amount, type = VideoToFramesMethod.fps) {
    return new Promise((resolve, reject) => {
      const frames = [];
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const video = document.createElement("video");

      video.preload = "auto";

      video.addEventListener("loadeddata", async function () {
        canvas.width = video.width;
        canvas.height = video.height;
        const duration = video.duration;

        let totalFrames = amount;
        if (type === VideoToFramesMethod.fps) {
          totalFrames = duration * amount;
        }

        for (let time = 0; time < duration; time += duration / totalFrames) {
          const frame = await VideoToFrames.getVideoFrame(
            video,
            context,
            canvas,
            time
          );
          frames.push(frame);
        }

        resolve(frames);
      });

      video.src = videoUrl;
      video.load();
    });
  }

  static getVideoFrame(video, context, canvas, time) {
    return new Promise((resolve, reject) => {
      const eventCallback = () => {
        video.removeEventListener("seeked", eventCallback);
        VideoToFrames.storeFrame(video, context, canvas, resolve);
      };
      video.addEventListener("seeked", eventCallback);
      video.currentTime = time;
    });
  }

  static storeFrame(video, context, canvas, resolve) {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const frame = new VideoFrame(video);
    console.log(frame);

    resolve(canvas.toDataURL());
  }
}

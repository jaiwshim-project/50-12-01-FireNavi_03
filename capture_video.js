const puppeteer = require("puppeteer-core");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  const videoPath = path.resolve("copyright/화이어내비_영상.mp4").replace(/\\/g, "/");
  const html = `<html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;">
    <video id="v" src="file:///${videoPath}" style="max-width:100%;max-height:100%;"></video>
    <script>
      const v = document.getElementById("v");
      v.muted = true;
      window.seekTo = (t) => { v.currentTime = t; return new Promise(r => v.addEventListener("seeked", r, {once:true})); };
      v.addEventListener("loadedmetadata", () => { document.title = "ready:" + v.duration + ":" + v.videoWidth + "x" + v.videoHeight; });
    </script>
  </body></html>`;
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));
  const title = await page.title();
  console.log("Video info:", title);
  if (title.startsWith("ready:")) {
    const parts = title.split(":");
    const duration = parseFloat(parts[1]);
    console.log("Duration:", duration, "seconds, Resolution:", parts[2]);
    const times = [1, Math.floor(duration*0.2), Math.floor(duration*0.4), Math.floor(duration*0.6), Math.floor(duration*0.8), Math.floor(duration-2)];
    for (let i = 0; i < times.length; i++) {
      await page.evaluate((sec) => window.seekTo(sec), times[i]);
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: "copyright/영상캡처_" + (i+1) + ".png" });
      console.log("Frame " + (i+1) + " at " + times[i] + "s");
    }
  }
  await browser.close();
})();

const path = require("path");
const fs = require('fs')
const baseResponse = require("../../utils/baseResponse");
const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
const ffmpeg = createFFmpeg({ log: true });
module.exports = {
  async main(req) {
    const { serial } = req.query
    if (!serial) {
      return new baseResponse().fail('缺少参数');
    }
    const VIDEO_BASE_PATH = path.join(__dirname, "./videoFiles/SpyPlayHouse",);
    const mergerPath = path.join(VIDEO_BASE_PATH, serial)
    const fileList = fs.readdirSync(mergerPath)
      .filter(e => e.includes('.ts'))
      .map(e => ({ sortNum: e.split('-')[0], link: e }))
      .sort((curr, next) => curr.sortNum - next.sortNum)
      .map(e => e.link)
    this.mergeVideos(fileList, mergerPath)
  },
  async mergeVideos(mergeList = [], outputPath) {
    const mergeListLength = mergeList.length;
    let startIndex = 0;
    await ffmpeg.load();
    const videoNames = [];
    while (startIndex < mergeListLength) {
      const currMerge = mergeList[startIndex]
      console.log(path.join(outputPath, '/', currMerge), '路径')
      const currFetchFile = await fetchFile(path.join(outputPath, '/', currMerge));
      const currBuffer = currFetchFile.slice(1);
      ffmpeg.FS("writeFile", currMerge, currBuffer);
      videoNames.push(currMerge);
      startIndex++;
    }
    await ffmpeg.run("-i", `concat:${videoNames.join("|")}`, "-threads", "8", "output.mp4");
    await fs.promises.writeFile(
      outputPath + "/output.mp4",
      ffmpeg.FS("readFile", "output.mp4")
    );
    process.exit(0);
  },
};

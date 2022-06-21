const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");
const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
const ffmpeg = createFFmpeg({ log: true });
/**
 * 下载片段到本地
 * @param {*} filename
 * @param {*} link
 * @param {*} savePath
 * @returns
 */
async function downfileToLoacal(filename, link, savePath) {
  return new Promise((resove, reject) => {
    let fragFile = fs.createWriteStream(savePath + filename + ".ts");
    axios
      .get(link, {
        responseType: "stream",
      })
      .then((res) => {
        res.data.pipe(fragFile);
        fragFile.on("finish", () => {
          resove();
          console.log(filename + "完成");
        });
        fragFile.on("error", () => {
          console.error(filename + "出错");
          reject();
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 获取文件名字
 * https://ali2.a.kwimgs.com/ufile/adsocial/15133539-5d21-443d-9621-a6f9212f94b5.jpg
 * a.yximgs.com/udata/music/music_7e2df54bcee147e79646486f4191b3390.jpg
 */
function getFileName(str) {
  return str.split("/").pop().split(".")[0];
}
/**
 * 循环下载文件
 * @param {*} fileList
 * @param string outpath 输出路径
 */
async function loopDownFile(fileList, outpath) {
  if (!fileList.length) return true;
  let currFile = fileList.shift();
  const fileName = currFile.sort + "-" + getFileName(currFile.link);
  await downfileToLoacal(fileName, currFile.link, outpath);
  return loopDownFile(fileList, outpath);
}
module.exports = {
  async downfile(req) {
    let downLinks = await getDownloadLink();
    const downLinkLength = downLinks.length;
    const VIDEO_NAME = "SpyPlayHouse";
    const VIDEO_BASE_PATH = path.join(__dirname, "./videoFiles");
    try {
      const dir = await fs.promises.opendir(VIDEO_BASE_PATH);
      for await (const dirent of dir) console.log(dirent.name);
    } catch (err) {
      console.error(err);
    }
    // 创建主目录
    await createFileDir(VIDEO_BASE_PATH + "/" + VIDEO_NAME);
    // 创建子目录并写入待下载文件列表
    downLinks = downLinks.map((e, i) => {
      const mkDirName = `${VIDEO_BASE_PATH}/${VIDEO_NAME}/${
        i < 10 ? "0" + i : i
      }`;
      createFileDir(mkDirName);
      return {
        link: e,
        path: mkDirName,
      };
    });
    let writeU3m8StartIndex = 0;
    while (writeU3m8StartIndex < downLinkLength) {
      const u3m8TextName = "u3m8TextName.txt";
      const currDownVideo = downLinks[writeU3m8StartIndex];
      let fragU3M8LinkText = fs.createWriteStream(
        currDownVideo.path + "/" + u3m8TextName
      );
      let videoU3m8LinkText = await getU3M8Data(
        currDownVideo.link,
        currDownVideo.path
      );
      let videoFragLinks = videoU3m8LinkText
        .split("\n")
        .filter((item) => item.match(/\.jpg$/))
        .map((e, i) => ({ link: e, sort: i + 1, isLoad: false }));
      fragU3M8LinkText.write(JSON.stringify(videoFragLinks));
      fragU3M8LinkText.on("end", () => {
        console.log(currDownVideo.path, "本次u3m8片段记录完成");
      });
      writeU3m8StartIndex++;
    }

    // 开始批量读取下载片段
    let downloadFileStartIndex = 0;
    while (downloadFileStartIndex < downLinkLength) {
      const u3m8TextName = "u3m8TextName.txt";
      const currDownVideo = downLinks[downloadFileStartIndex];
      let fragU3M8LinkText = currDownVideo.path + "/" + u3m8TextName;
      let data = fs.readFileSync(fragU3M8LinkText, "utf-8");
      videoFragLinks = JSON.parse(data);
      let isDownloadSuccessfully = await loopDownFile(
        videoFragLinks,
        currDownVideo.path + "/"
      );
      console.log(
        "🚀 ~ file: download.js ~ line 108 ~ downfile ~ isDownloadSuccessfully",
        isDownloadSuccessfully
      );
      if (isDownloadSuccessfully) {
        downloadFileStartIndex++;
      }
    }
  },
  async mergeVideos() {
    const mergeListLength = 7;
    let startIndex = 1;
    const basePath = path.join(__dirname, "./videoFiles/testmerge/");
    await ffmpeg.load();
    const videoNames = [];
    while (startIndex <= mergeListLength) {
      const currfileName = `merge-${startIndex.toString()}.ts`;
      const testFetchFile = await fetchFile(basePath + currfileName);
      const currBuffer = testFetchFile.slice(1);
      ffmpeg.FS("writeFile", currfileName, currBuffer);
      videoNames.push(currfileName);
      startIndex++;
    }
    await ffmpeg.run("-i", `concat:${names.join("|")}`, "test.mp4");
    await fs.promises.writeFile(
      basePath + "./output.mp4",
      ffmpeg.FS("readFile", "test.mp4")
    );
    process.exit(0);
  },
  /**
   * 获取当前目录下所有文件的名字
   */
  async getDirsFilesName() {
    let bufferStartIndex = 2504;
    const basePath = path.join(__dirname, "./videoFiles/testmerge/");
  },
};

function checkIsHaveFile(path) {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      let result = err ? false : true;
      console.log(`${err ? "does not exist" : "exists"}`);
      resolve(result);
    });
  });
}

/**
 * 获取下载的链接地址
 */
async function getDownloadLink() {
  const downLinks = path.join(
    __dirname,
    "./videoFiles/links/jiandieguojiajia.js"
  );
  const result = (await import(downLinks)).default;
  return result;
}

async function createFileDir(path) {
  fs.mkdirSync(path, { recursive: true }, (err) => {
    if (err) throw err;
  });
  console.log(path, "创建成功");
}

async function getU3M8Data(link, name) {
  console.log(name, "开始获取");
  return new Promise((resove, reject) => {
    axios
      .get(link, {
        onDownloadProgress: function (progressEvent) {
          console.log(name, "下载进度 🚀", progressEvent);
          // Do whatever you want with the native progress event
        },
      })
      .then((res) => {
        console.log(name, "获取成功");
        resove(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

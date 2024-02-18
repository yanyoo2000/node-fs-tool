var fs = require("fs");
const util = require("util");
var path = require("path");

const readdirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);
const renameAsync = util.promisify(fs.rename);

/**目标文件夹路径 */
var folderPath = path.resolve("D:\\Users\\yanyoo2000\\Downloads");
if (!fs.existsSync(folderPath)) {
  console.log(`路径: ${folderPath} 没有找到!`);
  return;
}

let removeTags = [
  "POPGO",
  "LKSUB",
  "LoliHouse",
  "Sakurato",
  "XKsub",
  "Nekomoe kissaten",
  "DMG",
  "Kamigami",
  "WEBrip",
  "MP4",
  "ANi",
  "1080p",
  "720p",
  "10bit",
  "8bit",
  "web-dl",
  "BDRIP",
  "chs",
  "cht",
  "AT-X",
  "aac",
  "Baha",
  "JPSC",
];

let replace = (text, matchString) => {
  let result = text.replace(/\[([^\]]+)\]/g, function (match, p1) {
    return p1.toLowerCase().includes(matchString.toLowerCase()) ? "" : match;
  });
  return result;
};

(async () => {
  try {
    const files = await readdirAsync(folderPath);
    for (let file of files) {
      let newFile = file;

      removeTags.forEach((tag) => {
        newFile = replace(newFile, tag);
      });

      if (newFile.includes("[") || newFile.includes("]")) {
        newFile = newFile.replaceAll("[", " ");
        newFile = newFile.replaceAll("]", " ");
        newFile = newFile
          .split(" ")
          .filter((item) => item.trim() !== "")
          .join(" ");

        let pos = newFile.lastIndexOf(" ");
        if (pos !== -1) {
          newFile = newFile.slice(0, pos) + newFile.slice(pos + 1);
        }
      }

      newFile = newFile.trim();

      const oldPath = path.join(folderPath, file);
      const newPath = path.join(folderPath, newFile);
      if (oldPath === newPath) {
        continue;
      }
      const stats = await statAsync(oldPath);
      if (stats.isFile()) {
        await renameAsync(oldPath, newPath);
        console.log(`${file} 已重命名为 ${newFile}`);
      }
      if (stats.isDirectory()) {
        await renameAsync(oldPath, newPath);
        console.log(`${file} 已重命名为 ${newFile}`);
      }
    }
  } catch (err) {
    console.error("操作失败:", err);
  }
})();

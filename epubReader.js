var fs = require("fs");
var path = require("path");
var fileDirectory = path.resolve("C:\\Users\\yanyoo2000\\Desktop\\epub");

if (!fs.existsSync(fileDirectory)) {
  console.log(`路径: ${fileDirectory} 没有找到!`);
  return;
}

let str = fs.readFileSync(path.join(fileDirectory, "vol.opf"), "utf8");
let manifestLines = str.match(/<manifest(.*?)<\/manifest>/s)[1].split("\n");
let spineLines = str.match(/<spine(.*?)<\/spine>/s)[1].split("\n");

spineLines
  .filter((line) => line.includes("itemref"))
  .map((line) => /idref="([^"]+)"/.exec(line)[1])
  .map(
    (id) =>
      manifestLines.find((line) => line.includes(id)).match(/href="([^"]+)"/)[1]
  )
  .map((href) =>
    path.join(
      path.join(fileDirectory, "vol.opf"),
      fs
        .readFileSync(path.join(fileDirectory, href), "utf8")
        .match(/src="([^"]+)"/)[1]
    )
  )
  .forEach((element, index) => {
    fs.renameSync(
      element,
      element.replace(
        /-0*(\d+)/,
        "-" + parseInt(index, 10).toString(10).padStart(4, "0")
      )
    );
  });

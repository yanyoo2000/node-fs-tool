var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');
var fileDirectory = path.resolve('C:\\Users\\yanyoo2000\\Desktop\\待分类仓库');

let count = 0
let screenWidth = 3840
let screenheight = 2160

let newMkdirName = ''

let history = []
let renameIndex = -1

// 判断目录是否存在
if (fs.existsSync(fileDirectory)) {
    // 获取文件列表
    fs.readdir(fileDirectory, function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        // 循环文件
        files.forEach(function (filename) {
            if (filename.substr(-3) === 'png' || filename.substr(-3) === 'jpg') {
                // 获取当前文件的绝对路径
                var filepath = path.join(fileDirectory, filename);
                // 获取图片尺寸
                var dimensions = sizeOf(filepath);
                var width = dimensions.width;
                var height = dimensions.height;
                let ratio = width / height

                if (ratio > 1) {

                    if (ratio < (screenWidth / screenheight)) {
                        if (width * height * 16 > 178956970) {
                            newMkdirName = '高分辨率_宽度w'
                        } else if (height < (screenheight / 4)) {
                            newMkdirName = '低分辨率_宽度w'
                        } else {
                            newMkdirName = '宽度w'
                        }
                    } else {
                        if (width * height * 16 > 178956970) {
                            newMkdirName = '高分辨率_高度h'
                        } else if (width < (screenWidth / 4)) {
                            newMkdirName = '低分辨率_高度h'
                        } else {
                            newMkdirName = '高度h'
                        }
                    }


                } else {
                    newMkdirName = '方图和竖图'
                }
                count++
                history.push({ id: count, dir: newMkdirName })
                let newMkdir = `C:\\Users\\yanyoo2000\\Desktop\\${newMkdirName}\\`
                if (fs.existsSync(newMkdir) === false) {
                    fs.mkdir(newMkdir, function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(`创建 文件夹'${newMkdirName}'成功`);
                    });
                }
                let newFilepath = newMkdir + filename
                fs.rename(filepath, newFilepath, function (err) {
                    renameIndex++
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`NO.${history[renameIndex].id}  移动到'${history[renameIndex].dir}'文件夹  ${filename}`);
                });
            }
        });
    });
} else {
    console.log(`路径: ${fileDirectory} 没有找到!`);
    fs.mkdir(fileDirectory, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`创建文件夹: 待分类仓库 成功!`);
    });
}
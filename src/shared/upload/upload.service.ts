import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ensureDir, outputFile } from 'fs-extra';
import { encryptFileMD5 } from '../utils/cryptogram.utiils';

@Injectable()
export class UploadService {
  /**
   * 上传文件
   * @param file
   * @returns
   */
  async upload(file) {
    // 判断是否存在此文件夹
    const uploadDir =
      !!process.env.UPLOAD_DIR && process.env.UPLOAD_DIR !== ''
        ? process.env.UPLOAD_DIR
        : join(__dirname, '../../../', 'static/upload');

    await ensureDir(uploadDir);
    const sign = encryptFileMD5(file.buffer);
    // 获取文件的类型（文件后缀名）
    const arr = file.originalname.split('.');
    const fileType = arr[arr.length - 1];
    // 计算完整的文件名
    const fileName = sign + '.' + fileType;

    // 计算上传文件的完整路径
    const uploadPath = uploadDir + '/' + fileName;
    await outputFile(uploadPath, file.buffer);

    return {
      url: '/static/upload/' + fileName,
      path: uploadPath,
    };
  }
}

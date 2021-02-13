import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = "makerealworldsandy9703";

@Controller('uploads')
export class UploadsController {
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        AWS.config.update({
            credentials: {
                accessKeyId: 'AKIAZQIRYGFZR43X5HXL',
                secretAccessKey: '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',
            },
        });
        try {
			console.log(file);
			const objectName = `${Date.now() + file.originalname}`;
            const upload = await new AWS.S3()
			.putObject({
				Body: file.buffer,
				Bucket: BUCKET_NAME,
				Key: objectName,
				ACL: "public-read",
			}).promise();
			const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
			return { url } ;
        } catch(e) {
			return null;
		}
    }
}
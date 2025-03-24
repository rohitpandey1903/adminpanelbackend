import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Property, PropertyDocument } from './entities/property.entity';
import { Model } from 'mongoose';
import { PutObjectCommand, S3Client, ObjectCannedACL } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PropertyService {
  private s3 : S3Client;

  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    private configService: ConfigService
  ) {
    this.s3 = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY')
      }
    })
  }
  async create(createPropertyDto: CreatePropertyDto) : Promise<Property> {
    const newProperty = new this.propertyModel(createPropertyDto);
    newProperty.createdAt = new Date();
    return newProperty.save();
  }

  async findAll() : Promise<Property[]> {
    return this.propertyModel.find().exec();
  }

  async getURL(fileName :string, fileType : string) {  // Add the request object as a parameter
    try{
      const s3Key = `property-images/${fileName}`;
      const params = {
        Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
        Key: s3Key,
        ContentType: fileType,
        ACL: ObjectCannedACL.public_read,
      }

      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
      const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
      const region = this.configService.get<string>('AWS_REGION') || 'ap-south-1';
      const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
      return {url, publicUrl}
    } catch (error) { 
      console.error(error);
      return {error};
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} property`;
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}

import { ImageModel } from '@models/image.model';
import {
  formatAttributeName,
  getImageUrl,
  getReturnData,
  getReturnList,
  removeNestedNullish,
} from '@utils/index';
import { BadRequestError, NotFoundError } from '../core/errors';
import { IImageAttrs } from '../interfaces/image.interface';
import { IMAGE } from '../constants';
import { unlink } from 'fs/promises';
import { isValidObjectId } from 'mongoose';
import slugify from 'slugify';

const getImages = async (query: Record<string, string>) => {
  const filter = {} as any;
  if (query.type) {
    filter.img_type = query.type;
  }
  if (query.types) {
    filter.img_type = {
      $in: query.types.split(',').map((type) => type.trim()),
    };
  }
  if (query.isPublic) {
    filter.img_isPublic = query.isPublic === 'true';
  }
  const images = await ImageModel.find(filter, ['-__v -img_description'])
    .sort({ img_type: 1 })
    .lean();

  return getReturnList(images);
};

const getImage = async (id: string) => {
  const image = await ImageModel.findOne(
    {
      $or: [{ _id: isValidObjectId(id) ? id : null }, { img_name: id }],
    },
    ['-__v']
  ).lean();

  if (!image) throw new NotFoundError('Image not found');

  return getReturnData(image);
};

const createImage = async (files?: Express.Multer.File[]) => {
  if (!files) throw new BadRequestError('No image uploaded');

  const newImage = [];
  for (const file of files) {
    const image = await ImageModel.build({
      name: file.filename,
      url: getImageUrl(slugify(file.filename)),
      title: file.filename.split('.')[0],
    });
    newImage.push(image);
  }
  return getReturnList(newImage);
};

const updateImage = async (id: string, image: IImageAttrs) => {
  const updatedImage = await ImageModel.findOneAndUpdate(
    { $or: [{ _id: isValidObjectId(id) ? id : null }, { img_name: id }] },
    {
      ...formatAttributeName(removeNestedNullish(image), IMAGE.PREFIX),
    },
    { new: true }
  );
  // If image not found
  if (!updatedImage) throw new NotFoundError('Image not found');
  return getReturnData(updatedImage);
};

const deleteImage = async (id: string) => {
  const deletedImage = await ImageModel.findOneAndDelete({
    $or: [{ _id: isValidObjectId(id) ? id : null }, { img_name: id }],
  });
  // If image not found
  if (!deletedImage) throw new NotFoundError('Image not found');

  unlink(`public/uploads/${deletedImage.img_name}`).catch((err) => {
    console.error(err);
  });
  return getReturnData(deletedImage || {});
};

export { getImages, getImage, createImage, updateImage, deleteImage };

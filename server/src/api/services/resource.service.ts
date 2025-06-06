import { NotFoundError } from '../core/errors';
import { ResourceModel } from '../models/resource.model';
import { IResourceInput } from '../interfaces/resource.interface';
import { getReturnData, getReturnList } from '@utils/index';
import { isValidObjectId } from 'mongoose';

const getResources = async (query: any = {}) => {
  const resources = await ResourceModel.find(
    query,
    'name slug description'
  ).sort({ createdAt: -1 });
  return getReturnList(resources);
};

const createResource = async (resourceData: IResourceInput) => {
  // Tạo instance mới
  const newResource = new ResourceModel(resourceData);
  // Lưu vào database
  const savedResource = await newResource.save();
  return getReturnData(savedResource);
};

const getResourceById = async (resourceId: string) => {
  let resource;
  if (isValidObjectId(resourceId))
    resource = await ResourceModel.findById(resourceId);
  else resource = await ResourceModel.findOne({ slug: resourceId });

  if (!resource) throw new NotFoundError('Resource not found');
  return getReturnData(resource);
};

const updateResource = async (
  resourceId: string,
  resourceData: Partial<IResourceInput>
) => {
  const resource = await ResourceModel.findByIdAndUpdate(
    resourceId,
    resourceData,
    { new: true }
  );
  if (!resource) throw new NotFoundError('Resource not found');
  return getReturnData(resource);
};

const deleteResource = async (resourceId: string) => {
  const resource = await ResourceModel.findByIdAndDelete(resourceId);
  if (!resource) throw new NotFoundError('Resource not found');
  return getReturnData(resource);
};

export {
  getResources,
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
};

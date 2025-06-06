import { HydratedDocument, Model, ObjectId } from 'mongoose';

export interface IRawCategory {
  id: string;
  cat_name: string;
  cat_url: string;
  cat_parent: ObjectId;
  cat_order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryAttrs {
  name: string;
  string: string;
  parent: string;
  order: number;
}

export type ICategory = HydratedDocument<IRawCategory>;

export interface ICategoryModel extends Model<ICategory> {
  build(attrs: ICategoryAttrs): Promise<ICategory>;
}

export interface ICategory {
  id: string;
  cat_name: string;
  cat_url: string;
  cat_parent?: {
    id: string;
    cat_name: string;
    cat_url: string;
    cat_parent?: string;
  };
  cat_order: number;
  createdAt: string;
  updatedAt: string;
}

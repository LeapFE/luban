export type getListQuery = {
  page?: number;
  size?: number;
};

export type ListData = Array<{ name: string; age: number; sex: 0 | 1; address: string }>;

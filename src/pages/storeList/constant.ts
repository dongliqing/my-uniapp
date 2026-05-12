export interface IStore {
  id: number;
  storeName: string;
  address: string;
  image: string;
  star: number;
  yearType: string;
  tags: string[];
  statusNo: string;
  statusLabel: string;
  complaint: string;
  caseHandle: string;
}

export enum YearTypeMap {
  '1-5年店铺' = 0,
  '6-9年店铺' = 1,
  '10-19年店铺' = 2,
  '20年以上店铺' = 3
}

export enum StatusMap {
  '正常经营' = 0,
  '整改中' = 1,
  '停业' = 2
}

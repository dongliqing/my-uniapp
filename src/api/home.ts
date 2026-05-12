import request from '@/utils/request.ts';
import request2 from '@/utils/request-2.ts';

export const getMessage = data => {
  return request.post('/api/ebuilder/form/formdata/v2/getFormDataList/shsj_zxzx', data);
};

//外卖堂食统计
export const getTangShiStat = data => {
  return request2.post('/api/dw/publish/shsj_ptsjtj', data);
};

//星级统计
export const getStarStat = data => {
  return request2.post('/api/dw/publish/shsj_xypj', data);
};

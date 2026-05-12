import request from '@/utils/request.ts';
import request2 from '@/utils/request-2.ts';

// 获取商家信息
export const getStoreInfo = data => {
  return request2.post('/api/dw/publish/shsj_sjxxcxlb', data);
};

// 获取商家得分
export const getScoreInfo = data => {
  return request.post('/api/ebuilder/form/formdata/v2/getFormDataList/shsj_sjdf', data);
};

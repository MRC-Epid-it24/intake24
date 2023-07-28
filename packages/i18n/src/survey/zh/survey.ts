import type { LocaleMessageObject } from 'vue-i18n';

const survey: LocaleMessageObject = {
  _: '调查',
  info: '调查信息',
  states: {
    _: '状态',
    notStarted: '数据收集尚未开始。',
    active: '数据收集正在进行中。',
    suspended: '数据收集已暂停。',
    completed: '数据收集已完成。',
  },
  openAccess: {
    _: '开放获取研究',
    none: {
      _: '没有开放获取研究',
      subtitle: '目前没有可用的开放获取研究。',
    },
  },
  generateUser: {
    _: '生成访问权限',
    subtitle: '这是开放获取研究，您可以免费访问。',
    403: `调查 {surveyId} 不允许生成用户。`,
    404: `调查 {surveyId} 尚未被识别。`,
    422: '提供的验证码无效。',
    429: '刚刚生成新用户，请稍后重试。',
  },
};

export default survey;

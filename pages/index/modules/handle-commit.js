import requestCommit from './request-commit.js';
import router from './../../../utils/router.js';

const handleCommit = (question_list, paper_id) => {
  const answer_array = [];
  for (let i = 0, len = question_list.length; i < len; i++) {
    const questionData = question_list[i];
    answer_array.push({
      answer_value: questionData.selected,
      answer_question_id: questionData.question_id,
      is_user_name: questionData.question_context.is_user_name
    });
  }
  wx.showLoading({
    title: '请求中...',
    mask:true,
  });
  requestCommit(answer_array, paper_id).then((data) => {
    wx.hideLoading();
    router.navigateTo(`/pages/test-result/index?paper_id=${paper_id}`);
  }, (e) => {
    wx.hideLoading();
    wx.showToast({
      title: e && e.msg || "网络错误，请重试",
      icon: "none",
    });
  });
}

export default handleCommit;
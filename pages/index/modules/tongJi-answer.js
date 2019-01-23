const tongJiAnswer = (e, questList) => {
  const question_index = e.target.dataset.question_index;
  const selectVaule = e.detail.value;
  const question_list = questList;
  const questionData = question_list[question_index];
  if (!selectVaule) {
      return;
  }
  getApp().sensors.track('proceed_test', {
    topic_index: question_index,
    topic_name: questionData.question_desc,
    topic_id: questionData.question_id,
    topic_count: question_list.length,
  });
}

export default tongJiAnswer;
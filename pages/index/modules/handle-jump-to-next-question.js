import constValue from './const-value.js';

const handleJumpToNextQuestion = (page, currendIndex) => {
  let maxQuestionIndex = page.data.maxQuestionIndex;
  if (maxQuestionIndex > currendIndex) {
    return;
  }

  const questData = page.data.question_list[currendIndex];
  if (!questData.selected) {
    return;
  }

  page.setData({
    maxQuestionIndex: ++maxQuestionIndex,
  });
   
  setTimeout(() => {
    Promise.all([
      getTop(`${constValue.QUESTION_INDEX_BASE_ID}${++currendIndex}`, page),
      getTop(constValue.TOP_ANCHOR_POINT, page)
    ]).then((datas) => {
      wx.pageScrollTo({
        scrollTop: datas[0] - datas[1],
      })
    }, (e) => {

    });
  }, 200);
}

const getTop = (id, page) => {
  return new Promise((r, j) => {
    const query = wx.createSelectorQuery().in(page);
    query.select(`#${id}`).boundingClientRect((rect) => {
      if (!rect || !rect.top) {
        j();
        return;
      }

      const top = rect.top;
      r(top);

    }).exec();

  });

}

export default handleJumpToNextQuestion;
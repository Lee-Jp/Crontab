const request = require('request'); // node封装的请求中间件
const urlPre = 'https://juejin.cn/post/';

const resData = {
  msgtype: 'feedCard',
  feedCard: {
    links: [],
  },
};

// 发送到钉钉群
function send() {
  request(
    {
      url:
        'https://oapi.dingtalk.com/robot/send?access_token=93216f34b538458012df546fb86e0d2a3977927a58296eaf8af1f586e1d2f3de',
      headers: {
        'content-type': 'application/json',
      },
      method: 'post',
      body: resData,
      json: true, // 设置返回的数据为json
    },
    function (err, res, body) {
      if (!err && res.statusCode === 200) {
        console.log(body);
      }
    }
  );
}

// 获取热门文章
const getListData = {
  cate_id: '6809637767543259144',
  cursor: '0',
  id_type: 2,
  limit: 10,
  sort_type: 200,
};
getList();
function getList() {
  request(
    {
      url: 'https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed',
      headers: {
        'content-type': 'application/json',
      },
      method: 'post',
      body: getListData,
      json: true, // 设置返回的数据为json
    },
    function (err, res, body) {
      if (!err && res.statusCode === 200) {
        let article = body.data;
        article = article.map((i) => ({
          messageURL: `${urlPre}${i.article_id}`,
          title: `Sentry好文推荐：${i.article_info.title}`,
          content: `${i.article_info.brief_content}`,
        }));
        resData.feedCard.links = article;
//         send();  // 注释掉这里，就不会每天定时发布了
      }
    }
  );
}


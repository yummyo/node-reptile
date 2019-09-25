const https = require('https')
const cheerio = require('cheerio')
const fs = require('fs')

// 存放数据
let allData = {}
// 当前页面
let curPage = 0
let timer = null
function sendUrl() {
  let url =
    'https://www.liepin.com/zhaopin/?init=-1&headckid=0092d1322d588aba&fromSearchBtn=2&imscid=R000000058&ckid=0092d1322d588aba&degradeFlag=0&key=%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91&siTag=D_7XS8J-xxxQY6y2bMqEWQ%7EfA9rXquZc5IkJpXC-Ycixw&d_sfrom=search_fp_bar&d_ckId=e417dc5d4a7ae2092bb23d141d0e6c11&d_curPage=' +
    curPage +
    '&d_pageSize=40&d_headId=e417dc5d4a7ae2092bb23d141d0e6c11&curPage=' +
    curPage
  console.log('第' + (curPage * 1 + 1) + '个爬虫发出')
  https.get(url, res => {
    let _html = [],
      size = 0
    res.on('data', function(data) {
      _html.push(data)
      size += data.length
    })
    res.on('end', function() {
      let data = Buffer.concat(_html, size)
      let DOM = data.toString()
      let $ = cheerio.load(DOM)
      $('.sojob-list')
        .find('li')
        .each((i, v) => {
          if (!allData['page' + curPage]) allData['page' + curPage] = []
          allData['page' + curPage].push({
            title: $(v)
              .find('h3')
              .attr('title'),
            money: $(v)
              .find('.text-warning')
              .text(),
            time: $(v)
              .find('time')
              .text()
          })
        })

      setTimeout(() => {
        curPage++
        if (curPage < 5) {
          sendUrl()
        } else {
          console.log(allData)
          whireFile(allData)
        }
      }, 2 * 1000)
    })
  })
}
function whireFile() {
  fs.writeFile('./data.json', JSON.stringify({ data: allData }), err => {
    console.log(err, '写入成功')
  })
}
sendUrl()

// 公众号引流配置
const gateConfig = {
  // 站点名称（展示给访客看）
  siteName: '测开阿Duang',

  // 公众号里回复的关键词
  keyword: '密码',

  // 二维码图片路径（放在 docs/public/ 下）。留空则不展示二维码
  qrCode: '/wx-qr.png',

  // 口令的 base64（当前明文：duang2026）
  // 修改口令：在浏览器控制台执行 btoa('新口令') 获取新值
  passcodeEncoded: 'ZHVhbmcyMDI2',

  // 需要口令验证的路径前缀（专栏入口页本身不拦截）
  gatedPrefixes: ['/testing-basics/', '/interviews/', '/quality-assurance/', '/test-practice/'],

  // 专栏入口页路径（不拦截）
  indexPages: ['/testing-basics/', '/interviews/', '/quality-assurance/', '/test-practice/']
}

export default gateConfig
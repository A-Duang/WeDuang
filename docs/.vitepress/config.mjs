import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '阿Duang的知识库',
  description: '测试开发学习、面经与实战沉淀',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: false,
  base: '/',

  // SEO: 自动生成 sitemap.xml
  sitemap: {
    hostname: 'https://weduang.pages.dev'
  },

  // SEO: meta 标签
  head: [
    ['meta', { name: 'google-site-verification', content: '48NRAJ949sQGl8fzpjYVchm2i7MH6u24zo7StK-M2uw' }],
    ['meta', { name: 'keywords', content: '测试开发,测开,面经,质量保障,测试计划,Java,计算机基础,大厂面试' }],
    ['meta', { name: 'author', content: '阿Duang' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '阿Duang的知识库' }],
    ['meta', { property: 'og:description', content: '测试开发学习、面经与实战沉淀，从计算机基础到大厂面经，系统沉淀测开岗的硬核干货' }],
    ['meta', { property: 'og:url', content: 'https://weduang.pages.dev' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['link', { rel: 'canonical', href: 'https://weduang.pages.dev' }]
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '测试开发基础', link: '/testing-basics/' },
      { text: '质量保障', link: '/quality-assurance/' },
      { text: '面经收集', link: '/interviews/' },
      { text: '关于', link: '/about' }
    ],

    sidebar: {
      '/testing-basics/': [
        {
          text: '测试开发基础',
          items: [
            { text: '专栏首页', link: '/testing-basics/' },
            { text: '计算机基础', link: '/testing-basics/computer-basics' },
            { text: 'Java 核心技术', link: '/testing-basics/java-core' },
            { text: '测试理论与策略', link: '/testing-basics/testing-theory' },
            { text: 'Linux 与 Shell', link: '/testing-basics/linux-shell' },
            { text: '手撕代码高频题', link: '/testing-basics/coding-problems' },
            { text: 'AI 与大模型', link: '/testing-basics/ai-llm' },
            { text: '测开校招项目类型', link: '/testing-basics/campus-projects' }
          ]
        }
      ],
      '/quality-assurance/': [
        {
          text: '质量保障',
          items: [
            { text: '专栏首页', link: '/quality-assurance/' },
            { text: '测试计划怎么写', link: '/quality-assurance/test-plan' },
            { text: '测试报告模板', link: '/quality-assurance/test-report' },
            { text: '测试左移与测试右移', link: '/quality-assurance/shift-left-right' },
            { text: '测试如何参与需求评审', link: '/quality-assurance/requirement-review' },
            { text: '持续集成体系下的质量保障', link: '/quality-assurance/ci-quality' },
            { text: '如何保障开发代码的质量', link: '/quality-assurance/code-quality' },
            { text: '代码覆盖率统计 Jacoco 技术', link: '/quality-assurance/jacoco' }
          ]
        }
      ],
      '/interviews/': [
        {
          text: '综合',
          items: [
            { text: '专栏首页', link: '/interviews/' },
            { text: '面经总览', link: '/interviews/overview' }
          ]
        },
        {
          text: '大厂面经',
          collapsed: false,
          items: [
            { text: '阿里', link: '/interviews/alibaba' },
            { text: '蚂蚁集团', link: '/interviews/ant' },
            { text: '腾讯', link: '/interviews/tencent' },
            { text: '字节跳动', link: '/interviews/bytedance' },
            { text: '百度', link: '/interviews/baidu' },
            { text: '华为', link: '/interviews/huawei' },
            { text: '京东', link: '/interviews/jd' },
            { text: '美团', link: '/interviews/meituan' },
            { text: '小米', link: '/interviews/xiaomi' },
            { text: '快手', link: '/interviews/kuaishou' },
            { text: '拼多多', link: '/interviews/pdd' },
            { text: '网易', link: '/interviews/netease' },
            { text: '滴滴', link: '/interviews/didi' },
            { text: '得物', link: '/interviews/dewu' },
            { text: 'BIGO', link: '/interviews/bigo' },
            { text: 'Shopee', link: '/interviews/shopee' },
            { text: '中兴', link: '/interviews/zte' },
            { text: '作业帮', link: '/interviews/zuoyebang' },
            { text: '广联达', link: '/interviews/glodon' },
            { text: '招银网络', link: '/interviews/cmbw' },
            { text: '海康威视', link: '/interviews/hikvision' },
            { text: '深信服', link: '/interviews/sangfor' },
            { text: '瓜子二手车', link: '/interviews/guazi' },
            { text: '贝壳', link: '/interviews/beike' },
            { text: '途家', link: '/interviews/tujia' },
            { text: '金山', link: '/interviews/kingsoft' },
            { text: '顺丰', link: '/interviews/sf' },
            { text: '其他公司', link: '/interviews/others' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/A-Duang/WeDuang' }
    ],

    footer: {
      message: 'Powered by VitePress',
      copyright: `© ${new Date().getFullYear()} 阿Duang`
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '下一篇', next: '下一篇' },
    lastUpdatedText: '最后更新',
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '无匹配结果',
            resetButtonTitle: '清除',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    }
  }
})

/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //主界面等
    'Congratulations! You have reached the point of singularity and beaten this game, but for now...': '恭喜！您已经到达了奇点，暂时您可以认为自己已经通关了……',
    'In case you haven\'t noticed, there will be more content after this. You can keep continuing. but the game has been paused, since singularity was meant to be a forced prestige layer.': '希望您明白，不出意外的话，这后面还会有其他内容。您当然可以接着继续玩，但目前来说进度不会有太大提升了，因为奇点本意就是这个。',
    'Play Again': '从头再来',
    'Keep Going': '继续游戏',
    'Game Changelog': '游戏更新日志',
    'Discord servers': 'Discord频道',
    'Hotkeys': '快捷键',
    'Achievements': '成就',
    'Unfortunately, this world does not have any achievements.': '很遗憾，世界上暂时还没有任何成就。',
    'Current endgame': '目前的最终阶段',
    'The Singularity': '奇点',
    'Statistics': '统计数据',
    'Layer Breakdown': '层级明细',
    'Layer / Resource': '层级/资源',
    'Amount': '数量',
    'Best': '最高值',
    'Total': '总量',
    //主界面等结束


    //选项
    'Saving': '保存',
    'Instant save': '立刻保存',
    'Autosave: ENABLED': '自动保存：启用',
    'Autosave: DISABLED': '自动保存：禁用',
    'Export save to clipboard': '导出存档到剪贴板',
    'Import save': '导入存档',
    'HARD RESET THE GAME': '硬重置游戏',
    'Gameplay': '游戏体验',
    'Offline Production: ENABLED': '离线产量：启用',
    'Offline Production: DISABLED': '离线产量：禁用',
    'Display': '显示',
    'Tree Quality: QUALITY': '树的显示效果：美观',
    'Tree Quality: PERFORMANCE': '树的显示效果：流畅',
    'Option Tab Flavor: CLASSIC': '选项界面偏好：传统',
    'Option Tab Flavor: REMADE': '选项界面偏好：重制',
    'Tree Menu Flavor: CLASSIC': '树的菜单偏好：传统',
    'Tree Menu Flavor: TOPBAR': '树的菜单偏好：顶部',
    'Save': '保存',
    'Autosave: ON': '自动保存：开启',
    'Autosave: OFF': '自动保存：关闭',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪贴板',
    'Import': '导入',
    'Offline Prod: ON': '离线产量：开启',
    'Offline Prod: OFF': '离线产量：关闭',
    'High-Quality Tree: ON': '增强树的显示效果：开启',
    'High-Quality Tree: OFF': '增强树的显示效果：关闭',
    //选项结束

    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    "+": "+",
    ": ": "： ",
    "\n\t\t\t": "",
    "\t": "",
    "  ": "",
    "   ": "",
    "    ": "",
    "     ": "",
    "      ": "",
    "       ": "",
    "        ": "",
    "         ": "",
    "          ": "",
    "           ": "",
    "            ": "",
    "             ": "",
    "              ": "",
    "               ": "",
    "                ": "",
    "                 ": "",
    "                  ": "",
    "                   ": "",
    "                    ": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    "/s)": "/s)",
    ")": ")",
    "%": "%",
    "\n\t\t": "",
    "\n\t\t\t": "",
    "\n\t\t\t\t": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    "\n": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*\-?$/, //12.34e+4
    /^\s*$/, //纯空格
    /^(.*)\{(.+)\}(.*)$/, //不抓取内容
    /^(.*)了(.*)$/, //不抓取内容
    /^(.*)的(.*)$/, //不抓取内容
    /^(.*)地(.*)$/, //不抓取内容
    /^(.*)得(.*)$/, //不抓取内容
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^(.d+)Just make up for the space(\d+)$/, '纯举例用意'],
]);
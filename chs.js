7/*

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
    '🏆 Achievements': '🏆 成就',
    '📊 Statistics': '📊 统计数据',
    '⚙️ Options': '⚙️ 选项',
    'You have ': '您拥有 ',
    'The point of singularity has been reached. Your civilization did not make it through.': '奇点已至。您的文明并没有例外，同样无法通过。',
    'Close': '关闭',
    'Finish': '点此完成',
    'Exit Early': '提前退出',
    'Completed': '已完成',
    'Start': '点此开始',
    'Reset for ': '重置以获得 ',
    'Respec': '洗点',
    //主界面等结束


    //层级1
    ' coins': ' 金币',
    'Boosts points generation based on your total coin count.': '根据金币总数，增加点数产量。',
    'Boosts the previous upgrade based on your best coin count.': '根据金币最高值，增加前一个升级的效果。',
    'Boosts the previous upgrade based on your current coin count.': '根据金币目前数量，增加前一个升级的效果。',
    'Boosts all boost upgrades above based on your current point count.': '根据点数目前数量，增加之前的“增加”升级效果。',
    'Boosts the previous upgrade based on your coins gain on coin reset.': '根据金币重置可获得的金币数量，增加前一个升级的效果。',
    'The point generation upgrade also gets boosted by the “all previous boost upgrades” upgrade.': '产生点数的升级也受到“使之前的‘增加’升级效果更好”的升级影响。',
    'Boosts coins gain on coin reset (unaffected by the “all previous boost upgrades” upgrades).': '增加金币重置时的金币获取量(不受“使之前的‘增加’升级效果更好”的升级影响)。',
    'Boosts all boost upgrades and point production above based on your best worker count.': '根据工人最高值，增加之前的“增加”升级和产生点数的升级效果。',
    'Boosts coins gain on coin reset based on point generation speed.': '根据点数产量，增加金币重置时的金币获取量。',
    'The two previous “all previous boost upgrades” upgrades are applied once more to point production.': '之前两个“使之前的‘增加’升级效果更好”的升级再对点数产量生效一次。',
    'Boosts the above upgrade based on the two previous “all previous boost upgrades” upgrades.': '根据之前两个“使之前的‘增加’升级效果更好”的升级效果，增加上方升级的效果。',
    'Boosts all boost upgrades above (again) based on your point production speed.': '根据点数产量，再次增加之前的“增加”升级效果。',
    'Alright this is getting boring. Boosts the previous upgrade by itself.': '这么下去没创意了。这样吧，使前一个升级的效果增加它自己的数值。',
    'Same as the previous upgrade, but the boost is cube rooted.': '与前一个升级效果类似，但效果为它自己的立方根。',
    'Same as the previous upgrade. That\'s literally all you need to know.': '与前一个升级效果类似。您知道的太多了。',
    'Boosts all boost upgrades above (yet again) based on your current workfinder count.': '根据工作中介的数量，又一次增加之前的“增加”升级效果。',
    'Boosts the previous upgrade based on point generation speed.': '根据点数产量，增加前一个升级的效果。',
    'Boosts the previous upgrade based on finished work count.': '根据已完成的工作数量，增加前一个升级的效果。',
    'Raises all left upgrades to the power of ^1.02.': '左边的所有升级效果变为原来的^1.02。',
    'Boost all boost upgrades on the fifth row based on unfinished work.': '根据未完成的工作数量，增加第五行所有“增加”升级的效果。',
    'Boost all boost upgrades on the fifth row based on finished work.': '根据已完成的工作数量，增加第五行所有“增加”升级的效果。',
    'Boost all boost upgrades on the fifth row based on bankings\' effects.': '根据银行的效果，增加第五行所有“增加”升级的效果。',
    'Boost all left upgrades based on current bank count.': '根据银行目前数量，增加左边的所有升级效果。',
    'C: Reset for coins': '快捷键C：金币重置',
    //层级1结束


    //层级2
    ' workfinders': ' 工作中介',
    'Increase workers\' strength': '增加工人的力量',
    'Increase workers\' dexterity': '增加工人的敏捷',
    'Increase workers\' collaborativeness': '增加工人的协同能力',
    'Promote workfinders to part-time workers': '让工作中介也来兼职',
    'Increase work quality': '增加工作的质量',
    'Increase work planning skills': '提升工作规划的技能',
    'Unlock a new row of coin upgrades because why not?': '解锁一行新的金币升级。原因？何乐不为呢？',
    'Finish work faster based on unfinished work count.': '根据未完成的工作数量，增加完成工作的速度。',
    'Finish work faster based on finshed work\'s effect.': '根据已完成的工作效果，增加完成工作的速度。',
    'Find work faster based on finshed work count.': '根据已完成的工作数量，增加找到工作的速度。',
    'Find work faster based on current workfinder count.': '根据目前的工作中介数量，增加找到工作的速度。',
    'Multiplier to finished work\'s effect based on unfinished work\'s effect.': '根据未完成的工作效果，使已完成的工作效果乘上一个倍率。',
    'Power to unfinished work\'s effect based on finished work\'s effect.': '根据已完成的工作效果，使未完成的工作效果变为原来的一个指数。',
    'Finish work 10 times faster. Are you happy now?': '完成工作的速度变为原来的10倍。您开心了吗？',
    'Find work 5 times faster. With yin there are yang.': '找到工作的速度变为原来的5倍。阴阳相生，道法自然。',
    'Find work 3 more times faster.': '找到工作的速度再度变为原来的3倍。',
    'Guys this is it. A new prestige layer.': '兄弟们，就是这样。新的转生层级来了。',
    'Rebuyables': '重复购买项',
    'Upgrades': '升级',
    'Hire ': '雇佣 ',
    //层级2结束


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
    'Theme: DEFAULT': '显示主题：默认',
    'Theme: AQUA': '显示主题：海洋',
    'Show Milestones: ALWAYS': '显示里程碑：总是',
    'Show Milestones: AUTOMATION': '显示里程碑：自动',
    'Show Milestones: INCOMPLETE': '显示里程碑：未完成的',
    'Show Milestones: NEVER': '显示里程碑：永不',
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
    'Theme: Default': '显示主题：默认',
    'Theme: Aqua': '显示主题：海洋',
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
    /^(.*)\d{1,2}(\.\d+)?e(\+?\d+)?(.*)$/, //不抓取内容
    /^(.*)\{(.+)\}(.*)$/, //不抓取内容
    /^(.*)\\t\\t(.*)$/, //不抓取内容
    /^(.*)了(.*)$/, //不抓取内容
    /^(.*)的(.*)$/, //不抓取内容
    /^(.*)地(.*)$/, //不抓取内容
    /^(.*)得(.*)$/, //不抓取内容
    /^花费(.*)$/, //不抓取内容
    /^(.*)\d{1,3}(\.\,\d+)+(.*)$/, //不抓取内容
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
    /秒$/, //不抓取时间
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^(.d+)Just make up for the space(\d+)$/, '纯举例用意'],
]);
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
    'Boost all boost upgrades on the fifth row based on bankings\' effects.': '根据银行业务的效果，增加第五行所有“增加”升级的效果。',
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
    'F: Hire workfinders': '快捷键F：雇佣工作中介',
    ' banks': ' 银行',
    'Please disable the current active banking before you can activate another one.': '请在激活此项业务之前先取消正在进行中的业务。',
    'You need to build at least 2 banks before you can use this function.': '至少建造2个银行后才可以开始使用此项业务。',
    'You need to build at least 4 banks before you can use this function.': '至少建造4个银行后才可以开始使用此项业务。',
    'You need to build at least 6 banks before you can use this function.': '至少建造6个银行后才可以开始使用此项业务。',
    'You need to build at least 12 banks before you can use this function.': '至少建造12个银行后才可以开始使用此项业务。',
    'You need to build at least 15 banks before you can use this function.': '至少建造15个银行后才可以开始使用此项业务。',
    'You need to build at least 19 banks before you can use this function.': '至少建造19个银行后才可以开始使用此项业务。',
    'You need to build at least 60 banks before you can use this function.': '至少建造60个银行后才可以开始使用此项业务。',
    'You need to build at least 80 banks before you can use this function.': '至少建造80个银行后才可以开始使用此项业务。',
    'You need to build at least 125 banks before you can use this function.': '至少建造125个银行后才可以开始使用此项业务。',
    'Build ': '建造 ',
    'Bankings': '银行业务',
    'Note: Enabling/Disabling bankings will force a bank reset.': '注意：激活或者取消银行业务后将强制进行一次银行重置。',
    'B: Build banks': '快捷键B：建造银行',
    ' spiritual power': ' 魂灵能量',
    'Convert spiritual power into castable magic fountain': '将魂灵能量转化为流动的魔力源泉',
    'Extend the fabric of time using spiritual power': '使用魂灵能量延展时间的结构',
    'Use spiritual power to enchant basic spells': '使用魂灵能量强化基础的魔咒',
    'Use spiritual power to power magic in advanced spells': '使用魂灵能量控制高级魔咒的魔力',
    'Spell of Generation': '产量魔咒',
    'Spell of Goldilocks': '金凤花魔咒',
    'Spell of Haste': '急速魔咒',
    'Spell of Fortune': '财富魔咒',
    'Spell of Skills': '技巧魔咒',
    'Spell of Spirits': '魂灵魔咒',
    'Spell of Spells': '咒之魔咒',
    'Spell of Savings': '储蓄魔咒',
    'Spell of “Strongetivity”': '“强化”魔咒',
    'Spell of Unsoftcappers': '界限突破魔咒',
    'Spells': '魔咒',
    'S: Reset for spiritual power': '快捷键S：魂灵能量重置',
    //层级2结束


    //层级3
    ' workers': ' 工人',
    '1 Worker': '1名工人',
    '2 Workers': '2名工人',
    '3 Workers': '3名工人',
    '4 Workers': '4名工人',
    '5 Workers': '5名工人',
    '6 Workers': '6名工人',
    '7 Workers': '7名工人',
    '8 Workers': '8名工人',
    '9 Workers': '9名工人',
    '12 Workers': '12名工人',
    '13 Workers': '13名工人',
    '16 Workers': '16名工人',
    'The “Promote workfinders to part-time workers” rebuyable upgrade is 5× stronger.': '让工作中介也来兼职”的重复购买项升级效果变为5倍。',
    'Unlocks workfinders and working, where workers can do their work. They are reseted on worker reset.': '解锁工作中介和工作，工人们可以进行工作。这些在工人重置时进度重置。',
    'Unlocks more worker upgrades, may or may not related to the workfinder layer.': '解锁更多的工人升级，有些跟工作中介层级有关，有些跟工作中介层级无关。',
    'Hiring workfinders no longer resets anything.': '雇佣工作中介不再重置任何东西。',
    'Unlocks banks, which you can manage bankings. They are reseted on worker reset too.': '解锁银行，可以在那里管理业务。这些也在工人重置时进度重置。',
    'Unlocks more worker upgrades. And you can bulk hire workers now. Why didn\'t I think of this earlier...': '解锁更多的工人升级。现在您可以批量雇佣工人了。怎么到现在才想起来这个……',
    'The first three banking buffs are 25× stronger.': '前三个银行业务效果变为25倍。',
    'You can bulk build banks.': '您可以批量建造银行了。',
    'Unlocks new banking options. Also the workers\' effect gets cubed.': '解锁新的银行业务选项。另外，工人的效果变为原来的立方。',
    'The workers\' effect gets cubed again. Yay!': '工人的效果再度变为原来的立方。耶！',
    'Raises all of the first three coin layer\'s “all previous boost upgrades” upgrades based on your best worker count.': '根据工人最高值，使金币层级前三个“使之前的‘增加’升级效果更好”的升级效果变得更好。',
    'The previous upgrade also affect the first coin layer\'s boost upgrade but with reduced effect.': '前一个升级对金币层级第一个“增加”升级的效果也生效，但效果减弱。',
    'Remember that upgrade that applies something again to the point prodution? Why not keep doing that again, shall we?': '还记得某个可以再对点数产量生效一次的金币升级吗？我们再把那个升级来一次吧。',
    'The current worker count also contibutes to the first upgrade\'s formula.': '目前的工人数量也能影响第一个升级的公式。',
    'Unlock more coin upgrades. Yay.': '解锁更多的金币升级。耶。',
    'Worker\'s effect is scaled better. ((x+1)^2 => (x+2)^': '工人的效果成长得更快。(从 (x+1)^2 变为 (x+2)^',
    'You gain 10% of your current coins gain on coin reset per second.': '每秒获得金币重置时的金币获取量10%的金币。',
    'Boosts finished work and unfinished work gain based on current coin count.': '根据目前的金币数量，增加已完成和未完成的工作获取量。',
    'Find and finish work 2× faster.': '找到和完成工作的速度变为2倍。',
    'Unlocks the ability to bulk hire workfinders.': '解锁批量雇佣工作中介的功能。',
    'Boosts finished work and unfinished work gain based on current point count.': '根据目前的点数，增加已完成和未完成的工作获取量。',
    'The first three banking buffs are stronger based on workers.': '根据工人数量，前三个银行业务的效果变得更好。',
    'Milestones': '里程碑',
    'W: Hire workers': '快捷键W：雇佣工人',
    //层级3结束


    //层级4
    ' managers': ' 经理',
    'Click on a tile in the map to see its details. Drag the tiles on the map to see more of it.': '点击地图上的方格可以查看它的详情，拖动方格可以查看更多。',
    '1 Manager': '1名经理',
    '2 Managers': '2名经理',
    '3 Managers': '3名经理',
    '4 Managers': '4名经理',
    '5 Managers': '5名经理',
    '6 Managers': '6名经理',
    '7 Managers': '7名经理',
    '8 Managers': '8名经理',
    '10 Managers': '10名经理',
    'Not available yet': '暂不可用',
    'Unlocks builders, which can build structures to boost your production.': '解锁建造者，可以建造建筑来提升产量。',
    'Hiring workers no longer resets anything and you can choose to automate finding workers. Also you unlock a new structure.': '雇佣工人不再重置任何东西，您可以自动找到工人。同时解锁一个新建筑。',
    'You can choose to automate finding workfinders. Also you unlock an another new structure. This one might be hard.': '您可以自动找到工作中介。同时解锁一个新建筑。这个可能会有点难。',
    'Unlocks an another new structure. This one is probably easier.': '解锁一个新建筑。这个应该会容易不少。',
    'Each banking produces the banking before it. This will boost your builders\' speed by a lot. You\'ll still need to manually do bankings sometimes though.': '每个银行业务都可以产生它之前的银行业务。这将使建造者的速度提升很多。不过您还是需要手动操作银行业务的。',
    'Unlocks an another new structure. This one is very important.': '解锁一个新建筑。这个很重要。',
    'Unlocks an another new structure. This one is also important.': '解锁一个新建筑。这个也很重要。',
    'Managers now have the ability to manage jobs and lands.': '经理可以管理工作和土地。',
    'To be continued...': '未完待续……',
    'Respec Land & Jobs Allocation': '洗点土地和工作的分配',
    'Farmlands': '农田',
    'Sheep Farm': '绵羊牧场',
    'Mine': '矿井',
    'Large Mine': '大型矿井',
    'Wood Workshop': '木作坊',
    'Large Wood Workshop': '大型木作坊',
    'Savanna Transportation': '荒原运输',
    'Desert Transportation': '沙漠运输',
    'Fish Farm': '养鱼场',
    'Ice Farm': '冰之农场',
    'Land & Jobs Management': '土地与工作管理',
    'Each manager gives 2 managing power.': '每个经理提供2点管理权力。',
    'M: Hire managers': '快捷键M：雇佣经理',
    'You can not build more than one structure at once.': '您同时只能建造一个建筑。',
    'You can adjust the allocated builders using the slider above.': '您可以通过上方的滑块来调整分配的建造者数量。',
    'Structures': '建筑列表',
    'Note: Starting building structures will force a builder reset.': '注意：开始建造建筑后将强制进行一次建造者重置。',
    'You\'ll unlock more structures as you get more managers.': '获得更多经理以后您可以解锁更多建筑。',
    'D: Hire builders': '快捷键D：雇佣建造者',
    //层级4结束


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
    /^(.*)了(.*)$/, //不抓取内容
    /^(.*)的(.*)$/, //不抓取内容
    /^(.*)地(.*)$/, //不抓取内容
    /^(.*)得(.*)$/, //不抓取内容
    /^花费(.*)$/, //不抓取内容
    /^离线时间(.*)$/, //不抓取内容
    /^每秒产生(.*)$/, //不抓取内容
    /^魔咒持续时间(.*)$/, //不抓取内容
    /^您最高拥有(.*)$/, //不抓取内容
    /^施法花费(.*)$/, //不抓取内容
    /^世界(.*)$/, //不抓取内容
    /^需要(.*)$/, //不抓取内容
    /^预计完成时间(.*)$/, //不抓取内容
    /^(.*)\d{1,3}(\,\d+)+(.*)$/, //不抓取内容
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
/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //主界面等：
    'Congratulations! You have reached the point of singularity and beaten this game, but for now...': '恭喜！您已经到达了奇点，暂时您可以认为自己已经通关了……',
    'In case you haven\'t noticed, there will be more content after this. You can keep continuing. but the game has been paused, since singularity was meant to be a forced prestige layer.': '希望您明白，不出意外的话，这后面还会有其他内容。您当然可以接着继续玩，但目前来说进度不会有太大提升了，因为奇点本意就是这个。',
    'Play Again': '从头再来',
    'Keep Going': '继续游戏',


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
    " ": " ",
    ": ": "： ",
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
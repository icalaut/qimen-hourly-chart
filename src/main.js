const PALACES = [
  { number: '4', name: '巽宫', direction: '东南' },
  { number: '9', name: '离宫', direction: '南' },
  { number: '2', name: '坤宫', direction: '西南' },
  { number: '3', name: '震宫', direction: '东' },
  { number: '5', name: '中宫', direction: '中' },
  { number: '7', name: '兑宫', direction: '西' },
  { number: '8', name: '艮宫', direction: '东北' },
  { number: '1', name: '坎宫', direction: '北' },
  { number: '6', name: '乾宫', direction: '西北' },
];
const DOOR_ELEMENTS = { 休: 'water', 死: 'earth', 伤: 'wood', 杜: 'wood', 开: 'metal', 惊: 'metal', 生: 'earth', 景: 'fire' };
const STEM_ELEMENTS = { 甲: 'wood', 乙: 'wood', 丙: 'fire', 丁: 'fire', 戊: 'earth', 己: 'earth', 庚: 'metal', 辛: 'metal', 壬: 'water', 癸: 'water' };
const STAR_ELEMENTS = { 蓬: 'water', 任: 'earth', 冲: 'wood', 辅: 'wood', 英: 'fire', 芮: 'earth', 禽: 'earth', 柱: 'metal', 心: 'metal' };
const PALACE_ELEMENTS = { 1: 'water', 2: 'earth', 3: 'wood', 4: 'wood', 5: 'earth', 6: 'metal', 7: 'metal', 8: 'earth', 9: 'fire' };
const ELEMENT_GLYPHS = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
const ELEMENT_GENERATES = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
const ELEMENT_CONTROLS = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };
const PALACE_HIDDEN_BRANCHES = { 1: ['子'], 2: ['未', '申'], 3: ['卯'], 4: ['辰', '巳'], 5: ['未', '申'], 6: ['戌', '亥'], 7: ['酉'], 8: ['丑', '寅'], 9: ['午'] };
const TWELVE_STAGE_BRANCHES = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];
const STEM_LONGEVITY_STARTS = { 甲: '亥', 乙: '午', 丙: '寅', 丁: '酉', 戊: '寅', 己: '酉', 庚: '巳', 辛: '子', 壬: '申', 癸: '卯' };
const YANG_STEMS = new Set(['甲', '丙', '戊', '庚', '壬']);
const STEM_MATCH_LABELS = {
  hour: '時柱天干',
  day: '日柱天干',
  'hour-xun': '時柱旬首符首',
  'day-xun': '日柱旬首符首',
};

const BRANCHES = [
  ['子', 0], ['丑', 1], ['寅', 3], ['卯', 5], ['辰', 7], ['巳', 9],
  ['午', 11], ['未', 13], ['申', 15], ['酉', 17], ['戌', 19], ['亥', 21],
];
const DEFAULT_JU_METHOD = '符頭';
const DEFAULT_ZI_METHOD = '次日';

const dateInput = document.querySelector('#chart-date');
const monthInput = document.querySelector('#chart-month');
const yearInput = document.querySelector('#chart-year');
const hourInput = document.querySelector('#chart-hour');
const chartTypeInput = document.querySelector('#chart-type');
const predictionTopicInput = document.querySelector('#prediction-topic');
const predictionDirectionInput = document.querySelector('#prediction-direction');
const predictionPersonStemInput = document.querySelector('#prediction-person-stem');
const travelInput = document.querySelector('#travel-toggle');
const personalThreeVictoryInput = document.querySelector('#personal-three-victory-toggle');
const eightGodInput = document.querySelector('#eight-god-toggle');
const travelMonthInput = document.querySelector('#travel-month');
const eightGodTargetInput = document.querySelector('#eight-god-target');
const eightGodMonthInput = document.querySelector('#eight-god-month');
const shiftInput = document.querySelector('#shift-toggle');
const shiftStepsInput = document.querySelector('#shift-steps');
const previousShiftButton = document.querySelector('#previous-shift-button');
const nextShiftButton = document.querySelector('#next-shift-button');
const form = document.querySelector('#chart-form');
const result = document.querySelector('#result');
const emptyState = document.querySelector('#empty-state');
const errorMessage = document.querySelector('#error-message');
const engineStatus = document.querySelector('#engine-status');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
const TRADITIONAL_TO_SIMPLIFIED = {
  陰: '阴', 陽: '阳', 補: '补', 頭: '头', 節: '节', 氣: '气', 時: '时', 門: '门',
  輔: '辅', 騰: '腾', 沖: '冲', 傷: '伤', 驚: '惊', 離: '离', 兌: '兑', 宮: '宫', 開: '开', 儀: '仪', 擊: '击',
};
const LAYER_ENGINE_URL = 'https://esm.sh/bigfishmarquis-qimen@1.0.0/src/engine.ts?bundle';
const LUNAR_ENGINE_URL = 'https://esm.sh/lunar-javascript@1.7.7?bundle';
const OPENCC_URL = 'https://esm.sh/opencc-js@1.4.2/cn2t';
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const CYCLE_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GANZHI_CYCLE = Array.from({ length: 60 }, (_, index) => `${STEMS[index % 10]}${CYCLE_BRANCHES[index % 12]}`);
const LUO_SHU_FLIGHT_ORDER = [4, 8, 5, 6, 1, 7, 2, 3, 0];
const FLYING_STAR_NAMES = ['', '一白', '二黑', '三碧', '四綠', '五黃', '六白', '七赤', '八白', '九紫'];
const CIRCLED_FLYING_STAR_NUMBERS = new Set([1, 9, 8, 6]);
const HEXAGRAM_TRIGRAM_ORDER = ['坤', '艮', '坎', '巽', '震', '离', '兑', '乾'];
const HEXAGRAM_TRIGRAM_BY_NUMBER = { 1: '乾', 2: '兑', 3: '离', 4: '震', 5: '巽', 6: '坎', 7: '艮', 8: '坤' };
const HEXAGRAM_TRIGRAM_LINES = { 乾: '111', 兑: '110', 离: '101', 震: '100', 巽: '011', 坎: '010', 艮: '001', 坤: '000' };
const HEXAGRAM_NUMBER_BY_LINES = Object.fromEntries(Object.entries(HEXAGRAM_TRIGRAM_LINES).map(([trigram, lines]) => [lines, trigram]));
const HEXAGRAM_NAMES = [
  ['坤为地', '山地剥', '水地比', '风地观', '雷地豫', '火地晋', '泽地萃', '天地否'],
  ['地山谦', '艮为山', '水山蹇', '风山渐', '雷山小过', '火山旅', '泽山咸', '天山遯'],
  ['地水师', '山水蒙', '坎为水', '风水涣', '雷水解', '火水未济', '泽水困', '天水讼'],
  ['地风升', '山风蛊', '水风井', '巽为风', '雷风恒', '火风鼎', '泽风大过', '天风姤'],
  ['地雷复', '山雷颐', '水雷屯', '风雷益', '震为雷', '火雷噬嗑', '泽雷随', '天雷无妄'],
  ['地火明夷', '山火贲', '水火既济', '风火家人', '雷火丰', '离为火', '泽火革', '天火同人'],
  ['地泽临', '山泽损', '水泽节', '风泽中孚', '雷泽归妹', '火泽睽', '兑为泽', '天泽履'],
  ['地天泰', '山天大畜', '水天需', '风天小畜', '雷天大壮', '火天大有', '泽天夬', '乾为天'],
];
const NINE_STAR_TRIGRAM_NUMBERS = { 天心: 1, 天柱: 2, 天英: 3, 天冲: 4, 天辅: 5, 天蓬: 6, 天任: 7, 天芮: 8 };
const EIGHT_DOOR_TRIGRAM_NUMBERS = { 开门: 1, 惊门: 2, 景门: 3, 伤门: 4, 杜门: 5, 休门: 6, 生门: 7, 死门: 8 };
const DAY_STAR_ANCHORS = [
  { term: '冬至', center: 1, direction: 1 },
  { term: '雨水', center: 7, direction: 1 },
  { term: '谷雨', center: 4, direction: 1 },
  { term: '夏至', center: 9, direction: -1 },
  { term: '处暑', center: 3, direction: -1 },
  { term: '霜降', center: 6, direction: -1 },
];
const DAY_BRANCH_GROUPS = {
  子午卯酉: new Set(['子', '午', '卯', '酉']),
  辰戌丑未: new Set(['辰', '戌', '丑', '未']),
  寅申巳亥: new Set(['寅', '申', '巳', '亥']),
};
const XUN_FU_SHOU = { 甲子: '戊', 甲戌: '己', 甲申: '庚', 甲午: '辛', 甲辰: '壬', 甲寅: '癸' };
const PALACE_NAMES = { 1: '坎', 2: '坤', 3: '震', 4: '巽', 5: '中', 6: '乾', 7: '兑', 8: '艮', 9: '离' };
const SHIFT_RING = [7, 6, 3, 0, 1, 2, 5, 8];
const SEVEN_STAR_WALK_PATHS = {
  东: [[98, 42], [98, 72], [67, 72], [67, 42], [45, 42], [21, 42], [0, 42]],
  东南: [[83, 82], [67, 100], [34, 76], [50, 58], [34, 42], [17, 24], [0, 0]],
  南: [[64, 85], [31, 85], [33, 56], [64, 56], [65, 38], [65, 18], [68, 0]],
  西南: [[15, 82], [0, 66], [33, 33], [50, 50], [66, 33], [83, 16], [100, 0]],
  西: [[5, 63], [5, 30], [34, 30], [34, 63], [54, 63], [77, 63], [100, 63]],
  西北: [[14, 17], [30, 0], [64, 32], [47, 48], [64, 66], [80, 84], [98, 100]],
  北: [[33, 0], [69, 0], [69, 30], [33, 30], [33, 52], [33, 76], [30, 98]],
  东北: [[82, 16], [98, 32], [64, 66], [48, 50], [28, 66], [11, 84], [-5, 100]],
};
const VOID_BRANCH_PALACES = { 子: 1, 丑: 8, 寅: 8, 卯: 3, 辰: 4, 巳: 4, 午: 9, 未: 2, 申: 2, 酉: 7, 戌: 6, 亥: 6 };
const DAY_STEM_AUSPICIOUS_MARKERS = {
  甲: { joyPalace: 8, wealthPalace: 8, nobleBranches: ['丑', '未'] },
  乙: { joyPalace: 6, wealthPalace: 8, nobleBranches: ['子', '申'] },
  丙: { joyPalace: 2, wealthPalace: 2, nobleBranches: ['亥', '酉'] },
  丁: { joyPalace: 9, wealthPalace: 2, nobleBranches: ['亥', '酉'] },
  戊: { joyPalace: 4, wealthPalace: 1, nobleBranches: ['丑', '未'] },
  己: { joyPalace: 8, wealthPalace: 1, nobleBranches: ['子', '申'] },
  庚: { joyPalace: 6, wealthPalace: 3, nobleBranches: ['丑', '未'] },
  辛: { joyPalace: 2, wealthPalace: 3, nobleBranches: ['寅', '午'] },
  壬: { joyPalace: 9, wealthPalace: 9, nobleBranches: ['卯', '巳'] },
  癸: { joyPalace: 4, wealthPalace: 9, nobleBranches: ['卯', '巳'] },
};
const YIMA_BRANCHES = {
  子: '寅', 辰: '寅', 申: '寅',
  寅: '申', 午: '申', 戌: '申',
  巳: '亥', 酉: '亥', 丑: '亥',
  亥: '巳', 卯: '巳', 未: '巳',
};

function getBaziDayPillar(chart) {
  return simplify(chart?.八字日柱 || chart?.日柱);
}

function getBaziYimaBranch(chart) {
  const dayBranch = getBaziDayPillar(chart)?.slice(-1);
  return YIMA_BRANCHES[dayBranch];
}
const OVERALL_PATTERN_NAMES = new Set(['反吟', '伏吟', '五不遇時', '截路空亡']);
const TIME_ONLY_PATTERN_NAMES = new Set(['五不遇時', '截路空亡']);
const STAR_HOME_POSITIONS = { 天蓬: 1, 天芮: 2, 天冲: 3, 天辅: 4, 天禽: 5, 天心: 6, 天柱: 7, 天任: 8, 天英: 9 };
const DOOR_HOME_POSITIONS = { 休门: 1, 生门: 8, 伤门: 3, 杜门: 4, 景门: 9, 死门: 2, 惊门: 7, 开门: 6 };
const STEM_TOMB_PALACES = { 乙: 6, 丙: 6, 丁: 8, 戊: 6, 己: 8, 庚: 8, 辛: 4, 壬: 4, 癸: 2 };
const NINE_STARS = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];
const EIGHT_DOORS = ['休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门'];
const MODE_HINTS = {
  mingpan: '按所填出生年月日时，以时家转盘法起个人命盘。',
  nianjia: '年家盘只需输入公历年份，按该年立春起算的干支年起局；无需选择月、日与时辰。',
  yuejia: '月家盘只需选择公历月份，按该月对应的节气月起局；无需选择日期与时辰。',
  rijia: '日家盘按所选公历年月日起局；小时不参与日盘计算。',
  shijia: '时家盘按所选日期与整点时辰起局。',
};
const PREDICTION_TOPICS = {
  illness: { label: '疾病', references: [
    { symbol: '日干', role: '病人', kind: 'pillarStem', pillar: '日柱' },
    { symbol: '天芮星', role: '疾病', kind: 'layer', layer: 'star', value: '天芮' },
    ...['生门', '死门', '伤门'].map((value) => ({ symbol: value, role: '病势与治疗/预后', kind: 'layer', layer: 'door', value })),
    { symbol: '天心星', role: '医生', kind: 'layer', layer: 'star', value: '天心' },
    { symbol: '天蓬星', role: '医药', kind: 'layer', layer: 'star', value: '天蓬' },
    { symbol: '乙奇', role: '医药', kind: 'stem', value: '乙' },
  ] },
  marriage: { label: '婚姻', references: [
    { symbol: '乙奇', role: '妻子', kind: 'layer', layer: 'heaven', value: '乙' },
    { symbol: '庚仪', role: '丈夫', kind: 'layer', layer: 'heaven', value: '庚' },
    { symbol: '六合', role: '婚姻关系', kind: 'layer', layer: 'god', value: '六合' },
    { symbol: '丙奇', role: '男性第三者', kind: 'layer', layer: 'heaven', value: '丙' },
    { symbol: '丁奇', role: '女性第三者', kind: 'layer', layer: 'heaven', value: '丁' },
  ] },
  finance: { label: '经济', references: [
    { symbol: '日干', role: '求测人', kind: 'pillarStem', pillar: '日柱' },
    { symbol: '时干', role: '财物', kind: 'pillarStem', pillar: '時柱' },
    { symbol: '戊', role: '资本/资金', kind: 'stem', value: '戊' },
    { symbol: '生门', role: '利润/收益', kind: 'layer', layer: 'door', value: '生门' },
    { symbol: '值符', role: '银行/贷款方', kind: 'layer', layer: 'god', value: '值符' },
    { symbol: '值使', role: '经手人/交易方', kind: 'valueDoor' },
  ] },
  birth: { label: '胎孕 / 生育', references: [
    { symbol: '天芮星', role: '孕妇', kind: 'layer', layer: 'star', value: '天芮' },
    { symbol: '坤二宫', role: '产室', kind: 'palace', palaceNumber: 2 },
    { symbol: '坤二宫九星', role: '胎儿', kind: 'layerAtPalace', layer: 'star', palaceNumber: 2 },
  ] },
  newPostPlace: { label: '新任地方安否', references: [
    { symbol: '天蓬星', role: '远近、内外安否', kind: 'layer', layer: 'star', value: '天蓬' },
  ] },
  newOfficial: { label: '新任官吉凶', references: NINE_STARS.map((value) => ({
    symbol: `${value}星`, role: '按星落宫参考', kind: 'layer', layer: 'star', value,
  })) },
  separation: { label: '分居', references: [
    ...[['年干', '年柱'], ['月干', '月柱'], ['日干', '日柱'], ['时干', '時柱']].map(([symbol, pillar]) => ({
      symbol, role: '干支落宫参考', kind: 'pillarStem', pillar,
    })),
  ] },
  invite: { label: '请人来否', references: [
    { symbol: '来人方向天干', role: '按所选方向取宫', kind: 'directionStem' },
    { symbol: '生门', role: '来意与应期参考', kind: 'layer', layer: 'door', value: '生门' },
  ] },
  migration: { label: '迁移', references: [
    { symbol: '迁移方向之星', role: '查看所选方向宫', kind: 'directionStar' },
  ] },
  entrust: { label: '嘱托', references: [
    { symbol: '值符', role: '受托人与主事参考', kind: 'layer', layer: 'god', value: '值符' },
    { symbol: '值使', role: '所托之事', kind: 'valueDoor' },
  ] },
  partnership: { label: '合伙', references: [
    { symbol: '生门宫天地盘干', role: '合伙双方生克参考', kind: 'lifeDoorPalaceStems' },
  ] },
  seekingMoney: { label: '求财', references: [
    { symbol: '戊', role: '财物', kind: 'stem', value: '戊' },
    { symbol: '生门', role: '财源', kind: 'layer', layer: 'door', value: '生门' },
    { symbol: '生门宫天地盘干', role: '上下盘格局参考', kind: 'lifeDoorPalaceStems' },
  ] },
  longevity: { label: '寿夭', references: [
    { symbol: '天冲星', role: '寿数参考；依原书比较落宫远近', kind: 'layer', layer: 'star', value: '天冲' },
    { symbol: '死门', role: '寿夭参考；依原书比较落宫远近', kind: 'layer', layer: 'door', value: '死门' },
  ] },
  release: { label: '起解', references: [
    { symbol: '值使', role: '与六辛比较生克、旺衰', kind: 'valueDoor' },
    { symbol: '六辛', role: '解疑用神；查看所临星门', kind: 'stem', value: '辛' },
    { symbol: '开门', role: '银粮参考；查看同宫凶煞', kind: 'layer', layer: 'door', value: '开门' },
    { symbol: '生门', role: '银粮参考；查看同宫凶煞', kind: 'layer', layer: 'door', value: '生门' },
    { symbol: '天蓬星', role: '原文所列凶煞参考', kind: 'layer', layer: 'star', value: '天蓬' },
    { symbol: '天柱星', role: '六辛所乘之星参考', kind: 'layer', layer: 'star', value: '天柱' },
  ] },
  prisonerRelease: { label: '解罪人', references: [
    { symbol: '当事人年命', role: '年命落宫及所乘天干', kind: 'selectedStem' },
    { symbol: '六辛', role: '查看与年命、开门的落宫关系', kind: 'stem', value: '辛' },
    { symbol: '开门', role: '依原文与六辛、年命比较生克', kind: 'layer', layer: 'door', value: '开门' },
  ] },
  mediation: { label: '和事', references: [
    { symbol: '旬首（甲子课例）', role: '按时柱旬首与遁甲六仪定位', kind: 'xunHead' },
    { symbol: '六庚', role: '书信与一方参考', kind: 'stem', value: '庚' },
    { symbol: '六丁', role: '书信迟速与一方参考', kind: 'stem', value: '丁' },
    { symbol: '六丙', role: '和解双方生克及旺衰参考', kind: 'stem', value: '丙' },
  ] },
  whoGoes: { label: '谁去谁不去', references: [
    { symbol: '年干原宫', role: '所临天盘干', kind: 'pillarStemOriginalPalace', pillar: '年柱' },
  ] },
  homeStatus: { label: '在外问家中安否', references: [
    { symbol: '日干', role: '问事人落宫及同宫星门', kind: 'pillarStemPalaceLayers', pillar: '日柱', layers: ['star', 'door'] },
  ] },
  officialMood: { label: '官长喜怒', references: [
    { symbol: '开门', role: '官长', kind: 'layer', layer: 'door', value: '开门' },
    { symbol: '时干', role: '问事人与所临星门', kind: 'pillarStemPalaceLayers', pillar: '時柱', layers: ['star', 'door'] },
  ] },
  seekingImmortal: { label: '求仙', references: [
    { symbol: '日干', role: '求问者及同宫星门', kind: 'pillarStemPalaceLayers', pillar: '日柱', layers: ['star', 'door'] },
  ] },
  yinHouse: { label: '阴宅', references: [
    ...['腾蛇', '勾陈', '玄武', '朱雀'].map((value) => ({ symbol: value, role: '阴宅四神参考', kind: 'layer', layer: 'god', value })),
  ] },
  fame: { label: '功名', references: [
    { symbol: '日干', role: '求名者', kind: 'pillarStem', pillar: '日柱' },
    ...NINE_STARS.map((value) => ({ symbol: `${value}星`, role: '星门生克参考', kind: 'layer', layer: 'star', value })),
    ...EIGHT_DOORS.map((value) => ({ symbol: value, role: '星门生克参考', kind: 'layer', layer: 'door', value })),
  ] },
  traveler: { label: '行人', references: [
    { symbol: '日干', role: '行人参考', kind: 'pillarStem', pillar: '日柱' },
    ...NINE_STARS.map((value) => ({ symbol: `${value}星`, role: '星落宫参考', kind: 'layer', layer: 'star', value })),
  ] },
  work: { label: '工作', references: [
    { symbol: '年干', role: '上级领导', kind: 'pillarStem', pillar: '年柱' },
    { symbol: '值符', role: '顶头上司', kind: 'layer', layer: 'god', value: '值符' },
    { symbol: '值使', role: '副职/职务', kind: 'valueDoor' },
    { symbol: '月干', role: '同事', kind: 'pillarStem', pillar: '月柱' },
    { symbol: '日干', role: '求测人', kind: 'pillarStem', pillar: '日柱' },
    { symbol: '时干', role: '下级/群众', kind: 'pillarStem', pillar: '時柱' },
    { symbol: '开门', role: '文职工作', kind: 'layer', layer: 'door', value: '开门' },
    { symbol: '杜门', role: '武职/技术工作', kind: 'layer', layer: 'door', value: '杜门' },
  ] },
  workVillain: { label: '工作犯小人', references: [
    { symbol: '月干', role: '当月或单位内部的人；与日干比较冲克', kind: 'pillarStem', pillar: '月柱' },
    { symbol: '时干', role: '当前事项相关的人；与日干比较冲克', kind: 'pillarStem', pillar: '時柱' },
    { symbol: '日干', role: '求测者；检查月干、时干是否冲克', kind: 'pillarStem', pillar: '日柱' },
    { symbol: '玄武', role: '暗中作梗、口舌是非参考', kind: 'layer', layer: 'god', value: '玄武' },
    { symbol: '腾蛇', role: '纠缠难脱参考', kind: 'layer', layer: 'god', value: '腾蛇' },
    { symbol: '白虎', role: '强势明面冲突参考', kind: 'layer', layer: 'god', value: '白虎' },
    { symbol: '太阴', role: '暗中行事参考', kind: 'layer', layer: 'god', value: '太阴' },
    { symbol: '六合', role: '合伙聚众为难参考', kind: 'layer', layer: 'god', value: '六合' },
  ] },
  promotionTransfer: { label: '升迁与调动', references: [
    { symbol: '日干', role: '求测者；与开门比较生克', kind: 'pillarStem', pillar: '日柱' },
    { symbol: '开门', role: '工作；克日干主调动，生日干主不易调走', kind: 'layer', layer: 'door', value: '开门' },
    { symbol: '值符', role: '主管、首领；同宫见丙为权柄参考', kind: 'layer', layer: 'god', value: '值符' },
    { symbol: '丙', role: '与值符同宫时作官运参考', kind: 'stem', value: '丙' },
    { symbol: '九天', role: '升迁机会参考', kind: 'layer', layer: 'god', value: '九天' },
    { symbol: '壬', role: '与九天、驿马同列为变动参考', kind: 'stem', value: '壬' },
    { symbol: '癸', role: '与九天、驿马同列为变动参考', kind: 'stem', value: '癸' },
    { symbol: '驿马', role: '临马星主变动；依日支定位', kind: 'yima' },
    { symbol: '伏吟／反吟', role: '伏吟主不动；反吟主变动', kind: 'patternList' },
    { symbol: '开门宫空亡', role: '若开门克日干且空亡，原文以填实之月为应期参考', kind: 'openDoorVoid' },
  ] },
  exam: { label: '考试', references: [
    { symbol: '天辅星', role: '招考办公室/辅导', kind: 'layer', layer: 'star', value: '天辅' },
    { symbol: '值符', role: '主考官', kind: 'layer', layer: 'god', value: '值符' },
    { symbol: '值使', role: '副主考官', kind: 'valueDoor' },
    { symbol: '年干', role: '学校', kind: 'pillarStem', pillar: '年柱' },
    { symbol: '景门', role: '试卷/考试内容', kind: 'layer', layer: 'door', value: '景门' },
    { symbol: '丁奇', role: '文章/答卷', kind: 'layer', layer: 'heaven', value: '丁' },
    { symbol: '日干', role: '考生', kind: 'pillarStem', pillar: '日柱' },
  ] },
  lawsuit: { label: '官司', references: [
    { symbol: '值符', role: '原告', kind: 'layer', layer: 'god', value: '值符' },
    { symbol: '天乙', role: '被告', kind: 'tianyi' },
    { symbol: '开门', role: '法官', kind: 'layer', layer: 'door', value: '开门' },
    { symbol: '惊门', role: '律师', kind: 'layer', layer: 'door', value: '惊门' },
    { symbol: '景门', role: '诉状/文书', kind: 'layer', layer: 'door', value: '景门' },
    { symbol: '丁奇', role: '传票', kind: 'layer', layer: 'heaven', value: '丁' },
    { symbol: '六合', role: '证人/证据', kind: 'layer', layer: 'god', value: '六合' },
  ] },
  travel: { label: '出行', references: [
    { symbol: '日干', role: '求测人', kind: 'pillarStem', pillar: '日柱' },
    { symbol: '景门', role: '道路', kind: 'layer', layer: 'door', value: '景门' },
    { symbol: '伤门', role: '车船/交通工具', kind: 'layer', layer: 'door', value: '伤门' },
    { symbol: '惊门', role: '水路', kind: 'layer', layer: 'door', value: '惊门' },
    { symbol: '休门', role: '水路', kind: 'layer', layer: 'door', value: '休门' },
    { symbol: '开门', role: '飞机/航空', kind: 'layer', layer: 'door', value: '开门' },
    { symbol: '九天', role: '航线/远行', kind: 'layer', layer: 'god', value: '九天' },
    { symbol: '庚', role: '障碍', kind: 'stem', value: '庚' },
  ] },
  competition: { label: '竞赛', references: [
    { symbol: '值符', role: '裁判', kind: 'layer', layer: 'god', value: '值符' },
    { symbol: '时干', role: '运动员', kind: 'pillarStem', pillar: '時柱' },
    { symbol: '景门', role: '技术指导', kind: 'layer', layer: 'door', value: '景门' },
    { symbol: '辛', role: '金牌/奖项', kind: 'stem', value: '辛' },
    { symbol: '地盘时干', role: '主队', kind: 'pillarStemLayer', pillar: '時柱', layer: 'earth' },
    { symbol: '天盘时干', role: '客队', kind: 'pillarStemLayer', pillar: '時柱', layer: 'heaven' },
  ] },
  weather: { label: '天气', references: [
    ...[['天英星', 'star', '天英'], ['九天', 'god', '九天'], ['景门', 'door', '景门'], ['丙', 'stem', '丙'], ['丁', 'stem', '丁']].map(([symbol, kind, value]) => ({ symbol, role: '晴', kind, ...(kind === 'star' || kind === 'god' || kind === 'door' ? { layer: kind } : {}), value })),
    ...[['天辅星', 'star', '天辅'], ['生门', 'door', '生门'], ['白虎', 'god', '白虎'], ['甲', 'stem', '甲'], ['乙', 'stem', '乙']].map(([symbol, kind, value]) => ({ symbol, role: '风', kind, ...(kind === 'star' || kind === 'god' || kind === 'door' ? { layer: kind } : {}), value })),
    ...[['天柱星', 'star', '天柱'], ['休门', 'door', '休门'], ['玄武', 'god', '玄武'], ['壬', 'stem', '壬'], ['癸', 'stem', '癸']].map(([symbol, kind, value]) => ({ symbol, role: '雨', kind, ...(kind === 'star' || kind === 'god' || kind === 'door' ? { layer: kind } : {}), value })),
    ...[['天任星', 'star', '天任'], ['死门', 'door', '死门'], ['太阴', 'god', '太阴'], ['戊', 'stem', '戊'], ['己', 'stem', '己']].map(([symbol, kind, value]) => ({ symbol, role: '雪', kind, ...(kind === 'star' || kind === 'god' || kind === 'door' ? { layer: kind } : {}), value })),
    ...[['天心星', 'star', '天心'], ['天柱星', 'star', '天柱'], ['辛', 'stem', '辛'], ['癸', 'stem', '癸']].map(([symbol, kind, value]) => ({ symbol, role: '霜雪', kind, ...(kind === 'star' || kind === 'god' || kind === 'door' ? { layer: kind } : {}), value })),
    ...[['天冲星', 'star', '天冲'], ['开门', 'door', '开门'], ['伤门', 'door', '伤门'], ['庚', 'stem', '庚']].map(([symbol, kind, value]) => ({ symbol, role: '雷电', kind, ...(kind === 'star' || kind === 'god' || kind === 'door' ? { layer: kind } : {}), value })),
  ] },
};
function shiftStepLabel(steps) {
  return Number(steps) === 0 ? '原位' : `顺移${steps}宫`;
}
let layerEnginePromise;
let lunarEnginePromise;
let traditionalizerPromise;
const eightGodScanCache = new Map();
let hasGeneratedNatalChart = false;
let lastRenderedChart = null;
let traditionalize = (value) => String(value ?? '—');

function pad(value) {
  return String(value).padStart(2, '0');
}

async function formatLunarDate(datetime, chart) {
  lunarEnginePromise ||= import(LUNAR_ENGINE_URL);
  const { Solar } = await lunarEnginePromise;
  const year = Number(datetime.slice(0, 4));
  const month = Number(datetime.slice(4, 6));
  const day = Number(datetime.slice(6, 8));
  const lunarDate = Solar.fromYmd(year, month, day).getLunar().toString();
  if (['年盘', '月盘'].includes(chart.盤型)) return '';
  const includesHour = ['命盘', '时盘'].includes(chart.盤型);
  const hourBranch = chart.時柱?.[1] || branchForHour(Number(datetime.slice(8, 10)));
  return traditionalize(`农历${lunarDate}日${includesHour && hourBranch ? ` · ${hourBranch}时` : ''}`);
}

async function renderStarDayGuidance(datetime, chart) {
  const section = document.querySelector('#star-day-guidance');
  const activities = document.querySelectorAll('.star-day-activities-list');
  if (!['日盘', '时盘'].includes(chart.盤型)) {
    section.hidden = true;
    activities.forEach((container) => container.replaceChildren());
    return;
  }

  const { Solar } = await lunarEnginePromise;
  const [year, month, day] = [datetime.slice(0, 4), datetime.slice(4, 6), datetime.slice(6, 8)].map(Number);
  const lunar = Solar.fromYmd(year, month, day).getLunar();
  const starName = lunar.getXiu();
  const luck = lunar.getXiuLuck();
  document.querySelector('#star-day-date').textContent = traditionalize(`农历${lunar.toString()}`);
  document.querySelector('#star-day-name').textContent = traditionalize(`${starName}宿`);
  const luckLabel = document.querySelector('#star-day-luck');
  luckLabel.textContent = traditionalize(luck || '—');
  luckLabel.dataset.luck = luck === '吉' ? '吉' : luck === '凶' ? '凶' : '平';

  [lunar.getDayYi(), lunar.getDayJi()].forEach((items, index) => {
    const container = activities[index];
    container.replaceChildren();
    if (!items?.length) {
      container.textContent = traditionalize('无');
      return;
    }
    items.forEach((item) => {
      const tag = document.createElement('span');
      tag.textContent = traditionalize(item);
      container.append(tag);
    });
  });
  section.hidden = false;
}

function simplify(value) {
  return String(value ?? '—').replace(/[陰陽補頭節氣時門輔騰沖傷驚離兌宮開儀擊]/g, (char) => TRADITIONAL_TO_SIMPLIFIED[char]);
}

function convertStaticInterface() {
  document.documentElement.lang = 'zh-TW';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement?.closest('script, style, .frame-shichen-branch')) node.nodeValue = traditionalize(node.nodeValue);
  }
  document.querySelectorAll('[aria-label], [title], [placeholder]').forEach((element) => {
    for (const attribute of ['aria-label', 'title', 'placeholder']) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, traditionalize(element.getAttribute(attribute)));
    }
  });
  document.title = traditionalize(document.title);
}

function loadTraditionalizer() {
  traditionalizerPromise ||= import(OPENCC_URL).then(({ Converter }) => {
    const convert = Converter({ from: 'cn', to: 'tw' });
    traditionalize = (value) => convert(String(value ?? '—')).replaceAll('醜時', '丑時');
    convertStaticInterface();
    updateChartTypeControls();
  }).catch((error) => {
    console.error('繁體轉換器載入失敗', error);
  });
  return traditionalizerPromise;
}

function branchForHour(hour) {
  if (hour === 23) return '子';
  const branch = BRANCHES.find(([, start], index) => {
    const end = BRANCHES[index + 1]?.[1] ?? 23;
    return hour >= start && hour < end;
  });
  return branch?.[0] ?? '子';
}

function hourLabel(hour) {
  const branch = branchForHour(hour);
  return traditionalize(`${pad(hour)}:00 · ${branch}时`);
}

function setDefaults() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date()).map(({ type, value }) => [type, value]));
  dateInput.value = `${parts.year}-${parts.month}-${parts.day}`;
  monthInput.value = `${parts.year}-${parts.month}`;
  yearInput.value = parts.year;
  hourInput.value = String(Number(parts.hour));
}

function shiftSelectedYear(yearOffset) {
  const year = Number(yearInput.value);
  if (!Number.isInteger(year)) return;
  yearInput.value = String(year + yearOffset);
  generateChart();
}

function shiftSelectedMonth(monthOffset) {
  if (!monthInput.value) return;
  const [year, month] = monthInput.value.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + monthOffset, 1));
  monthInput.value = `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}`;
  generateChart();
}

function setSelectedDateOffset(dayOffset) {
  if (!dateInput.value) return false;
  const [year, month, day] = dateInput.value.split('-').map(Number);
  const shiftedDate = new Date(Date.UTC(year, month - 1, day + dayOffset));
  dateInput.value = `${shiftedDate.getUTCFullYear()}-${pad(shiftedDate.getUTCMonth() + 1)}-${pad(shiftedDate.getUTCDate())}`;
  return true;
}

function shiftSelectedDate(dayOffset) {
  if (!setSelectedDateOffset(dayOffset)) return;
  generateChart();
}

function populateHours() {
  for (let hour = 0; hour < 24; hour += 1) {
    const option = document.createElement('option');
    option.value = String(hour);
    option.textContent = hourLabel(hour);
    hourInput.append(option);
  }
}

function makePillar(label, value) {
  const item = document.createElement('div');
  item.className = 'pillar';
  const title = document.createElement('span');
  title.className = 'pillar-label';
  title.textContent = traditionalize(label);
  const stem = document.createElement('span');
  stem.className = 'pillar-value';
  const characters = [...traditionalize(value)];
  if (characters.length === 2) {
    stem.classList.add('pillar-value-vertical');
    characters.forEach((character) => {
      const line = document.createElement('span');
      line.textContent = character;
      stem.append(line);
    });
  } else {
    stem.textContent = characters.join('');
  }
  item.append(title, stem);
  return item;
}

function formatTianYi(star, palaceNumber) {
  const palace = PALACES.find((item) => Number(item.number) === Number(palaceNumber));
  if (!star || !palace) return '—';
  return traditionalize(`${star} · ${palace.direction}${palace.name}`);
}

function calculateHourlyTianYi(chart) {
  const hourStem = chart['時柱']?.[0] === '甲' ? chart['符首'] : chart['時柱']?.[0];
  const earthIndex = chart['地盤']?.indexOf(hourStem) ?? -1;
  if (earthIndex < 0) return '—';

  const originalPosition = Number(PALACES[earthIndex]?.number);
  const originalStars = { 1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅', 5: '天禽', 6: '天心', 7: '天柱', 8: '天任', 9: '天英' };
  const star = originalStars[originalPosition];
  const searchStar = star === '天禽' ? '天芮' : star;
  const starIndex = chart['九星']?.findIndex((starName) => simplify(starName) === searchStar) ?? -1;
  const landedPalace = PALACES[starIndex];
  if (!star || !landedPalace) return '—';
  return `${star} · ${landedPalace.direction}${landedPalace.name}`;
}

function hasOppositeLayer(chart, field, homePositions) {
  const outerPalaces = PALACES.flatMap((palace, index) => {
    const palaceNumber = Number(palace.number);
    if (palaceNumber === 5) return [];
    return [{ palaceNumber, item: simplify(chart[field]?.[index]) }];
  });
  return outerPalaces.length === 8 && outerPalaces.every(({ palaceNumber, item }) => (
    homePositions[item] !== undefined && palaceNumber === 10 - homePositions[item]
  ));
}

function getOverallFormations(chart, includesHour = true) {
  const formations = window.Qimen.detectPatterns(chart)
    .filter((item) => item.類 === '格局'
      && (!item.宮 || OVERALL_PATTERN_NAMES.has(item.格))
      && (includesHour || !TIME_ONLY_PATTERN_NAMES.has(item.格)))
    .map((item) => OVERALL_PATTERN_NAMES.has(item.格) ? { ...item, 宮: null } : item);

  const reverseLayers = [
    hasOppositeLayer(chart, '九星', STAR_HOME_POSITIONS) && '九星',
    hasOppositeLayer(chart, '天門', DOOR_HOME_POSITIONS) && '八门',
  ].filter(Boolean);
  if (reverseLayers.length > 0) {
    const existingFanYin = formations.find((item) => item.格 === '反吟');
    const fanYin = existingFanYin || { 類: '格局', 格: '反吟', 吉凶: '凶', 宮: null };
    fanYin.宮 = null;
    fanYin.讀法 = `${reverseLayers.join('、')}反吟`;
    fanYin.細節 = `${reverseLayers.join('与')}整层均落在各自本位宫的对宫`;
    if (!existingFanYin) formations.push(fanYin);
  }

  const hasFanYin = formations.some((item) => item.格 === '反吟');
  const hasFuYin = formations.some((item) => item.格 === '伏吟');
  if (hasFanYin && hasFuYin) {
    formations.push({ 類: '格局', 格: '反吟伏吟', 吉凶: '凶', 宮: null, 細節: '本盘同时符合反吟与伏吟条件' });
  }

  const zhiShiPosition = chart['天門']?.findIndex((door) => door === chart['值使']) ?? -1;
  if (zhiShiPosition >= 0 && chart['地盤']?.[zhiShiPosition] === '丁') {
    formations.push({
      類: '格局',
      格: '玉女守门',
      讀法: '玉女时',
      吉凶: '吉',
      宮: null,
      細節: `值使门${chart['值使']}临地盘丁，玉女守门`,
    });
  }

  return formations;
}

function makeLayerChart(source, type, timeChart) {
  const config = {
    nianjia: { label: '年盘', pillar: 'year' },
    yuejia: { label: '月盘', pillar: 'month' },
    rijia: { label: '日盘', pillar: 'day' },
  }[type];
  const palaceByNumber = new Map(source.palaces.map((palace) => [palace.palaceNumber, palace]));
  const orderedPalaces = PALACES.map(({ number }) => palaceByNumber.get(Number(number)));
  const activePillar = source.fourPillars[config.pillar];
  const activeGanzhi = `${activePillar.gan || ''}${activePillar.zhi || ''}`;
  const cycleIndex = GANZHI_CYCLE.indexOf(activeGanzhi);
  if (cycleIndex < 0) throw new Error(`无法从${config.label}计算旬首：${activeGanzhi || '缺少干支'}`);

  const xunHead = GANZHI_CYCLE[Math.floor(cycleIndex / 10) * 10];
  const pillarText = (pillar) => `${pillar.gan || ''}${pillar.zhi || ''}` || '—';
  const palaceLabel = (number) => `${PALACE_NAMES[number] || ''}宫`;
  const yuan = { 上: '上元', 中: '中元', 下: '下元' }[source.yuan] || '—';

  const chart = {
    盤型: config.label,
    展示說明: `${config.label}使用对应的独立排盘算法。`,
    年柱: pillarText(source.fourPillars.year),
    月柱: pillarText(source.fourPillars.month),
    日柱: pillarText(source.fourPillars.day),
    時柱: pillarText(source.fourPillars.hour),
    時干: source.fourPillars.hour.gan || '',
    陰陽: source.dun === 'yang' ? '陽' : '陰',
    局數: source.juNumber,
    節氣: timeChart.節氣,
    三元: yuan,
    旬首: xunHead,
    符首: XUN_FU_SHOU[xunHead],
    值符: source.zhiFuStar,
    值符落宮: palaceLabel(source.zhiFuPalace),
    值使: source.zhiShiDoor,
    值使落宮: palaceLabel(source.zhiShiPalace),
    天乙: formatTianYi(source.tianYiStar, source.tianYiPalace),
    八神: orderedPalaces.map((palace) => palace?.god || '—'),
    九星: orderedPalaces.map((palace) => palace?.star || '—'),
    天門: orderedPalaces.map((palace) => palace?.door || '—'),
    天盤: orderedPalaces.map((palace) => palace?.earthStem || '—'),
    地盤: orderedPalaces.map((palace) => palace?.skyStem || '—'),
  };
  chart.格局列表 = getOverallFormations(chart, false);
  return chart;
}

async function generateFlightCharts(datetime) {
  const timeChart = window.Qimen.chartToObject(window.Qimen.generateChartByDatetime(datetime, {
    定局法: DEFAULT_JU_METHOD,
    夜子時: DEFAULT_ZI_METHOD,
  }));
  lunarEnginePromise ||= import(LUNAR_ENGINE_URL);
  const { Solar } = await lunarEnginePromise;
  const year = Number(datetime.slice(0, 4));
  const month = Number(datetime.slice(4, 6));
  const day = Number(datetime.slice(6, 8));
  const hour = Number(datetime.slice(8, 10));
  const solarYear = resolveSolarYear(year, timeChart['年柱']);
  const yearBranch = timeChart['年柱']?.[1];
  const monthBranch = timeChart['月柱']?.[1];
  const dayPillar = timeChart['日柱'] || '';
  const dayBranch = dayPillar[1];
  const hourBranch = timeChart['時柱']?.[1];
  const monthIndex = { 寅: 0, 卯: 1, 辰: 2, 巳: 3, 午: 4, 未: 5, 申: 6, 酉: 7, 戌: 8, 亥: 9, 子: 10, 丑: 11 }[monthBranch];
  const monthStart = getGroupedStar(yearBranch, { 子午卯酉: 8, 寅申巳亥: 2, 辰戌丑未: 5 });
  const daily = getDailyFlyingStar(Solar, year, month, day, dayPillar);
  const seasonalDirection = getSeasonalDirection(Solar, year, month, day, hour);
  const hourIndex = CYCLE_BRANCHES.indexOf(hourBranch);
  const hourStart = getGroupedStar(dayBranch, seasonalDirection === 1
    ? { 子午卯酉: 1, 辰戌丑未: 4, 寅申巳亥: 7 }
    : { 子午卯酉: 9, 辰戌丑未: 6, 寅申巳亥: 3 });

  if (monthIndex === undefined || hourIndex < 0) throw new Error('無法根據干支確定月或時飛星。');

  const hourChart = makeFlyingStarChart('時飛星', normalizeFlyingStar(hourStart + seasonalDirection * hourIndex), seasonalDirection);

  return [
    makeFlyingStarChart('年飛星', normalizeFlyingStar(11 - String(solarYear).split('').reduce((sum, digit) => sum + Number(digit), 0)), 1),
    makeFlyingStarChart('月飛星', normalizeFlyingStar(monthStart - monthIndex), 1),
    makeFlyingStarChart('日飛星', daily.center, daily.direction),
    hourChart,
  ];
}

function normalizeFlyingStar(number) {
  return ((number - 1) % 9 + 9) % 9 + 1;
}

function getGroupedStar(branch, groups) {
  const group = Object.entries(DAY_BRANCH_GROUPS).find(([, branches]) => branches.has(branch));
  const star = groups[group?.[0]];
  if (!star) throw new Error(`無法根據地支確定紫白星：${branch || '缺少地支'}`);
  return star;
}

function makeFlyingStarChart(label, center, direction) {
  const stars = Array(9);
  LUO_SHU_FLIGHT_ORDER.forEach((palaceIndex, step) => {
    stars[palaceIndex] = normalizeFlyingStar(center + direction * step);
  });
  return {
    盤型: label,
    中宮: center,
    飛向: direction === 1 ? '順飛' : '逆飛',
    九宮星: stars,
  };
}

function civilTimestamp(year, month, day, hour = 0, minute = 0, second = 0) {
  return Date.UTC(year, month - 1, day, hour, minute, second);
}

function solarTimestamp(solar) {
  return civilTimestamp(solar.getYear(), solar.getMonth(), solar.getDay(), solar.getHour(), solar.getMinute(), solar.getSecond());
}

function getSolarTermEntries(Solar, years) {
  const entries = new Map();
  years.forEach((year) => {
    const table = Solar.fromYmd(year, 6, 21).getLunar().getJieQiTable();
    DAY_STAR_ANCHORS.forEach(({ term, center, direction }) => {
      const solar = table[term];
      if (solar) entries.set(`${term}-${solarTimestamp(solar)}`, { term, center, direction, timestamp: solarTimestamp(solar) });
    });
  });
  return [...entries.values()];
}

function getDailyFlyingStar(Solar, year, month, day, dayPillar) {
  const dayCycleIndex = GANZHI_CYCLE.indexOf(dayPillar);
  if (dayCycleIndex < 0) throw new Error(`無法根據日柱確定日紫白：${dayPillar || '缺少日柱'}`);

  const calendarDate = Solar.fromYmd(year, month, day);
  const calendarCycleIndex = GANZHI_CYCLE.indexOf(calendarDate.getLunar().getDayInGanZhi());
  const dayOffset = ((dayCycleIndex - calendarCycleIndex) % 60 + 60) % 60;
  const effectiveTimestamp = civilTimestamp(year, month, day + (dayOffset === 1 ? 1 : 0));
  const terms = getSolarTermEntries(Solar, [year - 1, year, year + 1]);
  const anchors = terms.map((entry) => {
    const termDate = new Date(entry.timestamp);
    const termSolar = Solar.fromYmd(termDate.getUTCFullYear(), termDate.getUTCMonth() + 1, termDate.getUTCDate());
    const termCycleIndex = GANZHI_CYCLE.indexOf(termSolar.getLunar().getDayInGanZhi());
    const daysToJiazi = (60 - termCycleIndex) % 60;
    const termDay = civilTimestamp(termDate.getUTCFullYear(), termDate.getUTCMonth() + 1, termDate.getUTCDate());
    return { ...entry, anchorTimestamp: termDay + daysToJiazi * 86400000 };
  }).filter((entry) => entry.anchorTimestamp <= effectiveTimestamp)
    .sort((first, second) => first.anchorTimestamp - second.anchorTimestamp || first.timestamp - second.timestamp);
  const anchor = anchors.at(-1);
  if (!anchor) throw new Error('無法找到所選日期之前的日紫白甲子錨點。');

  const elapsedDays = Math.floor((effectiveTimestamp - anchor.anchorTimestamp) / 86400000);
  return {
    center: normalizeFlyingStar(anchor.center + anchor.direction * elapsedDays),
    direction: anchor.direction,
  };
}

function getSeasonalDirection(Solar, year, month, day, hour) {
  const timestamp = civilTimestamp(year, month, day, hour);
  const solstices = getSolarTermEntries(Solar, [year - 1, year, year + 1])
    .filter(({ term }) => term === '冬至' || term === '夏至')
    .filter(({ timestamp: termTimestamp }) => termTimestamp <= timestamp)
    .sort((first, second) => first.timestamp - second.timestamp);
  const latestSolstice = solstices.at(-1);
  if (!latestSolstice) throw new Error('無法判定時紫白的冬夏順逆。');
  return latestSolstice.term === '冬至' ? 1 : -1;
}

function resolveSolarYear(calendarYear, yearPillar) {
  const solarYear = [calendarYear - 1, calendarYear, calendarYear + 1].find((candidate) => {
    const cycleIndex = ((candidate - 4) % 60 + 60) % 60;
    return GANZHI_CYCLE[cycleIndex] === yearPillar;
  });
  if (!solarYear) throw new Error(`无法根据年柱确定立春年：${yearPillar}`);
  return solarYear;
}

async function generateByChartType(type, datetime) {
  const timeChart = window.Qimen.chartToObject(window.Qimen.generateChartByDatetime(datetime, {
    定局法: DEFAULT_JU_METHOD,
    夜子時: DEFAULT_ZI_METHOD,
  }));

  if (type === 'shijia') {
    return {
      ...timeChart,
      盤型: '时盘',
      天乙: calculateHourlyTianYi(timeChart),
      格局列表: getOverallFormations(timeChart),
    };
  }
  if (type === 'mingpan') {
    const shiftedChart = shiftInput.checked ? applyStarShift(timeChart, Number(shiftStepsInput.value)) : timeChart;
    lunarEnginePromise ||= import(LUNAR_ENGINE_URL);
    const { Solar } = await lunarEnginePromise;
    const eightChar = Solar.fromYmdHms(
      Number(datetime.slice(0, 4)), Number(datetime.slice(4, 6)), Number(datetime.slice(6, 8)),
      Number(datetime.slice(8, 10)), 0, 0,
    ).getLunar().getEightChar();
    eightChar.setSect(1);
    return {
      ...shiftedChart,
      八字日柱: eightChar.getDay(),
      盤型: '命盘',
      天乙: calculateHourlyTianYi(shiftedChart),
      格局列表: getOverallFormations(shiftedChart),
      展示說明: `个人命盘按所填出生时刻，以时家转盘法生成${shiftInput.checked ? `，${shiftStepLabel(shiftStepsInput.value)}` : ''}。`,
      移星換斗對照: shiftInput.checked ? { before: timeChart, after: shiftedChart } : null,
    };
  }

  layerEnginePromise ||= import(LAYER_ENGINE_URL);
  const layerEngine = await layerEnginePromise;
  const year = Number(datetime.slice(0, 4));
  const solarYear = resolveSolarYear(year, timeChart['年柱']);
  const month = Number(datetime.slice(4, 6));
  const day = Number(datetime.slice(6, 8));
  let chart;

  if (type === 'nianjia') {
    chart = layerEngine.nianJiaGenerate(solarYear);
  } else if (type === 'yuejia') {
    const monthBranch = timeChart['月柱']?.[1];
    const termMonth = { 寅: 1, 卯: 2, 辰: 3, 巳: 4, 午: 5, 未: 6, 申: 7, 酉: 8, 戌: 9, 亥: 10, 子: 11, 丑: 12 }[monthBranch];
    if (!termMonth) throw new Error('无法根据节气月确定月家盘。');
    chart = layerEngine.yueJiaGenerate(solarYear, termMonth);
  } else {
    chart = layerEngine.riJiaGenerate(year, month, day);
  }

  return makeLayerChart(chart, type, timeChart);
}

function applyStarShift(chart, steps) {
  const normalizedSteps = ((steps % SHIFT_RING.length) + SHIFT_RING.length) % SHIFT_RING.length;
  if (normalizedSteps === 0) return chart;

  const shifted = { ...chart };
  const layerFields = ['八神', '九星', '天門', '天盤', '地盤'];
  layerFields.forEach((field) => {
    if (!Array.isArray(chart[field]) || chart[field].length !== PALACES.length) return;
    const layer = [...chart[field]];
    const nextLayer = [...layer];
    SHIFT_RING.forEach((sourcePosition, ringIndex) => {
      const targetPosition = SHIFT_RING[(ringIndex + normalizedSteps) % SHIFT_RING.length];
      nextLayer[targetPosition] = layer[sourcePosition];
    });
    shifted[field] = nextLayer;
  });
  return shifted;
}

function updateChartTypeControls() {
  const type = chartTypeInput.value;
  const needsHour = ['mingpan', 'shijia'].includes(type);
  const monthOnly = type === 'yuejia';
  const yearOnly = type === 'nianjia';
  document.querySelector('#chart-year-label').hidden = !yearOnly;
  document.querySelector('#chart-year-row').hidden = !yearOnly;
  yearInput.disabled = !yearOnly;
  yearInput.required = yearOnly;
  document.querySelector('#chart-month-label').hidden = !monthOnly;
  document.querySelector('#chart-month-row').hidden = !monthOnly;
  document.querySelector('#chart-date-field-label').hidden = monthOnly || yearOnly;
  document.querySelector('#chart-date-row').hidden = monthOnly || yearOnly;
  monthInput.disabled = !monthOnly;
  monthInput.required = monthOnly;
  dateInput.disabled = monthOnly || yearOnly;
  const usesMonthlyScan = travelInput.checked || personalThreeVictoryInput.checked;
  document.querySelector('#prediction-option').hidden = type !== 'shijia';
  const needsPredictionDirection = ['invite', 'migration'].includes(predictionTopicInput.value);
  const needsPredictionPersonStem = predictionTopicInput.value === 'prisonerRelease';
  document.querySelector('#prediction-direction-option').hidden = type !== 'shijia' || !needsPredictionDirection;
  document.querySelector('#prediction-person-stem-option').hidden = type !== 'shijia' || !needsPredictionPersonStem;
  document.querySelector('#prediction-direction-label').textContent = traditionalize(
    predictionTopicInput.value === 'migration' ? '迁移方向' : '来人方向',
  );
  predictionTopicInput.disabled = type !== 'shijia';
  predictionDirectionInput.disabled = type !== 'shijia' || !needsPredictionDirection;
  predictionPersonStemInput.disabled = type !== 'shijia' || !needsPredictionPersonStem;
  document.querySelector('#travel-option').hidden = type !== 'mingpan';
  document.querySelector('#personal-three-victory-option').hidden = type !== 'mingpan';
  document.querySelector('#eight-god-option').hidden = type !== 'mingpan';
  document.querySelector('#travel-month-option').hidden = type !== 'mingpan' || !usesMonthlyScan;
  document.querySelector('#eight-god-settings').hidden = type !== 'mingpan' || !eightGodInput.checked;
  document.querySelector('#shift-option').hidden = type !== 'mingpan';
  document.querySelector('#shift-settings').hidden = type !== 'mingpan' || !shiftInput.checked;
  travelInput.disabled = type !== 'mingpan';
  personalThreeVictoryInput.disabled = type !== 'mingpan';
  eightGodInput.disabled = type !== 'mingpan';
  eightGodTargetInput.disabled = type !== 'mingpan' || !eightGodInput.checked;
  eightGodMonthInput.disabled = type !== 'mingpan' || !eightGodInput.checked;
  shiftInput.disabled = type !== 'mingpan';
  travelMonthInput.disabled = !(type === 'mingpan' && usesMonthlyScan);
  const canShift = type === 'mingpan';
  previousShiftButton.disabled = !canShift;
  nextShiftButton.disabled = !canShift;
  shiftStepsInput.disabled = true;
  document.querySelector('#mode-hint').textContent = traditionalize(MODE_HINTS[type]);
  document.querySelector('.field-heading').hidden = !needsHour;
  document.querySelector('.time-input-row').hidden = !needsHour;
  hourInput.disabled = !needsHour;
  document.querySelector('#previous-shichen-button').hidden = !needsHour;
  document.querySelector('#next-shichen-button').hidden = !needsHour;
}

async function getMonthlyTravelGuidance(monthValue) {
  const [year, month] = monthValue.split('-').map(Number);
  const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const { Solar } = await lunarEnginePromise;
  const months = new Map();
  const monthNames = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const directions = {
    1: ['南', '北'], 5: ['南', '北'], 9: ['南', '北'],
    2: ['东', '西'], 6: ['东', '西'], 10: ['东', '西'],
    3: ['北', '南'], 7: ['北', '南'], 11: ['北', '南'],
    4: ['西', '东'], 8: ['西', '东'], 12: ['西', '东'],
  };

  for (let day = 1; day <= dayCount; day += 1) {
    const lunar = Solar.fromYmd(year, month, day).getLunar();
    const lunarMonth = Math.abs(lunar.getMonth());
    const key = String(lunarMonth);
    if (!months.has(key)) {
      const [direction, facing] = directions[lunarMonth];
      months.set(key, {
        month: lunarMonth,
        monthLabel: `${monthNames[lunarMonth]}月`,
        direction,
        facing,
      });
    }
  }

  return [...months.values()];
}

function renderTravelMonth(monthValue, matches, mode = 'travel', monthlyGuidance = []) {
  const section = document.querySelector('#travel-month-section');
  const container = document.querySelector('#travel-month-results');
  const guidance = document.querySelector('#travel-month-guidance');
  if (!monthValue) {
    section.hidden = true;
    container.replaceChildren();
    guidance.hidden = true;
    guidance.replaceChildren();
    return;
  }

  const [year, month] = monthValue.split('-').map(Number);
  const isPersonalThreeVictory = mode === 'personalThreeVictory';
  document.querySelector('#travel-month-title').textContent = traditionalize(isPersonalThreeVictory ? '个人三胜宫' : '出行诀');
  document.querySelector('.travel-month-note').textContent = traditionalize(
    isPersonalThreeVictory
      ? '以本命值符、九天、生门三宫为个人目标，叠合月盘、日盘与时盘；结果按目标宫位列出日期、时辰与方向。'
      : '本命盘定目标宫，月家盘、日家盘和时家盘逐层筛选；每天按十二个两小时段计算。',
  );
  guidance.replaceChildren();
  guidance.hidden = isPersonalThreeVictory || monthlyGuidance.length === 0;
  if (!guidance.hidden) {
    const heading = document.createElement('strong');
    heading.textContent = traditionalize('月建旺气方位参考（按农历月）');
    const items = document.createElement('div');
    items.className = 'travel-month-guidance-items';
    monthlyGuidance.forEach(({ monthLabel, direction, facing }) => {
      const item = document.createElement('span');
      item.textContent = traditionalize(`${monthLabel}：正${direction}方面向${facing}`);
      items.append(item);
    });
    const note = document.createElement('small');
    note.textContent = traditionalize('据所附资料第18节；仅作方位参考，不参与本命盘择日筛选。');
    guidance.append(heading, items, note);
  }
  document.querySelector('#travel-month-summary').textContent = traditionalize(`${year} 年 ${month} 月 · ${matches.length} 天`);
  section.hidden = false;

  if (matches.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'travel-month-empty';
    empty.textContent = traditionalize(isPersonalThreeVictory
      ? '本月没有符合个人三胜宫叠盘条件的日期。'
      : '本月没有符合天月值符日、九天日或生门日条件的日期。');
    container.replaceChildren(empty);
    return;
  }

  const table = document.createElement('table');
  table.className = 'travel-month-table';
  table.setAttribute('aria-label', traditionalize(isPersonalThreeVictory ? '整月个人三胜宫日期与时段' : '整月出行诀日期与时段'));
  const header = document.createElement('tr');
  ['日期', '天月值符日', '九天日', '生门日'].forEach((heading) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = traditionalize(heading);
    header.append(cell);
  });
  const head = document.createElement('thead');
  head.append(header);

  const body = document.createElement('tbody');
  matches.forEach(({ day, weekday, categories }) => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    const date = document.createElement('time');
    date.dateTime = `${year}-${pad(month)}-${pad(day)}T00:00:00+08:00`;
    date.textContent = traditionalize(`${pad(month)}/${pad(day)} 周${weekday}`);
    dateCell.append(date);
    row.append(dateCell);

    categories.forEach(({ matches: categoryMatches, targetIndex, detail, hours, calendarLabel }) => {
      const cell = document.createElement('td');
      cell.className = 'travel-category-cell';
      const palace = PALACES[targetIndex];
      if (categoryMatches) {
        const label = document.createElement('span');
        label.className = 'travel-calendar-label';
        label.textContent = traditionalize(calendarLabel);
        const direction = document.createElement('strong');
        direction.className = 'travel-direction';
        direction.textContent = traditionalize(palace.number === '5' ? palace.name : `${palace.direction}${palace.name}`);
        const hoursLabel = document.createElement('span');
        hoursLabel.className = 'travel-hours';
        hoursLabel.textContent = traditionalize(hours.join('、'));
        cell.append(label, direction, hoursLabel);
        cell.title = traditionalize(`${palace.direction}${palace.name}：${detail}`);
      } else {
        cell.classList.add('is-empty');
        cell.textContent = '—';
      }
      row.append(cell);
    });
    body.append(row);
  });

  table.append(head, body);
  const tableWrap = document.createElement('div');
  tableWrap.className = 'travel-month-table-wrap';
  tableWrap.append(table);
  container.replaceChildren(tableWrap);
}

function renderSevenStarLamp(chart) {
  const section = document.querySelector('#seven-star-section');
  const container = document.querySelector('#seven-star-results');
  if (chart.盤型 !== '时盘') {
    section.hidden = true;
    container.replaceChildren();
    return;
  }

  const palaceLabel = (index) => {
    const palace = PALACES[index];
    return palace ? traditionalize(palace.number === '5' ? palace.name : `${palace.direction}${palace.name}`) : '—';
  };
  const findDoor = (door) => findPalaceIndex(chart, '天門', door);
  const findGod = (god) => findPalaceIndex(chart, '八神', god);
  const findStar = (star) => findPalaceIndex(chart, '九星', star);
  const deadIndex = findDoor('死门');
  const lifeIndex = findDoor('生门');
  const sevenStarMap = [
    ['天枢 · 贪狼', '天蓬'],
    ['天璇 · 巨门', '天芮'],
    ['天玑 · 禄存', '天冲'],
    ['天权 · 文曲', '天辅'],
    ['玉衡 · 廉贞', '天禽'],
    ['开阳 · 武曲', '天心'],
    ['摇光 · 破军', '天柱'],
  ];
  const objectiveCandidates = {
    longevity: getSevenStarObjectiveCandidates(chart, 'longevity'),
    career: getSevenStarObjectiveCandidates(chart, 'career'),
    wealth: getSevenStarObjectiveCandidates(chart, 'wealth'),
    health: getSevenStarObjectiveCandidates(chart, 'health'),
  };
  const objectiveLabels = { longevity: '延寿', career: '事业', wealth: '财富', health: '健康' };
  const matchedObjectives = Object.entries(objectiveCandidates).filter(([, candidates]) => candidates.length > 0);
  if (matchedObjectives.length === 0) {
    section.hidden = true;
    container.replaceChildren();
    return;
  }

  document.querySelector('#seven-star-summary').textContent = traditionalize(
    `死门 ${palaceLabel(deadIndex)} → 生门 ${palaceLabel(lifeIndex)} · 命中${matchedObjectives.length}项目标`,
  );
  section.hidden = false;
  container.replaceChildren();

  const table = document.createElement('table');
  table.className = 'seven-star-table';
  table.setAttribute('aria-label', traditionalize('七星灯对应宫位'));
  const headRow = document.createElement('tr');
  ['星灯', '奇门九星', '当前宫位'].forEach((heading) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = traditionalize(heading);
    headRow.append(cell);
  });
  const head = document.createElement('thead');
  head.append(headRow);
  const body = document.createElement('tbody');
  sevenStarMap.forEach(([lamp, star]) => {
    const row = document.createElement('tr');
    const lampCell = document.createElement('td');
    lampCell.textContent = traditionalize(lamp);
    const starCell = document.createElement('td');
    starCell.textContent = traditionalize(star);
    const palaceCell = document.createElement('td');
    palaceCell.textContent = palaceLabel(findStar(star));
    row.append(lampCell, starCell, palaceCell);
    body.append(row);
  });
  table.append(head, body);
  container.append(table);

  const markersByPalace = PALACES.map(() => []);
  sevenStarMap.forEach(([lamp, star], starIndex) => {
    const palaceIndex = findStar(star);
    if (palaceIndex >= 0) markersByPalace[palaceIndex].push({ number: starIndex + 1, lamp, star });
  });
  const candidateLabels = (candidates) => candidates.map(({ index }) => palaceLabel(index)).join('、');
  const candidateFormations = (candidates) => [...new Set(candidates.flatMap(({ formations }) => formations))].join('、');
  const cards = document.createElement('div');
  cards.className = 'seven-star-cards';
  const addCard = (label, value, detail, candidates) => {
    const card = document.createElement('section');
    card.className = 'seven-star-card';
    const title = document.createElement('strong');
    title.textContent = traditionalize(label);
    const resultText = document.createElement('span');
    resultText.className = 'seven-star-card-value';
    resultText.textContent = traditionalize(value);
    const note = document.createElement('small');
    note.textContent = traditionalize(detail);
    const routeList = document.createElement('div');
    routeList.className = 'seven-star-routes';
    const directionArrows = { 东: '→', 东南: '↘', 南: '↓', 西南: '↙', 西: '←', 西北: '↖', 北: '↑', 东北: '↗' };
    candidates.forEach(({ index }) => {
      const palace = PALACES[index];
      const routeFigure = document.createElement('figure');
      routeFigure.className = 'seven-star-route-figure';
      const caption = document.createElement('figcaption');
      caption.textContent = traditionalize(palace.direction === '中'
        ? `${label} · 中宫目标`
        : `${label} · ${directionArrows[palace.direction]} 向${palace.direction}`);
      routeFigure.append(caption);

      const steps = SEVEN_STAR_WALK_PATHS[palace.direction];
      if (!steps) {
        const noteText = document.createElement('span');
        noteText.className = 'seven-star-route-empty';
        noteText.textContent = traditionalize('中宫没有对应的方向步图');
        routeFigure.append(noteText);
        routeList.append(routeFigure);
        return;
      }

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('seven-star-route-svg');
      svg.setAttribute('viewBox', '-12 -12 124 124');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', traditionalize(`${label}向${palace.direction}七星步，一至七步`));

      const board = document.createElementNS(svg.namespaceURI, 'rect');
      board.setAttribute('x', '0');
      board.setAttribute('y', '0');
      board.setAttribute('width', '100');
      board.setAttribute('height', '100');
      board.classList.add('seven-star-route-board');
      svg.append(board);
      [100 / 3, 200 / 3].forEach((position) => {
        const vertical = document.createElementNS(svg.namespaceURI, 'line');
        vertical.setAttribute('x1', String(position));
        vertical.setAttribute('x2', String(position));
        vertical.setAttribute('y1', '0');
        vertical.setAttribute('y2', '100');
        vertical.classList.add('seven-star-route-gridline');
        svg.append(vertical);
        const horizontal = document.createElementNS(svg.namespaceURI, 'line');
        horizontal.setAttribute('x1', '0');
        horizontal.setAttribute('x2', '100');
        horizontal.setAttribute('y1', String(position));
        horizontal.setAttribute('y2', String(position));
        horizontal.classList.add('seven-star-route-gridline');
        svg.append(horizontal);
      });
      for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
        for (let columnIndex = 0; columnIndex < 3; columnIndex += 1) {
          const x = columnIndex * 100 / 3;
          const y = rowIndex * 100 / 3;
          [[x + 2, y + 2, x + 100 / 3 - 2, y + 100 / 3 - 2], [x + 100 / 3 - 2, y + 2, x + 2, y + 100 / 3 - 2]].forEach((coords) => {
            const diagonal = document.createElementNS(svg.namespaceURI, 'line');
            diagonal.setAttribute('x1', String(coords[0]));
            diagonal.setAttribute('y1', String(coords[1]));
            diagonal.setAttribute('x2', String(coords[2]));
            diagonal.setAttribute('y2', String(coords[3]));
            diagonal.classList.add('seven-star-route-diagonal');
            svg.append(diagonal);
          });
        }
      }
      steps.forEach(([x, y], stepIndex) => {
        const marker = document.createElementNS(svg.namespaceURI, 'g');
        marker.classList.add('seven-star-route-candle');
        marker.setAttribute('transform', `translate(${x} ${y})`);
        const wick = document.createElementNS(svg.namespaceURI, 'line');
        wick.setAttribute('x1', '0');
        wick.setAttribute('y1', '-5');
        wick.setAttribute('x2', '0');
        wick.setAttribute('y2', '-3.5');
        wick.classList.add('seven-star-candle-wick');
        const body = document.createElementNS(svg.namespaceURI, 'rect');
        body.setAttribute('x', '-4.5');
        body.setAttribute('y', '-3.5');
        body.setAttribute('width', '9');
        body.setAttribute('height', '5');
        body.setAttribute('rx', '1.8');
        body.classList.add('seven-star-candle-body');
        const top = document.createElementNS(svg.namespaceURI, 'ellipse');
        top.setAttribute('cx', '0');
        top.setAttribute('cy', '-3.5');
        top.setAttribute('rx', '4.5');
        top.setAttribute('ry', '1.3');
        top.classList.add('seven-star-candle-top');
        marker.append(wick, body, top);
        svg.append(marker);

        const sequence = document.createElementNS(svg.namespaceURI, 'g');
        sequence.classList.add('seven-star-route-sequence');
        sequence.setAttribute('transform', `translate(${x + 7} ${y - 6})`);
        sequence.setAttribute('aria-label', `第${stepIndex + 1}步`);
        const numberCircle = document.createElementNS(svg.namespaceURI, 'circle');
        numberCircle.setAttribute('r', '3.8');
        const number = document.createElementNS(svg.namespaceURI, 'text');
        number.setAttribute('text-anchor', 'middle');
        number.setAttribute('dy', '1.4');
        number.textContent = String(stepIndex + 1);
        sequence.append(numberCircle, number);
        svg.append(sequence);
      });
      routeFigure.append(svg);
      routeList.append(routeFigure);
    });
    card.append(title, resultText, note, routeList);
    cards.append(card);
  };
  matchedObjectives.forEach(([objective, candidates]) => {
    const details = [`同宫格局：${candidateFormations(candidates)}`];
    if (objective === 'longevity') details.push('日干甲');
    addCard(objectiveLabels[objective], candidateLabels(candidates), details.join('；'), candidates);
  });
  container.append(cards);
}

function makeLayer(className, label, value, matchedPillars = [], longevityStages = []) {
  const row = document.createElement('div');
  row.className = `layer ${className}`;
  if (matchedPillars.length) row.classList.add('matched-stem-layer');
  const normalizedValue = simplify(value);
  const element = className === 'door' ? DOOR_ELEMENTS[normalizedValue[0]]
    : className === 'star' ? STAR_ELEMENTS[normalizedValue[1]]
      : className === 'heaven' || className === 'earth' ? STEM_ELEMENTS[normalizedValue[0]]
        : undefined;
  if (element) row.dataset.element = element;
  const name = document.createElement('span');
  if (matchedPillars.length) {
    name.className = `matched-stem ${matchedPillars.map((pillar) => `${pillar}-stem-match`).join(' ')}`;
    name.title = `匹配${matchedPillars.map((pillar) => STEM_MATCH_LABELS[pillar]).join('、')}`;
  }
  const renderedValue = traditionalize(value);
  if (className === 'star') name.classList.add('star-main-value');
  name.textContent = className === 'door' ? renderedValue.replace(/門$/, '') : renderedValue;
  const caption = document.createElement('span');
  caption.className = 'layer-label';
  caption.textContent = traditionalize(label);
  if (className === 'heaven' || className === 'earth') {
    const valueContent = document.createElement('span');
    valueContent.className = 'layer-value-content';
    if (longevityStages.length) {
      const stageLabel = document.createElement('span');
      stageLabel.className = 'stem-longevity';
      stageLabel.textContent = longevityStages.map(({ stage }) => stage).join('·');
      const plateName = className === 'earth' ? '地盘干' : '天盘干';
      stageLabel.title = `${plateName}十二长生（${longevityStages.map(({ branch, stage }) => `${branch}${stage}`).join('、')}）`;
      valueContent.append(stageLabel);
    }
    valueContent.append(name);
    row.append(valueContent, caption);
  } else {
    row.append(name, caption);
  }
  return row;
}

function getStemTwelveStages(stem, palaceNumber) {
  const normalizedStem = simplify(stem)[0];
  const startBranch = STEM_LONGEVITY_STARTS[normalizedStem];
  const branchIndex = (branch) => CYCLE_BRANCHES.findIndex(([name]) => name === branch);
  const startIndex = branchIndex(startBranch);
  if (startIndex < 0) return [];
  const direction = YANG_STEMS.has(normalizedStem) ? 1 : -1;
  return (PALACE_HIDDEN_BRANCHES[palaceNumber] || []).map((branch) => {
    const currentIndex = branchIndex(branch);
    const stageIndex = (direction === 1
      ? currentIndex - startIndex
      : startIndex - currentIndex) % CYCLE_BRANCHES.length;
    return { branch, stage: TWELVE_STAGE_BRANCHES[(stageIndex + CYCLE_BRANCHES.length) % CYCLE_BRANCHES.length] };
  });
}

function getNineStarPhase(starName, palaceNumber) {
  const starElement = STAR_ELEMENTS[simplify(starName).at(-1)];
  const palaceElement = PALACE_ELEMENTS[palaceNumber];
  if (!starElement || !palaceElement) return '';
  if (starElement === palaceElement) return '相';
  if (ELEMENT_GENERATES[starElement] === palaceElement) return '旺';
  if (ELEMENT_GENERATES[palaceElement] === starElement) return '死';
  if (ELEMENT_CONTROLS[starElement] === palaceElement) return '休';
  if (ELEMENT_CONTROLS[palaceElement] === starElement) return '囚';
  return '';
}

function getVoidBranches(pillar) {
  const cycleIndex = GANZHI_CYCLE.indexOf(pillar || '');
  if (cycleIndex < 0) return [];

  const xunStart = Math.floor(cycleIndex / 10) * 10;
  const occupiedBranches = new Set(GANZHI_CYCLE.slice(xunStart, xunStart + 10).map((ganzhi) => ganzhi[1]));
  return CYCLE_BRANCHES.map(([branch]) => branch).filter((branch) => !occupiedBranches.has(branch));
}

function findPalaceIndex(chart, field, value) {
  return chart[field]?.findIndex((item) => simplify(item) === value) ?? -1;
}

function getSevenStarFormationNames(chart, index) {
  const door = simplify(chart.天門?.[index]);
  const skyStem = simplify(chart.天盤?.[index]);
  const earthStem = simplify(chart.地盤?.[index]);
  const names = [];
  if (door === simplify(chart.值使) && earthStem === '丁') names.push('玉女守门');
  if (skyStem === '戊' && earthStem === '乙') names.push('青龙返首');
  if (skyStem === '丙' && earthStem === '戊') names.push('飞鸟跌穴');
  return names;
}

function getSevenStarObjectiveCandidates(chart, objective) {
  const criteria = {
    longevity: {
      gods: ['值符'], stars: ['天心'], doors: ['生门'], skyStems: ['乙', '丙', '丁'],
      formations: ['玉女守门', '青龙返首', '飞鸟跌穴'], dayStem: '甲',
    },
    health: {
      gods: ['值符'], stars: ['天心'], doors: ['生门'], skyStems: ['乙', '丙', '丁'],
      formations: ['玉女守门', '青龙返首', '飞鸟跌穴'],
    },
    career: {
      gods: ['值符', '六合', '九地'], stars: ['天心', '天任', '天芮'], doors: ['生门', '开门'], skyStems: ['乙', '丙', '丁', '戊'],
      formations: ['玉女守门', '青龙返首', '飞鸟跌穴'],
    },
    wealth: {
      gods: ['值符', '九天', '九地'], stars: ['天心', '天任'], doors: ['生门'], skyStems: ['乙', '丙', '丁', '戊'],
      formations: ['玉女守门', '青龙返首', '飞鸟跌穴'],
    },
  }[objective];
  if (!criteria) return [];
  if (criteria.dayStem && simplify(chart.日柱?.[0]) !== criteria.dayStem) return [];

  return PALACES.reduce((candidates, _, index) => {
    const god = simplify(chart.八神?.[index]);
    const star = simplify(chart.九星?.[index]);
    const door = simplify(chart.天門?.[index]);
    const skyStem = simplify(chart.天盤?.[index]);
    const formations = getSevenStarFormationNames(chart, index);
    const hasFormation = formations.some((formation) => criteria.formations.includes(formation));
    if (criteria.gods.includes(god)
      && criteria.stars.includes(star)
      && criteria.doors.includes(door)
      && criteria.skyStems.includes(skyStem)
      && hasFormation) {
      candidates.push({ index, formations });
    }
    return candidates;
  }, []);
}

async function findMonthlyTravelDates(monthValue, hour, natalChart) {
  const [year, month] = monthValue.split('-').map(Number);
  const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const natalTargets = {
    valueFu: findPalaceIndex(natalChart, '八神', '值符'),
    nineHeaven: findPalaceIndex(natalChart, '八神', '九天'),
    lifeDoor: findPalaceIndex(natalChart, '天門', '生门'),
  };
  const matches = [];

  if (Object.values(natalTargets).some((index) => index < 0)) return matches;

  for (let day = 1; day <= dayCount; day += 1) {
    const baseDatetime = `${year}${pad(month)}${pad(day)}${pad(hour)}`;
    const monthChart = await generateByChartType('yuejia', baseDatetime);
    const dayChart = await generateByChartType('rijia', baseDatetime);
    const monthLifeDoor = findPalaceIndex(monthChart, '天門', '生门');
    const monthValueFu = findPalaceIndex(monthChart, '八神', '值符');
    const monthNineHeaven = findPalaceIndex(monthChart, '八神', '九天');
    const dayValueFu = findPalaceIndex(dayChart, '八神', '值符');
    const dayNineHeaven = findPalaceIndex(dayChart, '八神', '九天');
    const dayLifeDoor = findPalaceIndex(dayChart, '天門', '生门');
    const categories = [
      {
        targetIndex: natalTargets.valueFu,
        dayMatches: dayNineHeaven === natalTargets.valueFu,
        monthMatches: monthLifeDoor === natalTargets.valueFu,
        timeField: '八神',
        timeValue: '值符',
        detail: '月盘生门与日盘九天同临本命值符宫',
      },
      {
        targetIndex: natalTargets.nineHeaven,
        dayMatches: dayLifeDoor === natalTargets.nineHeaven,
        monthMatches: monthValueFu === natalTargets.nineHeaven,
        timeField: '八神',
        timeValue: '九天',
        detail: '月盘值符与日盘生门同临本命九天宫',
      },
      {
        targetIndex: natalTargets.lifeDoor,
        dayMatches: dayValueFu === natalTargets.lifeDoor,
        monthMatches: monthNineHeaven === natalTargets.lifeDoor,
        timeField: '天門',
        timeValue: '生门',
        detail: '月盘九天与日盘值符同临本命生门宫',
      },
    ];

    for (const category of categories) {
      category.hours = [];
      if (!category.dayMatches) {
        category.matches = false;
        category.calendarLabel = category.monthMatches ? '月日時' : '日時';
        continue;
      }

      for (let slot = 0; slot < 12; slot += 1) {
        const centerHour = (slot + 1) * 2 % 24;
        const startHour = (centerHour + 23) % 24;
        const endHour = (centerHour + 1) % 24;
        const timeDatetime = `${year}${pad(month)}${pad(day)}${pad(centerHour)}`;
        const timeChart = window.Qimen.chartToObject(window.Qimen.generateChartByDatetime(timeDatetime, {
          定局法: DEFAULT_JU_METHOD,
          夜子時: DEFAULT_ZI_METHOD,
        }));
        if (findPalaceIndex(timeChart, category.timeField, category.timeValue) === category.targetIndex) {
          category.hours.push(`${pad(startHour)}:00–${pad(endHour)}:00${centerHour === 0 ? '＊' : ''}`);
        }
      }
      category.matches = category.hours.length > 0;
      category.calendarLabel = category.monthMatches ? '月日時' : '日時';
    }

    if (categories.some(({ matches: categoryMatches }) => categoryMatches)) {
      matches.push({
        day,
        weekday: weekdays[new Date(Date.UTC(year, month - 1, day)).getUTCDay()],
        categories,
      });
    }
  }

  return matches;
}

async function findEightGodActivationDates(monthValue, hour, targetGod) {
  const [year, month] = monthValue.split('-').map(Number);
  const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const firstDatetime = `${year}${pad(month)}01${pad(hour)}`;
  const yearChart = await generateByChartType('nianjia', firstDatetime);
  const targetValue = simplify(targetGod);
  const yearIndex = findPalaceIndex(yearChart, '八神', targetGod);
  const matches = [];

  if (yearIndex < 0) return matches;

  for (let day = 1; day <= dayCount; day += 1) {
    const baseDatetime = `${year}${pad(month)}${pad(day)}${pad(hour)}`;
    const monthChart = await generateByChartType('yuejia', baseDatetime);
    const dayChart = await generateByChartType('rijia', baseDatetime);
    const monthIndex = findPalaceIndex(monthChart, '八神', targetGod);
    const dayIndex = findPalaceIndex(dayChart, '八神', targetGod);
    if (yearIndex !== monthIndex || yearIndex !== dayIndex) continue;

    const hours = [];
    for (let slot = 0; slot < 12; slot += 1) {
      const centerHour = (slot + 1) * 2 % 24;
      const startHour = (centerHour + 23) % 24;
      const endHour = (centerHour + 1) % 24;
      const timeDatetime = `${year}${pad(month)}${pad(day)}${pad(centerHour)}`;
      const timeChart = window.Qimen.chartToObject(window.Qimen.generateChartByDatetime(timeDatetime, {
        定局法: DEFAULT_JU_METHOD,
        夜子時: DEFAULT_ZI_METHOD,
      }));
      const timeIndex = findPalaceIndex(timeChart, '八神', targetGod);
      if (timeIndex === yearIndex && simplify(timeChart.八神?.[timeIndex]) === targetValue) {
        hours.push({
          label: `${pad(startHour)}:00–${pad(endHour)}:00${centerHour === 0 ? '＊' : ''}`,
          chartIndex: timeIndex,
        });
      }
    }

    if (hours.length > 0) {
      matches.push({
        day,
        weekday: weekdays[new Date(Date.UTC(year, month - 1, day)).getUTCDay()],
        hours,
        targetIndex: yearIndex,
      });
    }
  }

  return matches;
}

function getEightGodActivationDates(monthValue, hour, targetGod) {
  const cacheKey = [monthValue, simplify(targetGod), DEFAULT_JU_METHOD, DEFAULT_ZI_METHOD].join('|');
  if (!eightGodScanCache.has(cacheKey)) {
    const scan = findEightGodActivationDates(monthValue, hour, targetGod).catch((error) => {
      eightGodScanCache.delete(cacheKey);
      throw error;
    });
    eightGodScanCache.set(cacheKey, scan);
  }
  return eightGodScanCache.get(cacheKey);
}

function renderEightGodActivation(monthValue, targetGod, matches) {
  const section = document.querySelector('#eight-god-section');
  const container = document.querySelector('#eight-god-results');
  if (!monthValue) {
    section.hidden = true;
    container.replaceChildren();
    return;
  }

  const [year, month] = monthValue.split('-').map(Number);
  document.querySelector('#eight-god-summary').textContent = traditionalize(`${year} 年 ${month} 月 · ${matches.length} 天`);
  section.hidden = false;
  if (matches.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'travel-month-empty';
    empty.textContent = traditionalize(`本月没有四层${targetGod}同神同宫的启动时辰。`);
    container.replaceChildren(empty);
    return;
  }

  const table = document.createElement('table');
  table.className = 'travel-month-table';
  table.setAttribute('aria-label', traditionalize(`启动${targetGod}日期与时辰`));
  const header = document.createElement('tr');
  ['日期', '目标八神', '启动时辰'].forEach((heading) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = traditionalize(heading);
    header.append(cell);
  });
  const head = document.createElement('thead');
  head.append(header);
  const body = document.createElement('tbody');
  matches.forEach(({ day, weekday, hours, targetIndex }) => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    const date = document.createElement('time');
    date.dateTime = `${year}-${pad(month)}-${pad(day)}T00:00:00+08:00`;
    date.textContent = traditionalize(`${pad(month)}/${pad(day)} 周${weekday}`);
    dateCell.append(date);
    const palace = PALACES[targetIndex];
    const targetCell = document.createElement('td');
    targetCell.className = 'travel-category-cell';
    targetCell.innerHTML = `<strong class="travel-direction">${targetGod}</strong><span>${palace.number === '5' ? palace.name : `${palace.direction}${palace.name}`} · 背向</span>`;
    const hoursCell = document.createElement('td');
    hoursCell.className = 'travel-category-cell';
    hoursCell.textContent = traditionalize(hours.map(({ label }) => label).join('、'));
    row.append(dateCell, targetCell, hoursCell);
    body.append(row);
  });
  table.append(head, body);
  const wrap = document.createElement('div');
  wrap.className = 'travel-month-table-wrap';
  wrap.append(table);
  container.replaceChildren(wrap);
}

function getPalaceMarkers(chart) {
  const markers = PALACES.map(() => []);
  const addMarker = (index, text, title, type) => {
    if (index < 0 || markers[index].some((marker) => marker.text === text)) return;
    markers[index].push({ text, title, type });
  };

  if (chart.盤型 === '时盘' || chart.盤型 === '命盘') {
    const dayStem = getBaziDayPillar(chart)?.[0];
    const auspicious = DAY_STEM_AUSPICIOUS_MARKERS[dayStem];
    if (auspicious) {
      const palaceIndex = (number) => PALACES.findIndex(({ number: palaceNumber }) => Number(palaceNumber) === number);
      addMarker(palaceIndex(auspicious.joyPalace), '喜', `日干${dayStem}喜神方位`, 'direction-deity');
      addMarker(palaceIndex(auspicious.wealthPalace), '财', `日干${dayStem}财神方位`, 'direction-deity');
      auspicious.nobleBranches.forEach((branch, branchIndex) => {
        const noblePalaceNumber = VOID_BRANCH_PALACES[branch];
        const nobleIndex = palaceIndex(noblePalaceNumber);
        const noblePalace = PALACES[nobleIndex];
        const nobleType = branchIndex === 0
          ? 'direction-deity direction-deity-filled'
          : 'direction-deity';
        const nobleLabel = branchIndex === 0 ? '阳贵／昼贵' : '阴贵／夜贵';
        addMarker(nobleIndex, '贵', `日干${dayStem}${nobleLabel}：${branch}，${noblePalace?.direction || ''}${noblePalace?.name || ''}`, nobleType);
      });
    }
  }

  const voidSources = chart.盤型 === '命盘'
    ? [['时旬空', chart.時柱]]
    : chart.盤型 === '年盘'
      ? [['年旬空', chart.年柱]]
      : chart.盤型 === '月盘'
        ? [['月旬空', chart.月柱]]
        : chart.盤型 === '日盘'
          ? [['日旬空', chart.日柱]]
          : [['日旬空', chart.日柱], ['时旬空', chart.時柱]];
    const pillarBranches = [
      ['年柱', chart.年柱],
      ['月柱', chart.月柱],
      ['日柱', chart.日柱],
      ['时柱', chart.時柱],
    ].map(([name, pillar]) => ({ name, branch: simplify(pillar).slice(-1) }))
      .filter(({ branch }) => CYCLE_BRANCHES.some(([candidate]) => candidate === branch));
  voidSources.forEach(([label, pillar]) => {
    const branches = getVoidBranches(pillar);
    branches.forEach((branch) => {
      const index = PALACES.findIndex(({ number }) => Number(number) === VOID_BRANCH_PALACES[branch]);
      const detail = `${label}：${branches.join('、')}`;
        const filledBy = pillarBranches.filter(({ branch: pillarBranch }) => pillarBranch === branch).map(({ name }) => name);
      const voidBranch = `[${branch}]`;
      const markerLabel = chart.盤型 === '时盘'
        ? `${label.replace('旬空', '')}空亡${voidBranch}`
        : `空亡${voidBranch}`;
        const markerTitle = filledBy.length
          ? `${detail}；${filledBy.join('、')}见${branch}，空亡已填实`
          : detail;
        addMarker(index, markerLabel, markerTitle, filledBy.length ? 'void-filled' : 'void');
    });
  });
  const dayBranch = chart.日柱?.slice(-1);
  const yimaBranch = YIMA_BRANCHES[dayBranch];
  const yimaPalaceNumber = VOID_BRANCH_PALACES[yimaBranch];
  const yimaIndex = PALACES.findIndex(({ number }) => Number(number) === yimaPalaceNumber);
  if (yimaIndex >= 0) {
    const yimaPalace = PALACES[yimaIndex];
    addMarker(yimaIndex, '驿马', `${yimaPalace.direction}${yimaPalace.name}：日支${dayBranch}，驿马在${yimaBranch}`, 'auspicious');
  }
  PALACES.forEach((palace, index) => {
    const door = simplify(chart.天門?.[index]);
    const skyStem = simplify(chart.天盤?.[index]);
    const earthStem = simplify(chart.地盤?.[index]);
    const god = simplify(chart.八神?.[index]);
    const palaceNumber = Number(palace.number);

    if (STEM_TOMB_PALACES[skyStem] === palaceNumber) {
      addMarker(index, `天盤${skyStem}入墓`, `天盤${skyStem}落${palace.direction}${palace.name}，為${skyStem}入墓`, 'overcoming');
    }

    if (skyStem === '乙' && earthStem === '庚') {
      addMarker(index, '日奇被刑', '天盤乙加地盤庚', 'overcoming');
    }
    if (skyStem === '戊' && earthStem === '戊') {
      addMarker(index, '青龍伏吟', '天盤戊加地盤戊', 'overcoming');
    }

    const controlledWonders = {
      乙: [6, 7],
      丙: [1],
      丁: [1],
    };
    const overcomingStems = {
      乙: ['庚', '辛'],
      丙: ['壬', '癸'],
      丁: ['壬', '癸'],
    };
    if (controlledWonders[skyStem]?.includes(palaceNumber) || overcomingStems[skyStem]?.includes(earthStem)) {
      const causes = [];
      if (controlledWonders[skyStem]?.includes(palaceNumber)) causes.push(`${PALACE_NAMES[palaceNumber]}宮克${skyStem}奇`);
      if (overcomingStems[skyStem]?.includes(earthStem)) causes.push(`地盤${earthStem}克${skyStem}奇`);
      addMarker(index, '三奇受制', causes.join('；'), 'overcoming');
    }

    const risingPalace = { 乙: 3, 丙: 9, 丁: 7 }[skyStem];
    if (risingPalace === palaceNumber) {
      addMarker(index, '三奇升殿', `天盤${skyStem}奇臨${PALACE_NAMES[palaceNumber]}宮`, 'auspicious');
    }
    if (skyStem === '丁' && earthStem === '丁') {
      addMarker(index, '奇入太陰', '天盤丁加地盤丁', 'auspicious');
    }

    const qiyiPairs = {
      乙庚: '乙庚奇合', 庚乙: '乙庚奇合',
      丙辛: '丙辛奇合', 辛丙: '丙辛奇合',
      丁壬: '丁壬奇合', 壬丁: '丁壬奇合',
      戊癸: '戊癸儀合', 癸戊: '戊癸儀合',
      甲己: '甲己儀合', 己甲: '甲己儀合',
    };
    const qiyiPair = qiyiPairs[`${skyStem}${earthStem}`];
    if (qiyiPair) addMarker(index, '奇儀相合', qiyiPair, 'auspicious');

    const auspiciousStemPairs = {
      戊丙: ['青龍返首', '天盤戊加地盤丙'],
      丙戊: ['飛鳥跌穴', '天盤丙加地盤戊'],
      乙丁: ['交泰', '天盤乙加地盤丁'],
      丁丙: ['交泰', '天盤丁加地盤丙'],
      丁乙: ['天運昌氣', '天盤丁加地盤乙'],
    };
    const auspiciousStemPair = auspiciousStemPairs[`${skyStem}${earthStem}`];
    if (auspiciousStemPair) addMarker(index, auspiciousStemPair[0], auspiciousStemPair[1], 'auspicious');

    if (door === simplify(chart.值使) && earthStem === '丁') {
      addMarker(index, '玉女守門', `值使${door}臨地盤丁`, 'auspicious');
    }
    const valueFuIndex = chart.八神?.findIndex((item) => simplify(item) === '值符') ?? -1;
    if (index === valueFuIndex && ['乙', '丙', '丁'].includes(skyStem)) {
      addMarker(index, '歡怡', `天盤${skyStem}奇臨值符宮`, 'auspicious');
    }
    const roamingPalaces = { 乙: 3, 丙: 4, 丁: 9 };
    if (roamingPalaces[skyStem] === palaceNumber) {
      addMarker(index, '奇遊祿位', `天盤${skyStem}奇臨${PALACE_NAMES[palaceNumber]}宮`, 'auspicious');
    }

    const disguisedFormations = [
      { name: '天假', door: '景门', stems: ['乙', '丙', '丁'], gods: ['九天'] },
      { name: '地假', door: '杜门', stems: ['丁', '己', '癸'], gods: ['九地', '六合', '太阴'] },
      { name: '人假', door: '惊门', stems: ['壬'], gods: ['九天'] },
      { name: '神假', door: '伤门', stems: ['丁', '己', '癸'], gods: ['九地', '六合'] },
      { name: '鬼假', door: '死门', stems: ['丁', '己', '癸'], gods: ['九地'] },
    ];
    disguisedFormations.forEach((formation) => {
      if (door === formation.door && formation.stems.includes(skyStem) && formation.gods.includes(god)) {
        addMarker(index, formation.name, `${formation.door}、天盤${skyStem}、${god}同宮`, 'auspicious');
      }
    });

    const luckyDoors = ['开门', '休门', '生门'];
    const threeWonders = ['乙', '丙', '丁'];
    if (threeWonders.includes(skyStem) && luckyDoors.includes(door)) {
      if (god === '太阴') addMarker(index, '真诈', `${door}、天盤${skyStem}奇、太陰同宮`, 'auspicious');
      if (god === '九地') addMarker(index, '重诈', `${door}、天盤${skyStem}奇、九地同宮`, 'auspicious');
      if (god === '六合') addMarker(index, '休诈', `${door}、天盤${skyStem}奇、六合同宮`, 'auspicious');
    }

    const nineEscapes = [
      { name: '天遁', matches: skyStem === '丙' && ['生门', '开门'].includes(door) && ['丁', '丙'].includes(earthStem) },
      { name: '地遁', matches: skyStem === '乙' && door === '开门' && ['己', '乙'].includes(earthStem) },
      { name: '人遁', matches: skyStem === '丁' && door === '休门' && god === '太阴' },
      { name: '風遁', matches: skyStem === '乙' && luckyDoors.includes(door) && palaceNumber === 4 },
      { name: '雲遁', matches: skyStem === '乙' && luckyDoors.includes(door) && earthStem === '辛' },
      { name: '龍遁', matches: skyStem === '乙' && luckyDoors.includes(door) && (palaceNumber === 1 || earthStem === '癸') },
      { name: '虎遁', matches: (skyStem === '乙' && door === '休门' && earthStem === '辛' && palaceNumber === 8)
        || (skyStem === '丙' && door === '生门' && earthStem === '辛') },
      { name: '神遁', matches: skyStem === '丙' && door === '生门' && god === '九天' },
      { name: '鬼遁', matches: skyStem === '丁' && door === '杜门' && god === '九地' },
    ];
    nineEscapes.filter(({ matches }) => matches).forEach(({ name }) => {
      addMarker(index, name, `天盤${skyStem}、${door}、${god}、地盤${earthStem}同宮`, 'auspicious');
    });

    const unfavorableStemPairs = {
      乙辛: '青龍逃走', 辛乙: '白虎猖狂', 丁癸: '朱雀投江', 癸丁: '螣蛇夭矯',
      庚丙: '太白入熒', 丙庚: '熒入太白', 戊庚: '飛宮格', 庚戊: '伏宮格',
      庚癸: '大格', 庚壬: '上格', 庚己: '刑格',
    };
    const unfavorableStemPair = unfavorableStemPairs[`${skyStem}${earthStem}`];
    if (unfavorableStemPair) {
      addMarker(index, unfavorableStemPair, `天盤${skyStem}加地盤${earthStem}`, 'overcoming');
    }
    if (skyStem === '庚') {
      const dayStem = simplify(chart.日柱?.[0]);
      const pillarPatterns = [
        ['年格', simplify(chart.年柱?.[0])],
        ['月格', simplify(chart.月柱?.[0])],
        ['日格', dayStem],
        ['时格', simplify(chart.時柱?.[0])],
      ];
      pillarPatterns.forEach(([name, stem]) => {
        if (stem && stem !== '—' && earthStem === stem) {
          addMarker(index, name, `天盤庚加地盤${stem}`, 'overcoming');
        }
      });
      if (earthStem === dayStem) addMarker(index, '伏干格', `天盤庚加地盤日干${dayStem}`, 'overcoming');
    }
    if (skyStem === simplify(chart.日柱?.[0]) && earthStem === '庚') {
      addMarker(index, '飛干格', `天盤日干${skyStem}加地盤庚`, 'overcoming');
    }
    if (skyStem === '庚' && ['乙', '丙', '丁'].includes(earthStem)) {
      addMarker(index, '奇格', `天盤庚加地盤${earthStem}奇`, 'overcoming');
    }
    const pillarStems = [chart.年柱?.[0], chart.月柱?.[0], chart.日柱?.[0], chart.時柱?.[0], chart.符首].map(simplify);
    if (skyStem === '丙' && pillarStems.includes(earthStem)) {
      addMarker(index, '悖格', `天盤丙加地盤${earthStem}`, 'overcoming');
    }
    if (skyStem === '癸' && earthStem === '癸') {
      addMarker(index, '天網四張', '天盤癸加地盤癸', 'overcoming');
    }

  });

  const patterns = window.Qimen?.detectPatterns?.(chart) || [];
  patterns.filter((item) => item.宮 && item.格).forEach((item) => {
    const patternPalace = simplify(item.宮).replace(/宫$/, '');
    const palaceNumber = Object.entries(PALACE_NAMES)
      .find(([, name]) => simplify(name) === patternPalace)?.[0];
    const index = PALACES.findIndex(({ number }) => Number(number) === Number(palaceNumber));
    const relation = simplify(item.關係);
    const text = item.格 === '門迫' ? '門克宮'
      : item.格 === '宮迫' ? '宮克門'
        : relation === '宫生门' ? '宮生門'
          : relation === '门生宫' ? '門生宮'
            : item.格;
    const type = item.吉凶 === '吉' ? 'auspicious'
      : item.吉凶 === '凶' || item.格 === '門迫' || item.格 === '宮迫' ? 'overcoming'
        : 'pattern';
    addMarker(index, text, item.細節 || item.格, type);
  });

  return markers;
}

function findNatalLifePalaceIndex(chart) {
  if (chart.盤型 !== '命盘') return -1;
  const dayPillar = getBaziDayPillar(chart);
  const cycleIndex = GANZHI_CYCLE.findIndex((item) => simplify(item) === dayPillar);
  if (cycleIndex < 0) return -1;
  const dayStem = dayPillar[0];
  const stem = dayStem === '甲' ? XUN_FU_SHOU[GANZHI_CYCLE[cycleIndex]] : dayStem;
  const index = chart.天盤?.findIndex((item) => simplify(item) === stem) ?? -1;
  return index === 4 ? 2 : index;
}

const NATAL_DOOR_ROLES = { 开: '事业', 休: '家庭', 生: '财帛', 伤: '地位', 杜: '智慧', 死: '田宅', 惊: '心灵', 景: '形象' };

function getNatalPalaceRoles(chart, index) {
  if (chart.盤型 !== '命盘') return [];
  const roles = [];
  const door = simplify(chart.天門?.[index])[0];
  if (NATAL_DOOR_ROLES[door]) roles.push(NATAL_DOOR_ROLES[door]);
  const star = simplify(chart.九星?.[index]);
  if (star.includes('天辅')) roles.push('教育');
  if (star.includes('天芮')) roles.push('健康');

  const god = simplify(chart.八神?.[index]);
  if (god.includes('六合')) roles.push('婚姻');

  const xunStem = (pillar) => {
    const cycleIndex = GANZHI_CYCLE.findIndex((item) => simplify(item) === simplify(pillar));
    return cycleIndex < 0 ? undefined : XUN_FU_SHOU[GANZHI_CYCLE[cycleIndex - (cycleIndex % 10)]];
  };
  const stemPalace = (layer, stem) => chart[layer]?.findIndex((item) => simplify(item) === stem) ?? -1;
  const hourStem = simplify(chart.時柱)[0];
  const yearStem = simplify(chart.年柱)[0];
  const hourHiddenStem = xunStem(chart.時柱);
  const childStem = hourStem === '甲' ? hourHiddenStem : hourStem;
  const parentStem = yearStem === '甲' ? hourHiddenStem : yearStem;
  const monthStem = simplify(chart.月柱)[0];
  if (index === stemPalace('天盤', childStem)) roles.push('子女');
  if (index === stemPalace('天盤', parentStem)) roles.push('父母');
  if (index === stemPalace('天盤', monthStem)) roles.push('兄弟');
  if (index === stemPalace('地盤', hourHiddenStem)) roles.push('因果');
  if (index === stemPalace('天盤', xunStem(chart.日柱))) roles.push('元辰');

  const horsePalace = VOID_BRANCH_PALACES[getBaziYimaBranch(chart)];
  const horseIndex = PALACES.findIndex(({ number }) => Number(number) === horsePalace);
  if (horseIndex >= 0 && index === horseIndex) roles.push('遷移');
  return roles;
}

const LIFE_AGE_RING = [7, 6, 3, 0, 1, 2, 5, 8];

function getNatalAgeRanges(chart) {
  const ranges = new Map();
  if (chart.盤型 !== '命盘') return ranges;
  const yearBranch = simplify(chart.年柱).slice(-1);
  const yearPalace = VOID_BRANCH_PALACES[yearBranch];
  const yearPalaceIndex = PALACES.findIndex(({ number }) => Number(number) === yearPalace);
  const start = LIFE_AGE_RING.indexOf(yearPalaceIndex);
  if (start < 0) return ranges;
  LIFE_AGE_RING.forEach((_, step) => {
    const ringIndex = (start + step) % LIFE_AGE_RING.length;
    ranges.set(LIFE_AGE_RING[ringIndex], `${step * 10 + 1}-${step * 10 + 10}`);
  });
  return ranges;
}

function renderPalaces(chart) {
  const grid = document.querySelector('#chart-grid');
  grid.replaceChildren();
  const palaceMarkers = getPalaceMarkers(chart);
  const natalBase = chart.移星換斗對照?.before
    ? { ...chart, ...Object.fromEntries(['八神', '九星', '天門', '天盤', '地盤'].map((field) => [field, chart.移星換斗對照.before[field]])) }
    : chart;
  const lifePalaceIndex = findNatalLifePalaceIndex(natalBase);
  const baziHorseNumber = chart.盤型 === '命盘' ? VOID_BRANCH_PALACES[getBaziYimaBranch(chart)] : undefined;
  const baziHorseIndex = baziHorseNumber ? PALACES.findIndex(({ number }) => Number(number) === baziHorseNumber) : -1;
  const baziVoidSources = new Map();
  if (chart.盤型 === '命盘') {
    [['日', getBaziDayPillar(chart)]].forEach(([label, pillar]) => {
      getVoidBranches(simplify(pillar)).forEach((branch) => {
        baziVoidSources.set(branch, [...(baziVoidSources.get(branch) || []), `${label}柱${simplify(pillar)}`]);
      });
    });
  }
  const baziVoidBranches = [...baziVoidSources.keys()];
  const ageRanges = getNatalAgeRanges(chart);
  const centerDoorValue = ({ 命盘: '命', 年盘: '年', 月盘: '月', 日盘: '日', 时盘: '时' })[chart.盤型]
    || chart.天門?.[4];
  const hourStem = simplify(chart.時柱?.[0]);
  const dayStem = simplify(chart.日柱?.[0]);
  const hourXunStem = XUN_FU_SHOU[simplify(chart.時柱)];
  const dayXunStem = XUN_FU_SHOU[simplify(chart.日柱)];
  const getStemMatches = (value) => {
    const stem = simplify(value);
    const matches = [];
    if (hourStem !== '—' && stem === hourStem) matches.push('hour');
    if (dayStem !== '—' && stem === dayStem) matches.push('day');
    if (hourXunStem && stem === hourXunStem) matches.push('hour-xun');
    if (dayXunStem && stem === dayXunStem) matches.push('day-xun');
    return matches;
  };
  const tianruiIndex = chart.九星?.findIndex((star) => simplify(star) === '天芮') ?? -1;
  const tianqinIndex = chart.九星?.findIndex((star) => simplify(star) === '天禽') ?? -1;
  const tianqinStem = tianqinIndex >= 0 ? chart.天盤?.[tianqinIndex] : undefined;
  const tianqinStemMatches = getStemMatches(tianqinStem);

  PALACES.forEach((palace, index) => {
    const cell = document.createElement('article');
    cell.className = `palace${index === 4 ? ' center' : ''}`;
    cell.dataset.element = PALACE_ELEMENTS[Number(palace.number)];
    const head = document.createElement('div');
    head.className = 'palace-head';
    const number = document.createElement('span');
    number.textContent = palace.number;
    const headLeft = document.createElement('span');
    headLeft.className = 'palace-head-left';
    const isNatal = chart.盤型 === '命盘';
    const flyingStar = chart.紫白飛星?.[index];
    if (flyingStar && !isNatal) {
      const starBox = document.createElement('span');
      starBox.className = 'palace-flying-star';
      starBox.textContent = flyingStar;
      starBox.title = `${chart.紫白盤名}：${flyingStar}`;
      headLeft.append(starBox);
    }
    if (!isNatal) headLeft.append(number);
    head.append(headLeft);
    const directionMarkers = palaceMarkers[index].filter(({ type }) => type.includes('direction-deity'));
    if (directionMarkers.length) {
      const topMarkers = document.createElement('span');
      topMarkers.className = 'palace-top-markers';
      directionMarkers.forEach((marker) => {
        const badge = document.createElement('span');
        badge.className = `palace-marker ${marker.type}`;
        badge.textContent = traditionalize(marker.text);
        badge.title = traditionalize(marker.title);
        topMarkers.append(badge);
      });
      head.append(topMarkers);
    }
    const baziBadges = document.createElement('span');
    baziBadges.className = 'palace-bazi-badges';
    if (index === lifePalaceIndex) {
      const lifeMark = document.createElement('span');
      lifeMark.className = 'life-palace-mark';
      lifeMark.textContent = traditionalize('命');
      lifeMark.title = traditionalize('本命宫（出生日干所在宫位）');
      baziBadges.append(lifeMark);
    }
    baziVoidBranches
      .filter((branch) => VOID_BRANCH_PALACES[branch] === Number(palace.number))
      .forEach((branch) => {
        const voidBadge = document.createElement('span');
        voidBadge.className = 'palace-bazi-void';
        voidBadge.textContent = `${branch}空`;
        voidBadge.title = traditionalize(`八字空亡：${baziVoidSources.get(branch).join('、')}旬空${branch}`);
        baziBadges.append(voidBadge);
      });
    if (index === baziHorseIndex) {
      const horseBadge = document.createElement('span');
      horseBadge.className = 'palace-bazi-horse';
      horseBadge.textContent = traditionalize('马');
      horseBadge.title = traditionalize(`八字驿马：日柱${getBaziDayPillar(chart)}，驿马在${getBaziYimaBranch(chart)}`);
      baziBadges.append(horseBadge);
    }
    if (baziBadges.childElementCount) head.append(baziBadges);
    if (index !== 4) {
      const elementLabel = document.createElement('span');
      elementLabel.className = 'palace-element-label';
      elementLabel.dataset.element = cell.dataset.element;
      elementLabel.textContent = ELEMENT_GLYPHS[cell.dataset.element];
      head.append(elementLabel);
    }

    const name = document.createElement('div');
    name.className = 'palace-name';
    name.textContent = traditionalize(palace.name);
    const hexagramData = chart.盤型 === '命盘' || index === 4 ? null : getPalaceHexagram(chart, index);
    const hexagram = hexagramData ? document.createElement('div') : null;
    if (hexagram && hexagramData) {
      hexagram.className = 'palace-hexagram';
      hexagram.title = traditionalize(
        `上卦${hexagramData.upperTrigram}（${hexagramData.upperNumber}）下卦${hexagramData.lowerTrigram}（${hexagramData.lowerNumber}）；${hexagramData.upperNumber}+${hexagramData.lowerNumber}+飞数${hexagramData.flyingNumber}=${hexagramData.sum}，第${hexagramData.movingLine}爻动；互卦${hexagramData.mutualName}，变卦${hexagramData.changedName}`,
      );
      const hexagramName = document.createElement('span');
      hexagramName.className = 'palace-hexagram-name';
      hexagramName.textContent = traditionalize(hexagramData.name);
      const lineDiagram = document.createElement('span');
      lineDiagram.className = 'palace-hexagram-lines';
      for (let lineNumber = 6; lineNumber >= 1; lineNumber -= 1) {
        const line = document.createElement('span');
        const isYang = hexagramData.lines[lineNumber - 1] === '1';
        line.className = `hexagram-line ${isYang ? 'yang' : 'yin'}${lineNumber === hexagramData.movingLine ? ' moving' : ''}`;
        if (lineNumber === hexagramData.movingLine) {
          const movingDot = document.createElement('i');
          movingDot.className = 'hexagram-moving-dot';
          line.append(movingDot);
        }
        lineDiagram.append(line);
      }
      hexagram.append(hexagramName, lineDiagram);
    }
    const layers = document.createElement('div');
    layers.className = 'palace-layers';
    const starLayer = makeLayer('star', '星', chart.九星?.[index]);
    const starStatusPalace = simplify(chart.九星?.[index]) === '天禽' && tianruiIndex >= 0
      ? Number(PALACES[tianruiIndex].number)
      : Number(palace.number);
    const starPhase = getNineStarPhase(chart.九星?.[index], starStatusPalace);
    if (starPhase) {
      const phaseLabel = document.createElement('span');
      phaseLabel.className = 'nine-star-phase';
      phaseLabel.textContent = starPhase;
      phaseLabel.title = `九星落宫旺衰：${starPhase}`;
      starLayer.insertBefore(phaseLabel, starLayer.firstChild);
    }
    const heavenStemMatches = index === tianqinIndex && tianqinStemMatches.length
      ? []
      : getStemMatches(chart.天盤?.[index]);
    const heavenLayer = makeLayer('heaven', '天', chart.天盤?.[index], heavenStemMatches, getStemTwelveStages(chart.天盤?.[index], Number(palace.number)));
    if (index === tianruiIndex && tianqinIndex >= 0) {
      const tianqinStar = document.createElement('span');
      tianqinStar.className = 'tianqin-element tianqin-star-companion';
      tianqinStar.textContent = traditionalize(chart.九星[tianqinIndex]);
      const starElement = STAR_ELEMENTS[simplify(chart.九星[tianqinIndex])[1]];
      if (starElement) tianqinStar.dataset.element = starElement;
      starLayer.classList.add('with-tianqin');
      starLayer.insertBefore(tianqinStar, starLayer.querySelector('.layer-label'));

      if (tianqinStem) {
        const stemCompanion = document.createElement('span');
        const stemCompanionGroup = document.createElement('span');
        stemCompanionGroup.className = 'tianqin-stem-content';
        stemCompanion.className = `tianqin-element tianqin-stem-companion${tianqinStemMatches.length ? ` matched-stem ${tianqinStemMatches.map((pillar) => `${pillar}-stem-match`).join(' ')}` : ''}`;
        if (tianqinStemMatches.length) {
          stemCompanion.title = `匹配${tianqinStemMatches.map((pillar) => STEM_MATCH_LABELS[pillar]).join('、')}`;
        }
        stemCompanion.textContent = traditionalize(tianqinStem);
        const stemElement = STEM_ELEMENTS[simplify(tianqinStem)[0]];
        if (stemElement) stemCompanion.dataset.element = stemElement;
        stemCompanionGroup.append(stemCompanion);
        heavenLayer.classList.add('with-tianqin-stem');
        heavenLayer.insertBefore(stemCompanionGroup, heavenLayer.firstChild);
      }
    }
    const doorLayer = makeLayer('door', '门', index === 4 ? centerDoorValue : chart.天門?.[index]);
    layers.append(
      makeLayer('god', '神', chart.八神?.[index]),
      starLayer,
      doorLayer,
      heavenLayer,
      makeLayer('earth', '地', chart.地盤?.[index], [], getStemTwelveStages(chart.地盤?.[index], Number(palace.number))),
    );
    const markers = document.createElement('div');
    markers.className = 'palace-markers';
    palaceMarkers[index].filter(({ type }) => !type.includes('direction-deity')).forEach((marker) => {
      const badge = document.createElement('span');
      badge.className = `palace-marker ${marker.type}${marker.text.length > 5 ? ' long' : ''}`;
      badge.textContent = traditionalize(marker.text);
      badge.title = traditionalize(marker.title);
      markers.append(badge);
    });
    cell.append(head, name);
    if (index === lifePalaceIndex) {
      cell.classList.add('life-palace');
    }
    if (hexagram) cell.append(hexagram);
    cell.append(layers, markers);
    const roles = getNatalPalaceRoles(natalBase, index);
    const ageRange = ageRanges.get(index);
    if (roles.length || ageRange) {
      const roleSection = document.createElement('div');
      roleSection.className = 'palace-roles';
      if (ageRange) {
        const age = document.createElement('span');
        age.className = 'palace-age';
        age.textContent = ageRange;
        age.title = traditionalize('年龄段：从出生年支对应宫起，顺时针每宫十年');
        roleSection.append(age);
      }
      if (roles.length) {
        const roleList = document.createElement('div');
        roleList.className = 'palace-role-list';
        roles.forEach((role) => {
          const item = document.createElement('span');
          item.className = 'palace-role';
          item.textContent = traditionalize(role);
          item.title = traditionalize(`${role}宫`);
          roleList.append(item);
        });
        roleSection.append(roleList);
        cell.classList.add('has-roles');
      }
      cell.append(roleSection);
    }
    grid.append(cell);
  });
}

function getPalaceHexagram(chart, palaceIndex) {
  const starName = simplify(chart.九星?.[palaceIndex]);
  const doorName = simplify(chart.天門?.[palaceIndex]);
  const upperNumber = NINE_STAR_TRIGRAM_NUMBERS[starName];
  const lowerNumber = EIGHT_DOOR_TRIGRAM_NUMBERS[doorName];
  const flyingNumber = chart.紫白飛星?.[palaceIndex];
  if (!upperNumber || !lowerNumber || !flyingNumber) return null;

  const upperTrigram = HEXAGRAM_TRIGRAM_BY_NUMBER[upperNumber];
  const lowerTrigram = HEXAGRAM_TRIGRAM_BY_NUMBER[lowerNumber];
  const lines = `${HEXAGRAM_TRIGRAM_LINES[lowerTrigram]}${HEXAGRAM_TRIGRAM_LINES[upperTrigram]}`;
  const sum = upperNumber + lowerNumber + flyingNumber;
  const movingLine = sum % 6 || 6;
  const changedLines = [...lines];
  changedLines[movingLine - 1] = changedLines[movingLine - 1] === '1' ? '0' : '1';
  const mutualLower = HEXAGRAM_NUMBER_BY_LINES[lines.slice(1, 4)];
  const mutualUpper = HEXAGRAM_NUMBER_BY_LINES[lines.slice(2, 5)];
  const changedLower = HEXAGRAM_NUMBER_BY_LINES[changedLines.slice(0, 3).join('')];
  const changedUpper = HEXAGRAM_NUMBER_BY_LINES[changedLines.slice(3, 6).join('')];
  const trigramIndex = (trigram) => HEXAGRAM_TRIGRAM_ORDER.indexOf(trigram);
  const getName = (upper, lower) => HEXAGRAM_NAMES[trigramIndex(lower)]?.[trigramIndex(upper)] || '';

  return {
    upperNumber,
    lowerNumber,
    upperTrigram,
    lowerTrigram,
    flyingNumber,
    sum,
    movingLine,
    lines,
    name: getName(upperTrigram, lowerTrigram),
    mutualName: getName(mutualUpper, mutualLower),
    changedName: getName(changedUpper, changedLower),
  };
}

function renderFlightCharts(charts) {
  const container = document.querySelector('#flight-grid');
  container.replaceChildren();
  const overlapCounts = PALACES.map((_, index) => {
    const counts = new Map();
    charts.forEach((chart) => {
      const starNumber = Number(chart.九宮星?.[index]);
      if (CIRCLED_FLYING_STAR_NUMBERS.has(starNumber)) {
        counts.set(starNumber, (counts.get(starNumber) || 0) + 1);
      }
    });
    return counts;
  });

  charts.forEach((chart) => {
    const panel = document.createElement('section');
    panel.className = 'flight-panel';
    const panelHeading = document.createElement('div');
    panelHeading.className = 'flight-panel-heading';
    const title = document.createElement('span');
    title.className = 'flight-panel-title';
    title.textContent = traditionalize(chart.盤型);
    const meta = document.createElement('span');
    meta.className = 'flight-panel-meta';
    meta.textContent = traditionalize(`中宮${FLYING_STAR_NAMES[chart.中宮]} · ${chart.飛向}`);
    panelHeading.append(title, meta);

    const grid = document.createElement('div');
    grid.className = 'flight-palace-grid';
    PALACES.forEach((palace, index) => {
      const cell = document.createElement('div');
      cell.className = `flight-palace${index === 4 ? ' center' : ''}`;
      cell.dataset.element = PALACE_ELEMENTS[Number(palace.number)];
      const heading = document.createElement('div');
      heading.className = 'flight-palace-header';
      const gua = document.createElement('span');
      gua.className = 'flight-gua';
      gua.textContent = palace.number === '5' ? '中' : ({ 1: '☵', 2: '☷', 3: '☳', 4: '☴', 6: '☰', 7: '☱', 8: '☶', 9: '☲' })[palace.number];
      const number = document.createElement('span');
      number.textContent = palace.number;
      heading.append(gua, number);
      const name = document.createElement('div');
      name.className = 'flight-palace-name';
      name.textContent = traditionalize(palace.name);
      const starNumber = Number(chart.九宮星[index]);
      const overlapCount = overlapCounts[index].get(starNumber) || 0;
      const star = document.createElement('div');
      star.className = `flight-star-value${CIRCLED_FLYING_STAR_NUMBERS.has(starNumber) ? ' highlighted' : ''}${overlapCount > 1 ? ' overlapped' : ''}`;
      star.textContent = chart.九宮星[index];
      if (overlapCount > 1) star.title = `${starNumber} 同宫叠见${overlapCount}盘`;
      const starName = document.createElement('div');
      starName.className = 'flight-star-name';
      starName.textContent = traditionalize(FLYING_STAR_NAMES[chart.九宮星[index]]);
      cell.append(heading, name, star, starName);
      grid.append(cell);
    });
    panel.append(panelHeading, grid);
    container.append(panel);
  });
}

function getValueDoorPalaceLabel(chart) {
  const valueDoor = simplify(chart.值使);
  const index = chart.天門?.findIndex((door) => simplify(door) === valueDoor) ?? -1;
  const palace = PALACES[index];
  if (palace) return palace.number === '5' ? palace.name : `${palace.direction}${palace.name}`;
  return chart.值使落宮 || '—';
}

function renderHub(chart) {
  const container = document.querySelector('#hub-list');
  container.replaceChildren();
  [
    ['旬首', chart.旬首],
    ['符首', chart.符首],
    ['值符', `${chart.值符 || '—'}${chart.值符落宮 ? ` · ${chart.值符落宮}` : ''}`],
    ['值使', `${chart.值使 || '—'} · ${getValueDoorPalaceLabel(chart)}`],
  ].forEach(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'hub-item';
    const title = document.createElement('span');
    title.className = 'hub-label';
    title.textContent = traditionalize(label);
    const content = document.createElement('span');
    content.className = 'hub-value';
    content.textContent = traditionalize(value);
    item.append(title, content);
    container.append(item);
  });
}

function renderInsights(chart) {
  const container = document.querySelector('#formation-list');
  container.replaceChildren();
  const formations = chart.格局列表 || [];
  container.closest('.insight-block').hidden = false;

  if (formations.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'formation-empty';
    empty.textContent = '—';
    container.append(empty);
  } else {
    formations.forEach((formation) => {
      const chip = document.createElement('span');
      chip.className = 'formation-chip';
      if (formation.吉凶) chip.dataset.luck = formation.吉凶;
      chip.title = traditionalize(formation.細節 || formation.格);
      const name = document.createElement('span');
      name.textContent = traditionalize(formation.格);
      chip.append(name);
      if (formation.讀法) {
        const reading = document.createElement('span');
        reading.className = 'formation-reading';
        reading.textContent = traditionalize(formation.讀法.split('（')[0]);
        chip.append(reading);
      }
      if (formation.宮) {
        const place = document.createElement('span');
        place.className = 'formation-place';
        place.textContent = traditionalize(`${formation.宮}宫`);
        chip.append(place);
      }
      container.append(chip);
    });
  }

  document.querySelector('#tianyi-value').textContent = traditionalize(chart.天乙 || '—');
}

function resolvePredictionReference(chart, reference) {
  let layers = [];
  let values = [];
  let palaceIndex = -1;
  const specialMatches = [];
  if (reference.kind === 'pillarStem') {
    values = [simplify(chart[reference.pillar]?.[0])];
    layers = ['heaven'];
  } else if (reference.kind === 'pillarStemLayer') {
    values = [simplify(chart[reference.pillar]?.[0])];
    layers = [reference.layer === 'earth' ? 'heaven' : reference.layer];
  } else if (reference.kind === 'pillarStemPalaceLayers') {
    values = [simplify(chart[reference.pillar]?.[0])];
    const targetIndex = chart.天盤?.findIndex((value) => values.includes(simplify(value))) ?? -1;
    if (targetIndex >= 0) {
      specialMatches.push({ palaceIndex: targetIndex, layer: 'heaven' });
      const fields = { star: '九星', door: '天門' };
      reference.layers.forEach((layer) => {
        const value = simplify(chart[fields[layer]]?.[targetIndex]);
        if (value && value !== '—') {
          values.push(value);
          specialMatches.push({ palaceIndex: targetIndex, layer: layer === 'door' ? 'heaven' : layer });
        }
      });
    }
  } else if (reference.kind === 'pillarStemOriginalPalace') {
    const yearStem = simplify(chart[reference.pillar]?.[0]);
    const originIndex = chart.地盤?.findIndex((value) => simplify(value) === yearStem) ?? -1;
    if (originIndex >= 0) {
      const skyStem = simplify(chart.天盤?.[originIndex]);
      values = [yearStem, skyStem];
      specialMatches.push({ palaceIndex: originIndex, layer: 'heaven' });
    }
  } else if (reference.kind === 'xunHead') {
    const timePillar = simplify(chart['時柱']);
    const cycleIndex = GANZHI_CYCLE.indexOf(timePillar);
    if (cycleIndex >= 0) {
      const xunHead = GANZHI_CYCLE[Math.floor(cycleIndex / 10) * 10];
      const hiddenStem = XUN_FU_SHOU[xunHead];
      const originIndex = chart.地盤?.findIndex((value) => simplify(value) === hiddenStem) ?? -1;
      if (originIndex >= 0) {
        const heavenStem = simplify(chart.天盤?.[originIndex]);
        values = [xunHead, hiddenStem, heavenStem].filter((value) => value && value !== '—');
        specialMatches.push({ palaceIndex: originIndex, layer: 'heaven' });
      }
    }
  } else if (reference.kind === 'directionStem') {
    const directionIndex = PALACES.findIndex(({ number }) => Number(number) === Number(predictionDirectionInput.value));
    const skyStem = simplify(chart.天盤?.[directionIndex]);
    values = skyStem && skyStem !== '—' ? [skyStem] : [];
    if (directionIndex >= 0 && values.length) specialMatches.push({ palaceIndex: directionIndex, layer: 'heaven' });
  } else if (reference.kind === 'directionStar') {
    const directionIndex = PALACES.findIndex(({ number }) => Number(number) === Number(predictionDirectionInput.value));
    const star = simplify(chart.九星?.[directionIndex]);
    values = star && star !== '—' ? [star] : [];
    if (directionIndex >= 0 && values.length) specialMatches.push({ palaceIndex: directionIndex, layer: 'star' });
  } else if (reference.kind === 'lifeDoorPalaceStems') {
    const lifeDoorIndex = chart.天門?.findIndex((value) => simplify(value) === '生门') ?? -1;
    if (lifeDoorIndex >= 0) {
      const heavenStem = simplify(chart.天盤?.[lifeDoorIndex]);
      const earthStem = simplify(chart.地盤?.[lifeDoorIndex]);
      values = ['生门', heavenStem, earthStem].filter((value) => value && value !== '—');
      specialMatches.push({ palaceIndex: lifeDoorIndex, layer: 'heaven' });
    }
  } else if (reference.kind === 'yima') {
    const dayBranch = simplify(chart.日柱).slice(-1);
    const yimaBranch = YIMA_BRANCHES[dayBranch];
    const palaceNumber = VOID_BRANCH_PALACES[yimaBranch];
    palaceIndex = PALACES.findIndex(({ number }) => Number(number) === palaceNumber);
    if (yimaBranch && palaceIndex >= 0) {
      values = [`驿马（${yimaBranch}）`];
      specialMatches.push({ palaceIndex, layer: null });
    }
  } else if (reference.kind === 'patternList') {
    values = (chart.格局列表 || [])
      .filter(({ 格 }) => ['伏吟', '反吟'].includes(simplify(格)))
      .map(({ 格 }) => simplify(格));
    if (values.length === 0) values = ['未見伏吟或反吟'];
  } else if (reference.kind === 'openDoorVoid') {
    const openDoorIndex = chart.天門?.findIndex((door) => simplify(door) === '开门') ?? -1;
    if (openDoorIndex >= 0) {
      const palaceNumber = Number(PALACES[openDoorIndex].number);
      const voidBranches = [...getVoidBranches(chart.日柱), ...getVoidBranches(chart.時柱)];
      const isVoid = voidBranches.some((branch) => VOID_BRANCH_PALACES[branch] === palaceNumber);
      values = [isVoid ? '空亡' : '未空'];
      specialMatches.push({ palaceIndex: openDoorIndex, layer: null });
    }
  } else if (reference.kind === 'stem') {
    values = [simplify(reference.value)];
    layers = ['heaven'];
  } else if (reference.kind === 'selectedStem') {
    values = [simplify(predictionPersonStemInput.value)];
    layers = ['heaven'];
  } else if (reference.kind === 'valueDoor') {
    values = [simplify(chart.值使)];
    layers = ['door'];
  } else if (reference.kind === 'layerAtPalace') {
    layers = [reference.layer];
    palaceIndex = PALACES.findIndex(({ number }) => Number(number) === reference.palaceNumber);
    const field = { heaven: '天盤', earth: '地盤', star: '九星', door: '天門', god: '八神' }[reference.layer];
    if (palaceIndex >= 0) values = [simplify(chart[field]?.[palaceIndex])];
  } else if (reference.kind === 'palace') {
    palaceIndex = PALACES.findIndex(({ number }) => Number(number) === reference.palaceNumber);
  } else if (reference.kind === 'tianyi') {
    const tianyi = simplify(chart.天乙);
    palaceIndex = PALACES.findIndex(({ name }) => tianyi.includes(simplify(name)));
    values = chart.天乙 ? [traditionalize(chart.天乙)] : [];
  } else if (reference.kind === 'layer') {
    values = [simplify(reference.value)];
    layers = [reference.layer];
  } else if (['star', 'door', 'god'].includes(reference.kind)) {
    values = [simplify(reference.value)];
    layers = [reference.kind];
  }

  const matches = [...specialMatches];
  if (palaceIndex >= 0) matches.push({ palaceIndex, layer: null });
  const fields = { heaven: '天盤', earth: '地盤', star: '九星', door: '天門', god: '八神' };
  layers.forEach((layer) => {
    const field = fields[layer];
    chart[field]?.forEach((value, index) => {
      if (values.includes(simplify(value))) {
        matches.push({ palaceIndex: index, layer: layer === 'door' || layer === 'earth' ? 'heaven' : layer });
      }
    });
  });
  return { values: values.filter((value) => value && value !== '—'), matches };
}

function renderPrediction(chart) {
  const section = document.querySelector('#prediction-section');
  const list = document.querySelector('#prediction-list');
  document.querySelectorAll('.prediction-use').forEach((element) => {
    element.classList.remove('prediction-use');
  });
  const topic = PREDICTION_TOPICS[predictionTopicInput.value];
  if (!chart || chart.盤型 !== '时盘' || chartTypeInput.value !== 'shijia' || !topic) {
    section.hidden = true;
    list.replaceChildren();
    return;
  }

  section.hidden = false;
  document.querySelector('#prediction-topic-label').textContent = traditionalize(topic.label);
  list.replaceChildren();
  topic.references.forEach((reference) => {
    const resolved = resolvePredictionReference(chart, reference);
    const row = document.createElement('div');
    row.className = 'prediction-reference';
    const target = document.createElement('strong');
    target.className = 'prediction-reference-symbol';
    target.textContent = traditionalize(reference.symbol);
    const role = document.createElement('span');
    role.className = 'prediction-reference-role';
    role.textContent = traditionalize(reference.role);
    const current = document.createElement('small');
    current.className = 'prediction-reference-current';
    const positions = [...new Set(resolved.matches.map(({ palaceIndex }) => {
      const palaceName = PALACE_NAMES[Number(PALACES[palaceIndex]?.number)];
      return palaceName ? `${palaceName}宫` : '';
    }))].filter(Boolean);
    current.textContent = [resolved.values.join('、'), positions.join('、')].filter(Boolean).join(' · ');
    if (resolved.matches.length === 0 && reference.kind !== 'patternList') {
      current.textContent = traditionalize(reference.kind === 'selectedStem' && !predictionPersonStemInput.value
        ? '请选择年命天干'
        : ['directionStem', 'directionStar'].includes(reference.kind) && !predictionDirectionInput.value
          ? '请选择方向'
        : '此盘未排出对应用神');
    }
    row.append(target, role, current);
    list.append(row);

    resolved.matches.forEach(({ palaceIndex, layer }) => {
      const palace = document.querySelectorAll('.palace')[palaceIndex];
      if (!palace) return;
      palace.querySelector(`.layer.${layer || 'heaven'}`)?.classList.add('prediction-use');
    });
  });
}

function renderChart(chart, datetime, lunarDate) {
  lastRenderedChart = chart;
  const year = datetime.slice(0, 4);
  const month = Number(datetime.slice(4, 6));
  const day = Number(datetime.slice(6, 8));
  const hour = Number(datetime.slice(8, 10));
  const dateLabel = chart.盤型 === '年盘'
    ? `${year} 年 · 年家盘`
    : chart.盤型 === '月盘'
      ? `${year} 年 ${month} 月 · 月家盘（${chart.月柱 || '节气月'}）`
      : chart.盤型 === '日盘'
        ? `${year} 年 ${month} 月 ${day} 日 · 日家盘`
        : `${year} 年 ${month} 月 ${day} 日 · ${hourLabel(hour)}`;
  document.querySelector('#chart-date-label').textContent = traditionalize(dateLabel);
  const lunarLabel = document.querySelector('#lunar-date-label');
  lunarLabel.textContent = traditionalize(lunarDate);
  lunarLabel.hidden = !lunarDate;
  const eyebrowLead = chart.盤型 === '年盘' ? '年家盘' : chart.節氣 || chart.盤型 || '时盘';
  document.querySelector('#result-eyebrow').textContent = traditionalize(`${eyebrowLead} · ${chart.三元 || '三元未明'}`);
  document.querySelector('#result-title').textContent = traditionalize(`${chart.陰陽 || ''}遁${chart.局數 || ''}局`);
  document.querySelector('#method-tag').textContent = traditionalize(chart.盤型 || `${chart.定局法 || DEFAULT_JU_METHOD}法`);
  document.querySelector('#plate-stamp').textContent = traditionalize(chart.盤型 === '命盘' ? '生辰 · 时家转盘' : `${chart.盤型 || '时盘'} · 转盘`);

  const pillars = document.querySelector('#pillars');
  pillars.replaceChildren(
    makePillar('年柱', chart.年柱),
    makePillar('月柱', chart.月柱),
    makePillar('日柱', chart.日柱),
    makePillar('时柱', chart.時柱),
  );
  renderPalaces(chart);
  renderPrediction(chart);
  renderSevenStarLamp(chart);
  renderHub(chart);
  renderInsights(chart);
  const sourceNote = document.querySelector('#source-note');
  sourceNote.textContent = traditionalize(chart.展示說明 || '');
  sourceNote.hidden = !chart.展示說明;
  errorMessage.hidden = true;
  emptyState.hidden = true;
  result.hidden = false;
}

async function generateChart(event) {
  event?.preventDefault();
  if (event) shiftStepsInput.value = '0';
  errorMessage.hidden = true;

  const monthOnly = chartTypeInput.value === 'yuejia';
  const yearOnly = chartTypeInput.value === 'nianjia';
  const yearValue = Number(yearInput.value);
  if (yearOnly && !(Number.isInteger(yearValue) && yearValue >= 1900 && yearValue <= 2100)) {
    errorMessage.textContent = traditionalize('请输入 1900–2100 之间的公历年份。');
    errorMessage.hidden = false;
    return;
  }
  if (!yearOnly && (monthOnly ? !monthInput.value : !dateInput.value)) {
    errorMessage.textContent = traditionalize(monthOnly ? '请先选择公历月份。' : '请先选择公历日期。');
    errorMessage.hidden = false;
    return;
  }
  if (!window.Qimen?.generateChartByDatetime || !window.Qimen?.chartToObject) {
    errorMessage.textContent = traditionalize('排盘引擎未能载入。请检查网络连接后刷新页面。');
    errorMessage.hidden = false;
    return;
  }

  // 年盘取6月15日、月盘取当月15日正午，均避开节气交接。
  const [year, month, day] = yearOnly
    ? [String(yearValue), '06', '15']
    : monthOnly ? [...monthInput.value.split('-'), '15'] : dateInput.value.split('-');
  const chartType = chartTypeInput.value;
  const selectedHour = monthOnly || yearOnly ? 12 : Number(hourInput.value);
  const datetime = `${year}${month}${day}${pad(selectedHour)}`;
  const usesMonthlyScan = chartType === 'mingpan' && (travelInput.checked || personalThreeVictoryInput.checked);
  const usesEightGodScan = chartType === 'mingpan' && eightGodInput.checked;
  const scanMonth = usesMonthlyScan ? travelMonthInput.value : '';
  const eightGodMonth = usesEightGodScan ? eightGodMonthInput.value : '';
  if (usesMonthlyScan && hasGeneratedNatalChart && !scanMonth) {
    errorMessage.textContent = traditionalize('请选择要扫描的月份。');
    errorMessage.hidden = false;
    return;
  }
  if (usesEightGodScan && hasGeneratedNatalChart && !eightGodMonth) {
    errorMessage.textContent = traditionalize('请选择启动八神要扫描的月份。');
    errorMessage.hidden = false;
    return;
  }

  try {
    await loadTraditionalizer();
    const chart = await generateByChartType(chartType, datetime);
    const flightCharts = await generateFlightCharts(datetime);
    const flightName = ({ 年盘: '年飛星', 月盘: '月飛星', 日盘: '日飛星' })[chart.盤型] ?? '時飛星';
    const matchedFlight = flightCharts.find(({ 盤型 }) => 盤型 === flightName);
    if (matchedFlight) {
      chart.紫白飛星 = matchedFlight.九宮星;
      chart.紫白盤名 = traditionalize(matchedFlight.盤型);
    }
    const lunarDate = await formatLunarDate(datetime, chart);
    renderChart(chart, datetime, lunarDate);
    await renderStarDayGuidance(datetime, chart);
    hasGeneratedNatalChart = chartType === 'mingpan';
    updateChartTypeControls();
    const monthlyMatches = scanMonth ? await findMonthlyTravelDates(scanMonth, selectedHour, chart) : [];
    const monthlyGuidance = scanMonth && travelInput.checked ? await getMonthlyTravelGuidance(scanMonth) : [];
    renderTravelMonth(scanMonth, monthlyMatches, personalThreeVictoryInput.checked ? 'personalThreeVictory' : 'travel', monthlyGuidance);
    const eightGodMatches = eightGodMonth
      ? await getEightGodActivationDates(eightGodMonth, selectedHour, eightGodTargetInput.value)
      : [];
    renderEightGodActivation(eightGodMonth, eightGodTargetInput.value, eightGodMatches);
    renderFlightCharts(flightCharts);
  } catch (error) {
    errorMessage.textContent = traditionalize(error instanceof Error ? error.message : '起盘失败，请检查输入。');
    errorMessage.hidden = false;
    result.hidden = true;
    emptyState.hidden = true;
  }
}

populateHours();
setDefaults();
travelMonthInput.value = dateInput.value.slice(0, 7);
eightGodMonthInput.value = dateInput.value.slice(0, 7);
form.addEventListener('submit', generateChart);
chartTypeInput.addEventListener('change', () => resetOutputAndInputs(chartTypeInput.value));
predictionTopicInput.addEventListener('change', () => {
  updateChartTypeControls();
  renderPrediction(lastRenderedChart);
});
predictionDirectionInput.addEventListener('change', () => renderPrediction(lastRenderedChart));
predictionPersonStemInput.addEventListener('change', () => renderPrediction(lastRenderedChart));
travelInput.addEventListener('change', () => {
  updateChartTypeControls();
  document.querySelector('#travel-month-section').hidden = true;
  document.querySelector('#seven-star-section').hidden = true;
  if (hasGeneratedNatalChart) generateChart();
});
eightGodInput.addEventListener('change', () => {
  updateChartTypeControls();
  document.querySelector('#travel-month-section').hidden = true;
  document.querySelector('#eight-god-section').hidden = true;
  document.querySelector('#seven-star-section').hidden = true;
  if (hasGeneratedNatalChart) generateChart();
});
personalThreeVictoryInput.addEventListener('change', () => {
  updateChartTypeControls();
  document.querySelector('#travel-month-section').hidden = true;
  document.querySelector('#seven-star-section').hidden = true;
  if (hasGeneratedNatalChart) generateChart();
});
travelMonthInput.addEventListener('change', () => {
  if (chartTypeInput.value === 'mingpan'
    && (travelInput.checked || personalThreeVictoryInput.checked)
    && hasGeneratedNatalChart) generateChart();
});
eightGodMonthInput.addEventListener('change', () => {
  if (chartTypeInput.value === 'mingpan' && eightGodInput.checked && hasGeneratedNatalChart) generateChart();
});
eightGodTargetInput.addEventListener('change', () => {
  if (chartTypeInput.value === 'mingpan' && eightGodInput.checked && hasGeneratedNatalChart) generateChart();
});
shiftInput.addEventListener('change', () => {
  updateChartTypeControls();
  document.querySelector('#travel-month-section').hidden = true;
});
shiftStepsInput.addEventListener('change', () => {
  document.querySelector('#travel-month-section').hidden = true;
});
function shiftSelectedPalace(direction) {
  const currentSteps = Number(shiftStepsInput.value);
  const nextSteps = (currentSteps + direction + SHIFT_RING.length) % SHIFT_RING.length;
  shiftStepsInput.value = String(nextSteps);
  generateChart();
}

previousShiftButton.addEventListener('click', () => shiftSelectedPalace(-1));
nextShiftButton.addEventListener('click', () => shiftSelectedPalace(1));
updateChartTypeControls();
loadTraditionalizer();
document.querySelector('#now-button').addEventListener('click', () => {
  setDefaults();
  generateChart();
});
function resetOutputAndInputs(chartType) {
  form.reset();
  if (chartType) chartTypeInput.value = chartType;
  setDefaults();
  travelMonthInput.value = dateInput.value.slice(0, 7);
  eightGodMonthInput.value = dateInput.value.slice(0, 7);
  hasGeneratedNatalChart = false;
  lastRenderedChart = null;
  errorMessage.hidden = true;
  result.hidden = true;
  emptyState.hidden = false;
  document.querySelector('#chart-date-label').textContent = traditionalize('等待起盘');
  document.querySelector('#lunar-date-label').hidden = true;
  document.querySelector('#plate-stamp').textContent = traditionalize('时家 · 转盘');
  document.querySelector('#travel-month-section').hidden = true;
  document.querySelector('#seven-star-section').hidden = true;
  document.querySelector('#eight-god-section').hidden = true;
  document.querySelector('#flight-grid').replaceChildren();
  renderPrediction(null);
  updateChartTypeControls();
}

document.querySelector('#clear-button').addEventListener('click', () => resetOutputAndInputs());
document.querySelector('#previous-year-button').addEventListener('click', () => shiftSelectedYear(-1));
document.querySelector('#next-year-button').addEventListener('click', () => shiftSelectedYear(1));
document.querySelector('#previous-month-button').addEventListener('click', () => shiftSelectedMonth(-1));
document.querySelector('#next-month-button').addEventListener('click', () => shiftSelectedMonth(1));
document.querySelector('#previous-date-button').addEventListener('click', () => shiftSelectedDate(-1));
document.querySelector('#next-date-button').addEventListener('click', () => shiftSelectedDate(1));
function shiftSelectedShichen(direction) {
  const currentHour = Number(hourInput.value);
  const currentBranch = branchForHour(currentHour);
  const branchIndex = BRANCHES.findIndex(([branch]) => branch === currentBranch);
  if (branchIndex < 0) return;

  let nextHour;
  let dayOffset = 0;

  if (direction > 0 && currentBranch === '子') {
    nextHour = 1;
    if (currentHour === 23) dayOffset = 1;
  } else if (direction > 0 && currentBranch === '亥') {
    nextHour = 23;
  } else if (direction < 0 && currentBranch === '子') {
    nextHour = 21;
    if (currentHour === 0) dayOffset = -1;
  } else if (direction > 0) {
    nextHour = BRANCHES[branchIndex + 1][1];
  } else {
    nextHour = BRANCHES[branchIndex - 1][1];
  }

  if (dayOffset && !setSelectedDateOffset(dayOffset)) return;

  hourInput.value = String(nextHour);
  generateChart();
}

document.querySelector('#previous-shichen-button').addEventListener('click', () => shiftSelectedShichen(-1));
document.querySelector('#next-shichen-button').addEventListener('click', () => shiftSelectedShichen(1));

if (window.Qimen?.generateChartByDatetime) {
  engineStatus.textContent = traditionalize('排盘引擎已就绪');
  engineStatus.dataset.state = 'ready';
} else {
  engineStatus.textContent = traditionalize('排盘引擎连接中断');
  engineStatus.dataset.state = 'error';
}

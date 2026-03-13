// 明日方舟界园肉鸽伤害计算器 - 核心计算逻辑
// 原 Python 版本由 @云音梦歌 制作，Web 版移植

export interface CalcVars {
  敌人防御: number;
  敌人法抗: number;
  减伤: number;
  物法减伤: number;
  局外: number;
  局内: number;
  攻速: number;
  源石锭: number;
  物伤: number;
  法伤: number;
  真伤: number;
  术士法伤: number;
  元素伤害: number;
  浮空伤害: number;
  化物伤害: number;
  远距离: number;
  近距离: number;
  远程: number;
  近战: number;
  重装局外: number;
  近卫局外: number;
  近卫攻速: number;
  狙击局外: number;
  狙击攻速: number;
  术士局外: number;
  术士攻速: number;
  白值: number;
  脆弱: number;
  起飞伤害: number;
  爆条速度: number;
}

export const VAR_DEFAULTS: CalcVars = {
  敌人防御: 0,
  敌人法抗: 0,
  减伤: 0.9,
  物法减伤: 1.0,
  局外: 1.26,
  局内: 1.0,
  攻速: 100,
  源石锭: 0,
  物伤: 1.0,
  法伤: 1.0,
  真伤: 1.0,
  术士法伤: 1.0,
  元素伤害: 1.0,
  浮空伤害: 1.0,
  化物伤害: 1.0,
  远距离: 1.0,
  近距离: 1.0,
  远程: 0,
  近战: 0,
  重装局外: 0,
  近卫局外: 0,
  近卫攻速: 0,
  狙击局外: 0,
  狙击攻速: 0,
  术士局外: 0,
  术士攻速: 0,
  白值: 0,
  脆弱: 1.0,
  起飞伤害: 1.0,
  爆条速度: 1.0,
};

export interface UserInputs {
  // 基础输入
  敌人防御: number;
  敌人法抗: number;
  局外攻击: number;
  局内攻击: number;
  攻速加成: number;
  源石锭数目: number;
  身形数量: number;
  脆弱加成: number;
  // 领袖
  领袖: boolean;
  // 防御修正
  不赦: boolean;
  无封长盒: boolean;
  残破合影: boolean;
  迷迭香之拥: boolean;
  同时出现: boolean;
  // 局外攻击藏品
  剑锤: boolean;
  源石祭坛: boolean; 源石祭坛_n: number;
  登天斧: boolean; 登天斧_n: number;
  酿山河: boolean; 酿山河_n: number;
  兵锋: boolean; 兵锋_n: number;
  铿金征鼓: boolean; 铿金征鼓_n: number;
  家常小炒: boolean; 家常小炒_n: number;
  得胜琴: boolean; 得胜琴_n: number;
  // 局内攻击
  古乔治营养原浆: boolean;
  后土残片: boolean;
  封神令: boolean;
  岁衡: boolean;
  岁花: boolean; 岁花_n: number;
  契心聆铃: boolean; 契心聆铃_n: number;
  // 攻速
  飞陀客运: boolean; 飞陀客运_n: number;
  金酒之杯: boolean;
  // 增伤
  讴歌者面纱: boolean;
  灾难之源: boolean;
  复仇者: boolean;
  璀璨悲泣: boolean;
  文明的存续: boolean;
  // 特殊
  阿猛: boolean;
  奴隶猎捕器: boolean;
  万星源之辉: boolean;
  见历: boolean;
  Scout的狙击镜: boolean; Scout的狙击镜_n: number;
  Blaze的电锯: boolean; Blaze的电锯_n: number;
  // 通宝
  火机: boolean;
  遇良弈: boolean;
  武人之争: boolean; 武人之争_n: number;
  贵有衡: boolean; 贵有衡_n: number;
  柳伥作: boolean;
  志欲遂: boolean; 志欲遂_n: number;
  火上之灶: boolean;
  左秉烛: boolean; 左秉烛_n: number;
  // 其余
  皮特水果什锦: boolean;
  凉拌海草: boolean;
  橙味风暴: boolean;
  咖啡平原咖啡糖: boolean;
  尖叫樱桃: boolean;
  古旧乐谱残章: boolean;
  解约协议: boolean;
  显圣吊坠: boolean;
  皇帝的恩宠: boolean;
  损坏的左轮弹巢: boolean;
  老近卫军之锋: boolean;
  // 职业特殊
  铁卫_侵掠: boolean;
  折戟_破釜沉舟: boolean;
  残弩_百步穿杨: boolean;
  残弩_交叉火力: boolean;
  残弩_神速: boolean;
  断杖_织法者: boolean;
  断杖_苦难巫咒: boolean;
  // 烧火棍
  烧火棍: boolean;
}

export const DEFAULT_INPUTS: UserInputs = {
  敌人防御: 0, 敌人法抗: 0, 局外攻击: 0, 局内攻击: 0,
  攻速加成: 0, 源石锭数目: 0, 身形数量: 0, 脆弱加成: 0,
  领袖: true,
  不赦: false, 无封长盒: false, 残破合影: false, 迷迭香之拥: false, 同时出现: false,
  剑锤: false,
  源石祭坛: false, 源石祭坛_n: 0,
  登天斧: false, 登天斧_n: 0,
  酿山河: false, 酿山河_n: 0,
  兵锋: false, 兵锋_n: 0,
  铿金征鼓: false, 铿金征鼓_n: 0,
  家常小炒: false, 家常小炒_n: 0,
  得胜琴: false, 得胜琴_n: 0,
  古乔治营养原浆: false, 后土残片: false, 封神令: false,
  岁衡: false, 岁花: false, 岁花_n: 0, 契心聆铃: false, 契心聆铃_n: 0,
  飞陀客运: false, 飞陀客运_n: 0, 金酒之杯: false,
  讴歌者面纱: false, 灾难之源: false, 复仇者: false, 璀璨悲泣: false, 文明的存续: false,
  阿猛: false, 奴隶猎捕器: false, 万星源之辉: false, 见历: false,
  Scout的狙击镜: false, Scout的狙击镜_n: 0,
  Blaze的电锯: false, Blaze的电锯_n: 0,
  火机: false, 遇良弈: false,
  武人之争: false, 武人之争_n: 0,
  贵有衡: false, 贵有衡_n: 0,
  柳伥作: false,
  志欲遂: false, 志欲遂_n: 0,
  火上之灶: false,
  左秉烛: false, 左秉烛_n: 0,
  皮特水果什锦: false, 凉拌海草: false, 橙味风暴: false,
  咖啡平原咖啡糖: false, 尖叫樱桃: false, 古旧乐谱残章: false,
  解约协议: false, 显圣吊坠: false, 皇帝的恩宠: false,
  损坏的左轮弹巢: false, 老近卫军之锋: false,
  铁卫_侵掠: false, 折戟_破釜沉舟: false,
  残弩_百步穿杨: false, 残弩_交叉火力: false, 残弩_神速: false,
  断杖_织法者: false, 断杖_苦难巫咒: false,
  烧火棍: false,
};

export interface BaseAttacks {
  玛恩纳: number; 赤刃明霄陈: number; 史尔特尔: number; 锏: number; 艾丽妮: number;
  逻各斯: number; 圣聆初雪: number; 霍尔海雅: number; 斩业星熊: number;
  望: number; 新约能天使: number; 琳琅诗怀雅: number; 麒麟R夜刀: number;
  空弦: number; 维什戴尔: number; 迷迭香: number; Mon3tr: number;
}

export const DEFAULT_BASE_ATTACKS: BaseAttacks = {
  玛恩纳: 420, 赤刃明霄陈: 930, 史尔特尔: 832, 锏: 735, 艾丽妮: 766,
  逻各斯: 821, 圣聆初雪: 991, 霍尔海雅: 803, 斩业星熊: 802,
  望: 729, 新约能天使: 843, 琳琅诗怀雅: 945, 麒麟R夜刀: 703,
  空弦: 673, 维什戴尔: 842, 迷迭香: 838, Mon3tr: 623,
};

export interface SkillResult {
  name: string;
  total: number;
  dps?: number;
  fire?: number;
  fireDps?: number;
  extra?: { label: string; value: number }[];
}

export interface RoleResult {
  role: string;
  group: string;
  skills: SkillResult[];
}

/** 将用户输入转换为内部变量对象 */
export function computeVars(inputs: UserInputs): CalcVars {
  const v: CalcVars = { ...VAR_DEFAULTS };

  // 基础输入
  const baseDef = inputs.敌人防御;
  v.敌人法抗 += inputs.敌人法抗;
  v.局外 += inputs.局外攻击 / 100;
  v.局内 += inputs.局内攻击 / 100;
  v.攻速 += inputs.攻速加成;
  v.源石锭 += inputs.源石锭数目;
  v.物法减伤 *= Math.pow(0.5, inputs.身形数量);
  v.脆弱 += inputs.脆弱加成 / 100;

  // 敌方防御修正
  let defMult = 1.0;
  if (inputs.不赦) defMult *= 1.5;
  if (inputs.无封长盒) defMult *= 1.3;
  if (inputs.残破合影) defMult *= 0.92;
  if (inputs.迷迭香之拥) defMult *= 0.8;
  if (inputs.同时出现) defMult *= 1.2;
  v.敌人防御 = baseDef * defMult;

  // 领袖
  if (inputs.领袖) v.减伤 -= 0.1;

  // 局外攻击
  if (inputs.剑锤) v.局外 += 0.2;
  if (inputs.源石祭坛) v.局外 += inputs.源石祭坛_n * 0.05;
  if (inputs.登天斧) v.局外 += 0.6 - inputs.登天斧_n * 0.3;
  if (inputs.酿山河) v.局外 += inputs.酿山河_n * 0.1;
  if (inputs.兵锋) v.局外 += inputs.兵锋_n * 0.1;
  if (inputs.铿金征鼓) v.局外 += inputs.铿金征鼓_n * 0.15;
  if (inputs.家常小炒) v.局外 += 0.2 + inputs.家常小炒_n * 0.1;
  if (inputs.得胜琴) v.局外 += 0.15 + inputs.得胜琴_n * 0.05;

  // 局内攻击
  if (inputs.古乔治营养原浆) v.局内 += 0.3;
  if (inputs.后土残片) v.局内 += 0.4;
  if (inputs.封神令) v.局内 += 1.0;
  if (inputs.岁衡) v.局内 += 0.5;
  if (inputs.岁花) v.局内 += inputs.岁花_n * 0.1;
  if (inputs.契心聆铃) v.局内 += inputs.契心聆铃_n * 0.4;

  // 攻速
  if (inputs.飞陀客运) v.攻速 += inputs.飞陀客运_n * 5;
  if (inputs.金酒之杯) v.攻速 += Math.floor(v.源石锭 / 5) * 7;

  // 增伤
  if (inputs.讴歌者面纱) { v.法伤 += 0.1; v.爆条速度 += 0.5; }
  if (inputs.灾难之源) { v.法伤 += 0.2; v.爆条速度 += 1.0; }
  if (inputs.复仇者) v.物伤 += 0.35;
  if (inputs.璀璨悲泣) v.法伤 += 0.4;
  if (inputs.文明的存续) v.真伤 += 1.5;

  // 其余（食物/装备）
  if (inputs.皮特水果什锦) v.局外 += 0.07;
  if (inputs.凉拌海草) v.远程 += 0.11;
  if (inputs.橙味风暴) v.近战 += 0.11;
  if (inputs.咖啡平原咖啡糖) v.远程 += 0.12;
  if (inputs.尖叫樱桃) v.近战 += 0.12;
  if (inputs.古旧乐谱残章) v.远程 += 0.1;
  if (inputs.解约协议) v.近战 += 0.07;
  if (inputs.显圣吊坠) v.远程 += 0.15;
  if (inputs.皇帝的恩宠) v.近战 += 0.15;
  if (inputs.损坏的左轮弹巢) v.远程 += 0.35;
  if (inputs.老近卫军之锋) v.近战 += 0.35;

  // 职业特殊
  if (inputs.铁卫_侵掠) v.重装局外 += 0.6;
  if (inputs.折戟_破釜沉舟) { v.近卫局外 += 0.4; v.近卫攻速 += 30; }
  if (inputs.残弩_百步穿杨) v.狙击局外 += 0.2;
  if (inputs.残弩_交叉火力) v.狙击局外 += 0.4;
  if (inputs.残弩_神速) v.狙击攻速 += 70;
  if (inputs.断杖_织法者) { v.术士局外 += 0.25; v.术士攻速 += 25; }
  if (inputs.断杖_苦难巫咒) v.术士法伤 += 0.7;

  // 特殊
  if (inputs.阿猛) v.元素伤害 += 1;
  if (inputs.奴隶猎捕器) v.浮空伤害 += 0.5;
  if (inputs.万星源之辉) v.起飞伤害 += 0.3;
  if (inputs.见历) v.化物伤害 += 0.5;
  if (inputs.Scout的狙击镜) v.远距离 += inputs.Scout的狙击镜_n * 0.2;
  if (inputs.Blaze的电锯) v.近距离 += 1 - inputs.Blaze的电锯_n * 0.2;

  // 通宝
  if (inputs.火机) v.局外 += 0.3;
  if (inputs.遇良弈) v.局外 += 0.6;
  if (inputs.武人之争) v.局外 += inputs.武人之争_n * 0.2;
  if (inputs.贵有衡) v.局外 += 0.1 + inputs.贵有衡_n * 0.1;
  if (inputs.柳伥作) { v.局外 -= 0.35; v.攻速 += 60; }
  if (inputs.志欲遂) v.攻速 += 80 - (inputs.志欲遂_n - 1) * 20;
  if (inputs.火上之灶) v.攻速 += Math.floor(v.源石锭 / 2) * 3;
  if (inputs.左秉烛) v.白值 += 100 + inputs.左秉烛_n * 100;

  return v;
}

function interval(baseMs: number, atkSpd: number): number {
  // 对应 Python 的 int(base * 3000 / spd + 0.5)，即向下取整（round-half-up）
  return Math.floor(baseMs * 3000 / atkSpd + 0.5);
}

/** 计算所有选中角色的结果 */
export function calculateRoles(
  v: CalcVars,
  baseAtks: BaseAttacks,
  selectedRoles: string[],
  withFire: boolean
): RoleResult[] {
  const results: RoleResult[] = [];

  const groups: { group: string; roles: string[] }[] = [
    { group: "近卫", roles: ["玛恩纳", "赤刃明霄陈", "史尔特尔", "锏", "艾丽妮"] },
    { group: "术重", roles: ["逻各斯", "圣聆初雪", "霍尔海雅", "斩业星熊"] },
    { group: "特种", roles: ["望", "新约能天使", "琳琅诗怀雅", "麒麟R夜刀"] },
    { group: "狙医", roles: ["空弦", "维什戴尔", "迷迭香", "Mon3tr"] },
  ];

  for (const { group, roles } of groups) {
    for (const role of roles) {
      if (!selectedRoles.includes(role)) continue;
      const res = calcRole(role, group, v, baseAtks, withFire);
      if (res) results.push(res);
    }
  }
  return results;
}

function calcRole(
  role: string,
  group: string,
  v: CalcVars,
  ba: BaseAttacks,
  fire: boolean
): RoleResult | null {
  try {
    const skills = calcRoleSkills(role, v, ba, fire);
    return { role, group, skills };
  } catch {
    return { role, group, skills: [{ name: "计算错误", total: 0 }] };
  }
}

function calcRoleSkills(role: string, v: CalcVars, ba: BaseAttacks, fire: boolean): SkillResult[] {
  switch (role) {
    case "玛恩纳": {
      const fa = ba.玛恩纳 + v.白值;
      const spd = Math.min(600, v.攻速 + 7 + v.近卫攻速);
      const iv = interval(1.2, spd);
      const dph = fa * (v.近卫局外 + v.局外 + v.近战) * (v.局内 + 4) * 1.8 * 1.2;
      const phys = Math.max(dph - v.敌人防御, dph * 0.05);
      const tru = fa * (v.近卫局外 + v.局外 + v.近战) * (v.局内 + 4) * 1.2 * 0.12;
      const cnt = 30 * 28 / iv;
      const total = (phys * v.减伤 * v.物法减伤 * v.物伤 * v.化物伤害 + tru * v.真伤) * cnt * v.远距离 * v.近距离 * v.脆弱;
      const dps = total / 28;
      const s: SkillResult[] = [{ name: "未照耀的荣光", total, dps }];
      if (fire) {
        const fireDmg = fa * (v.近卫局外 + v.局外 + v.近战) * (v.局内 + 4) * 0.5 * 1.2 * (1 - v.敌人法抗 / 100) * v.脆弱 * v.法伤;
        const totalFire = total + fireDmg * cnt * 2;
        s[0].fire = totalFire;
        s[0].fireDps = totalFire / 28;
      }
      return s;
    }

    case "赤刃明霄陈": {
      const fa = ba.赤刃明霄陈 + v.白值;
      const spd = Math.min(600, v.攻速 + 13 + v.近卫攻速);
      const iv = interval(1.25, spd);
      const dph = fa * 2.1 * (v.近卫局外 + v.局外 + v.近战) * (0.13 + v.局内);
      const physHit = Math.max(dph - v.敌人防御, dph * 0.05);
      const magHit = Math.max(dph * (1 - v.敌人法抗 / 100), dph * 0.05);
      const cnt = 20 * 30 / iv;
      const mul = v.减伤 * v.物法减伤 * v.化物伤害 * cnt * v.远距离 * v.近距离 * v.脆弱;
      const totalTK = physHit > magHit
        ? physHit * 3 * v.物伤 * mul
        : magHit * 3 * v.法伤 * mul;
      const dps = totalTK / 20;
      // 天喟单次
      const dph2 = fa * 5.8 * (v.近卫局外 + v.局外 + v.近战) * (0.13 + v.局内);
      const physTK2 = Math.max(dph2 - v.敌人防御, dph2 * 0.05) * v.减伤 * v.物法减伤 * v.物伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const magTK2 = Math.max(dph2 - v.敌人防御 * (1 - v.敌人法抗 / 100), dph2 * 0.05) * v.减伤 * v.物法减伤 * v.法伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const s: SkillResult[] = [
        {
          name: "赤霄·天喟", total: totalTK, dps,
          extra: [
            { label: "天喟(物理)单次", value: physTK2 },
            { label: "天喟(法术)单次", value: magTK2 },
          ]
        }
      ];
      if (fire) {
        const fd = fa * (v.近卫局外 + v.局外 + v.近战) * (0.13 + v.局内) * (1 - v.敌人法抗 / 100) * v.脆弱 * v.法伤;
        s[0].fire = totalTK + fd * cnt * 3;
        s[0].fireDps = s[0].fire! / 20;
      }
      return s;
    }

    case "史尔特尔": {
      const fa = ba.史尔特尔 + v.白值;
      const spd = Math.min(600, v.攻速 + 8 + v.近卫攻速);
      const iv = interval(1.25, spd);
      const res = Math.max(v.敌人法抗 - 26, 0);
      const dph = fa * (v.近卫局外 + v.局外 + v.近战) * (v.局内 + 3.3) * (1 - res / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const cnt = 8 * 30 / iv;
      const total = dph * cnt;
      const s: SkillResult[] = [{ name: "黄昏(锁血)", total, dps: total / 8 }];
      if (fire) {
        const fd = fa * (v.近卫局外 + v.局外 + v.近战) * (v.局内 + 3.3) * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱 * 0.5;
        s[0].fire = total + fd * cnt;
        s[0].fireDps = s[0].fire! / 8;
      }
      return s;
    }

    case "锏": {
      const fa = ba.锏 + v.白值;
      const defR = v.敌人防御 * 0.75;
      const dph1 = fa * 1.7 * 2.35 * (v.近卫局外 + v.局外 + v.近战) * v.局内;
      const dph2 = fa * 1.7 * 3.3 * (v.近卫局外 + v.局外 + v.近战) * v.局内;
      const dmg1 = Math.max(dph1 - defR, dph1 * 0.05);
      const dmg2 = Math.max(dph2 - defR, dph2 * 0.05);
      const dmg1a = Math.max(dph1 - v.敌人防御, dph1 * 0.05);
      const dmg2a = Math.max(dph2 - v.敌人防御, dph2 * 0.05);
      const mul = 1.1 * v.减伤 * v.物法减伤 * v.物伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const total = (dmg1 * 10 + dmg2) * mul;
      const totalA = (dmg1a * 10 + dmg2a) * mul;
      const s: SkillResult[] = [
        { name: "归于宁静", total, extra: [{ label: "归于宁静(抗)", value: totalA }] }
      ];
      if (fire) {
        const fd = 11 * fa * (v.近卫局外 + v.局外 + v.近战) * v.局内 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱 * 0.5;
        s[0].fire = fd;
        s[0].fireDps = undefined; // 烧火棍额外
      }
      return s;
    }

    case "艾丽妮": {
      const fa = ba.艾丽妮 + v.白值;
      const defH = v.敌人防御 * 0.5;
      const dph1 = fa * 3 * (v.近卫局外 + v.局外 + v.近战) * v.局内;
      const dph2 = fa * 2.5 * (v.近卫局外 + v.局外 + v.近战) * v.局内;
      const dmg1 = Math.max(dph1 - defH, dph1 * 0.05);
      const dmg2 = Math.max(dph2 - defH, dph2 * 0.05);
      const dmg2a = Math.max(dph2 - v.敌人防御, dph2 * 0.05);
      const mul = v.减伤 * v.物法减伤 * v.物伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const total = (dmg1 + dmg2 * 12) * mul * 2.4 * v.浮空伤害 * v.起飞伤害;
      const totalA = (dmg1 + dmg2 * 6 + dmg2a * 6) * mul;
      const s: SkillResult[] = [
        { name: "判决", total, extra: [{ label: "判决(抗)", value: totalA }] }
      ];
      if (fire) {
        const fd = 13 * fa * (v.近卫局外 + v.局外 + v.近战) * v.局内 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱 * 0.5;
        s[0].fire = fd;
      }
      return s;
    }

    case "逻各斯": {
      const fa = ba.逻各斯 + v.白值;
      const res = Math.max(v.敌人法抗 - 10, 0);
      const spd = Math.min(600, v.攻速 + v.术士攻速);
      const iv = interval(1.6, spd);
      const dph = (fa * (v.局外 + v.术士局外 + v.远程) * (v.局内 + 3) + 150) * (1 + 0.6 * 0.6);
      const dmg = Math.max(dph * 0.05, dph * (1 - res / 100));
      const dps1 = dmg * (30 / iv) * v.减伤 * v.物法减伤 * v.法伤 * v.术士法伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const withDph = fa * (v.局外 + v.术士局外 + v.远程) * (v.局内 + 3) * 0.6 * 0.6;
      const dps2 = dps1 + withDph * (30 / iv) * v.远距离 * v.近距离 * v.元素伤害 + 800 * v.元素伤害;
      const bt1 = 1000 / (dps1 * 0.08 * v.爆条速度);
      const bt2 = 2000 / (dps1 * 0.08 * v.爆条速度);
      const wt = (bt: number) => {
        if (bt > 0 && bt < 7.5) return 30 - 2 * bt;
        if (bt >= 7.5 && bt < 15) return 15;
        if (bt >= 15 && bt < 30) return 30 - bt;
        return 0;
      };
      const wt1 = wt(bt1), wt2 = wt(bt2);
      const total = dps2 * wt1 + (30 - wt1) * dps1;
      const totalLeader = dps2 * wt2 + (30 - wt2) * dps1;
      const s: SkillResult[] = [{
        name: "延异视阈", total, dps: total / 30,
        extra: [{ label: "延异视阈(领袖)", value: totalLeader }, { label: "领袖dps", value: totalLeader / 30 }]
      }];
      if (fire) {
        const fireBase = (fa * (v.局外 + v.术士局外 + v.远程) * (v.局内 + 3) * 0.5 * (1 - res / 100) + 150) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        const cnt = 30 * 30 * (1 + 0.6 * 0.6) / iv;
        s[0].fire = total + fireBase * cnt;
        s[0].fireDps = s[0].fire! / 30;
      }
      return s;
    }

    case "圣聆初雪": {
      const fa = ba.圣聆初雪 + v.白值;
      const res = Math.max(v.敌人法抗 - 10, 0);
      const spd2 = Math.min(600, v.攻速 + v.术士攻速);
      const spd3 = Math.min(600, v.攻速 + 30 + v.术士攻速);
      const iv2 = interval(2.0, spd2);
      const iv3 = interval(2.0, spd3);
      const dphFrost = fa * (v.局外 + v.术士局外 + v.远程) * v.局内 * 3.8;
      const dphFrost2 = fa * (v.局外 + v.术士局外 + v.远程) * v.局内 * 0.2;
      const dphMount = fa * (v.局外 + v.术士局外 + v.远程) * (v.局内 + 1) * 2.6;
      const dmgFrost = Math.max(dphFrost * 0.05, dphFrost * (1 - v.敌人法抗 / 100));
      const dmgFrost2 = Math.max(dphFrost2 * 0.05, dphFrost2 * (1 - v.敌人法抗 / 100));
      const dmgMount = Math.max(dphMount * 0.05, dphMount * (1 - res / 100));
      const mountCnt = 35 * 30 / iv3;
      const mul = v.减伤 * v.物法减伤 * v.法伤 * v.术士法伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const frostDps = (dmgFrost * (30 / iv2) + dmgFrost2) * mul;
      const mountTotal = dmgMount * mountCnt * mul;
      const mountDps = mountTotal / 35;
      const s: SkillResult[] = [
        { name: "霜涛覆岭", total: frostDps, dps: frostDps },
        { name: "群山俯首", total: mountTotal, dps: mountDps }
      ];
      if (fire) {
        const ff = fa * (v.局外 + v.术士局外 + v.远程) * v.局内 * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.法伤 * v.化物伤害 * v.脆弱;
        const fm = fa * (v.局外 + v.术士局外 + v.远程) * (1 + v.局内) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.法伤 * v.化物伤害 * v.脆弱;
        s[0].fire = frostDps + (ff * (30 / iv2) + ff);
        s[1].fire = mountTotal + fm * mountCnt * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[1].fireDps = s[1].fire! / 35;
      }
      return s;
    }

    case "霍尔海雅": {
      const fa = ba.霍尔海雅 + v.白值;
      const res = Math.max(v.敌人法抗 - 10, 0);
      const spd = Math.min(600, v.攻速 + v.术士攻速);
      const iv = interval(3.0, spd);
      const dph = fa * (v.局外 + v.术士局外 + v.远程) * v.局内 * 4.2 * 1.45;
      const dphA = fa * (v.局外 + v.术士局外 + v.远程) * v.局内 * 4.2;
      const dmg = Math.max(dph * (1 - res / 100), dph * 0.05);
      const dmgA = Math.max(dphA * (1 - res / 100), dphA * 0.05);
      const cnt = 45 * 30 / iv;
      const mul = v.减伤 * v.物法减伤 * v.法伤 * v.术士法伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const total = dmg * cnt * mul * v.浮空伤害 * v.起飞伤害;
      const totalA = dmgA * cnt * mul;
      const s: SkillResult[] = [
        {
          name: "博览者的狂语", total, dps: total / 45,
          extra: [{ label: "博览者的狂语(抗)", value: totalA }, { label: "抗dps", value: totalA / 45 }]
        }
      ];
      if (fire) {
        const fd = fa * (v.局外 + v.术士局外 + v.远程) * v.局内 * 0.5 * (1 - v.敌人法抗 / 100);
        s[0].fire = total + fd * cnt * mul * v.浮空伤害 * v.起飞伤害;
        s[0].fireDps = s[0].fire! / 45;
      }
      return s;
    }

    case "斩业星熊": {
      const fa = ba.斩业星熊 + v.白值;
      const spd = Math.min(600, v.攻速);
      const iv = interval(1.6, spd);
      const dph = fa * (v.局外 + v.重装局外 + v.近战) * (v.局内 + 2.8);
      const dmg = Math.max(dph * 0.05, dph * (1 - v.敌人法抗 / 100));
      const hellCnt = 32 * 30 / iv;
      const closeCnt = 11 * 30 / iv;
      const mul = v.减伤 * v.物法减伤 * v.法伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const hellTotal = dmg * 2.2 * hellCnt * mul;
      const closeTotal = dmg * 4.4 * closeCnt * mul;
      const s: SkillResult[] = [
        { name: "地狱变相", total: hellTotal, dps: hellTotal / 32 },
        { name: "关闭技能", total: closeTotal, dps: closeTotal / 11 }
      ];
      if (fire) {
        const fd = fa * (v.局外 + v.重装局外 + v.近战) * (v.局内 + 2.8) * 0.5 * (1 - v.敌人法抗 / 100);
        s[0].fire = hellTotal + fd * 4 * hellCnt * mul;
        s[0].fireDps = s[0].fire! / 32;
        s[1].fire = closeTotal + fd * 8 * closeCnt * mul;
        s[1].fireDps = s[1].fire! / 11;
      }
      return s;
    }

    case "望": {
      const fa = ba.望 + v.白值;
      const res2 = Math.max(v.敌人法抗 - 24, 0);
      const res3 = Math.max(v.敌人法抗 - 36, 0);
      const dph = fa * 3.8 * (v.局外 + v.远程) * v.局内;
      const mul = v.减伤 * v.物法减伤 * v.法伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const t2 = dph * (1 - res2 / 100) * mul * 1.26;
      const t3 = dph * (1 - res3 / 100) * mul * 1.39;
      return [
        { name: "天下劫2棋", total: t2 },
        { name: "天下劫3棋", total: t3 },
        { name: "三子", total: t3 * 3 },
        { name: "五子", total: t3 * 5 },
      ];
    }

    case "新约能天使": {
      const fa = ba.新约能天使 + v.白值;
      const mul = v.减伤 * v.物法减伤 * v.物伤 * v.远距离 * v.近距离 * v.化物伤害 * v.脆弱;
      const dph1 = fa * 3 * (v.局外 + v.远程) * (v.局内 + 0.18);
      const dph2 = fa * 1.85 * (v.局外 + v.远程) * (v.局内 + 0.18);
      const dph3 = fa * 1.6 * (v.局外 + v.远程) * (v.局内 + 0.18 + 0.3);
      const dph4 = fa * 1.85 * (v.局外 + v.远程) * (v.局内 + 0.18 + 0.3);
      const dph5 = fa * 2.5 * (v.局外 + v.远程) * (v.局内 + 0.18 + 0.3);
      const d1 = Math.max(dph1 * 0.05, dph1 - v.敌人防御);
      const d2 = Math.max(dph2 * 0.05, dph2 - v.敌人防御);
      const d3 = Math.max(dph3 * 0.05, dph3 - v.敌人防御);
      const d4 = Math.max(dph4 * 0.05, dph4 - v.敌人防御);
      const d5 = Math.max(dph5 * 0.05, dph5 - v.敌人防御);
      const kaihuo = (d1 * 40 + d2 * 0.35 * 40) * mul;
      const shiming = (d3 * 50 + d4 * 50 * 0.35 + d5) * mul;
      const s: SkillResult[] = [
        { name: "开火成瘾症", total: kaihuo },
        { name: "使命必达！", total: shiming }
      ];
      if (fire) {
        const fk = fa * 0.5 * (v.局外 + v.远程) * (v.局内 + 0.18) * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        const fs = fa * 0.5 * (v.局外 + v.远程) * (v.局内 + 0.18 + 0.3) * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[0].fire = kaihuo + fk * (40 + 40 * 0.35);
        s[1].fire = shiming + fs * (50 + 50 * 0.35 + 1);
      }
      return s;
    }

    case "琳琅诗怀雅": {
      const fa = ba.琳琅诗怀雅 + v.白值;
      const gold = Math.min(8 + v.源石锭, 68);
      const spd = Math.min(600, v.攻速);
      const iv = interval(1.0, spd);
      const dph1 = fa * (v.局外 + v.近战) * (v.局内 + gold * 0.04);
      const dph2 = fa * (v.局外 + v.近战) * (v.局内 + gold * 0.04) * 1.5;
      const dmg1 = Math.max(dph1 * 0.05, dph1 - v.敌人防御);
      const dmg2 = Math.max(dph2 * 0.05, dph2 - v.敌人防御);
      const mul = v.减伤 * v.物法减伤 * v.物伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const dps = 30 * dmg1 * 2 * mul / iv;
      const touqian = 15 * dmg2 * mul;
      const s: SkillResult[] = [
        { name: "千金一掷", total: dps, dps },
        { name: "千金一掷投钱", total: touqian }
      ];
      if (fire) {
        const fd = fa * (v.局外 + v.近战) * (v.局内 + gold * 0.04) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[0].fire = dps + fd * 30 / iv;
        s[0].fireDps = s[0].fire;
      }
      return s;
    }

    case "麒麟R夜刀": {
      const fa = ba.麒麟R夜刀 + v.白值;
      const mul = v.减伤 * v.物法减伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const dph1 = fa * (v.局外 + v.近战) * (v.局内 + 0.2) * 1.5;
      const dph2 = fa * (v.局外 + v.近战) * (v.局内 + 0.2) * 0.5 * 1.5;
      const dm1 = Math.max(dph1 * 0.05, dph1 - v.敌人防御);
      const dm2 = Math.max(dph2 * 0.05, dph2 * (1 - v.敌人法抗 / 100));
      const luan = 16 * (dm1 * v.物伤 + dm2 * v.法伤) * mul;
      const kph1 = fa * (v.局外 + v.近战) * (v.局内 + 0.2) * 3;
      const kph2 = fa * (v.局外 + v.近战) * (v.局内 + 0.2) * 0.2;
      const km1 = Math.max(kph1 * 0.05, kph1 - v.敌人防御);
      const km2 = Math.max(kph2 * 0.05, kph2 * (1 - v.敌人法抗 / 100));
      const kong = (km1 * v.物伤 + km2 * v.法伤) * mul;
      const s: SkillResult[] = [
        { name: "乱舞", total: luan },
        { name: "空中回旋乱舞", total: kong },
        { name: "身形12判", total: kong * 12 },
      ];
      if (fire) {
        const fl = fa * (v.局外 + v.近战) * (v.局内 + 0.2) * 1.5 * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[0].fire = luan + 32 * fl;
        const fk = fa * (v.局外 + v.近战) * (v.局内 + 0.2) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[1].fire = fk + kong;
      }
      return s;
    }

    case "空弦": {
      const fa = ba.空弦 + v.白值;
      const spd = Math.min(600, v.攻速 + v.狙击攻速 + 8);
      const iv = interval(1.0, spd);
      const dph = fa * (v.局外 + v.狙击局外 + v.远程) * (0.8 + v.局内);
      const dmg = Math.max(dph * 0.05, dph - v.敌人防御);
      const cnt = 20 * 30 / iv;
      const mul = v.减伤 * v.物法减伤 * v.物伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const total = dmg * 3 * cnt * mul;
      const s: SkillResult[] = [{ name: "箭矢·暴风", total, dps: total / 20 }];
      if (fire) {
        const fd = fa * (v.局外 + v.狙击局外 + v.远程) * (0.8 + v.局内) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[0].fire = total + fd * 3 * cnt;
        s[0].fireDps = s[0].fire! / 20;
      }
      return s;
    }

    case "维什戴尔": {
      const fa = ba.维什戴尔 + v.白值;
      const spd = Math.min(600, v.攻速 + 7 + v.狙击攻速);
      const ivSat = interval(1.4, spd);
      const cntSat = 25 * 30 / ivSat;
      const base = fa * (v.局外 + v.远程 + v.狙击局外) * (v.局外 + 0.35);
      const mul = v.减伤 * v.物法减伤 * v.物伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      // 各dph
      const d = (m: number) => {
        const x = base * m;
        return Math.max(x - v.敌人防御, x * 0.05);
      };
      const satSingle = ((d(1.25) + d(1.25 * 0.5) * 2) / 2 + (d(1.25 * 0.8) + d(1.25 * 0.5 * 0.8) * 2) / 2 + d(1.75) * 0.2775) * cntSat * mul;
      const satFour = ((d(1.25) + d(1.25 * 0.5) * 2) / 2 + (d(1.25 * 0.8) + d(1.25 * 0.5 * 0.8) * 2) / 2 + d(1.75) * 0.2775 * 4 + (d(1.0) + d(0.5) * 2) * 2 / 2 + (d(0.8) + d(0.5 * 0.8) * 2) * 3 / 2) * cntSat * mul;
      // 爆裂黎明
      const blBase = fa * (v.局外 + v.远程 + v.狙击局外) * (v.局外 + 1.8);
      const bl1 = Math.max(blBase * 1.25 * 2.2 - v.敌人防御, blBase * 1.25 * 2.2 * 0.05);
      const bl2 = Math.max(blBase * 1.25 * 2.2 * 0.5 - v.敌人防御, blBase * 1.25 * 2.2 * 0.5 * 0.05);
      const bl3 = Math.max(blBase * 1.75 - v.敌人防御, blBase * 1.75 * 0.05);
      const blSingle = (bl1 + bl2 * 2 + bl3) * mul * 6;
      const s: SkillResult[] = [
        { name: "饱和复仇(对单)", total: satSingle, dps: satSingle / 25 },
        { name: "饱和复仇(四目标溅射)", total: satFour, dps: satFour / 25 },
        { name: "爆裂黎明(对单)", total: blSingle },
      ];
      if (fire) {
        const fd = fa * (v.局外 + v.远程 + v.狙击局外) * (v.局外 + 0.35) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[0].fire = satSingle + fd * 3.2775 * cntSat;
        s[0].fireDps = s[0].fire! / 25;
        const fbl = fa * (v.局外 + v.远程 + v.狙击局外) * (v.局外 + 1.8) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[2].fire = blSingle + fbl * 24;
      }
      return s;
    }

    case "迷迭香": {
      const fa = ba.迷迭香 + v.白值;
      const defS = Math.max(v.敌人防御 - 560, 0);
      const resS = Math.max(v.敌人法抗 - 20, 0);
      const spd = Math.min(600, v.攻速 + 7 + v.狙击攻速 + v.术士攻速);
      // 末梢阻断
      const iv1 = interval(2.1 * 1.5, spd);
      const cnt1 = 40 * 30 / iv1;
      const b1 = fa * (v.局外 + v.远程 + v.狙击局外 + v.术士局外) * (v.局内 + 0.55 + 0.08);
      const dm1 = Math.max(b1 - defS, b1 * 0.05);
      const dm2 = Math.max(b1 * 0.5 - defS, b1 * 0.5 * 0.05);
      const dm3 = Math.max(b1 * (1 - resS / 100), b1 * 0.05);
      const mul = v.减伤 * v.物法减伤 * v.化物伤害 * v.远距离 * v.近距离 * v.脆弱;
      const total1 = (dm1 * v.物伤 + dm2 * 3 * v.物伤 + dm3 * v.法伤 * v.术士法伤) * cnt1 * mul;
      // 如你所愿
      const iv2 = interval(2.1 * 0.5, spd);
      const cnt2 = 30 * 30 / iv2;
      const b2 = fa * (v.局外 + v.远程 + v.狙击局外 + v.术士局外) * (v.局内 + 0.75 + 0.08);
      const d21 = Math.max(b2 - defS, b2 * 0.05);
      const d22 = Math.max(b2 * 0.5 - defS, b2 * 0.5 * 0.05);
      const d23 = Math.max(b2 * (1 - resS / 100), b2 * 0.05);
      const total2 = (d21 * v.物伤 + d22 * v.物伤 + d23 * v.法伤 * v.术士法伤) * cnt2 * mul;
      const s: SkillResult[] = [
        { name: "末梢阻断", total: total1, dps: total1 / 40 },
        { name: "如你所愿", total: total2, dps: total2 / 30 }
      ];
      if (fire) {
        const fd1 = fa * (v.局外 + v.远程 + v.狙击局外 + v.术士局外) * (v.局内 + 0.55 + 0.08) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[0].fire = total1 + fd1 * 5 * cnt1;
        s[0].fireDps = s[0].fire! / 40;
        const fd2 = fa * (v.局外 + v.远程 + v.狙击局外 + v.术士局外) * (v.局内 + 0.75 + 0.08) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[1].fire = total2 + fd2 * 3 * cnt2;
        s[1].fireDps = s[1].fire! / 30;
      }
      return s;
    }

    case "Mon3tr": {
      const fa = ba.Mon3tr + v.白值;
      const spd = Math.min(600, v.攻速 + 20);
      const iv = interval(1.35, spd);
      const dmg = fa * (v.局外 + v.远程) * (v.局内 + 3.3) * v.真伤 * v.远距离 * v.近距离 * v.脆弱;
      const cnt = 25 * 30 / iv;
      const total = dmg * cnt;
      const s: SkillResult[] = [{ name: "策略：熔毁", total, dps: total / 25 }];
      if (fire) {
        const fd = fa * (v.局外 + v.远程) * (v.局内 + 3.3) * 0.5 * (1 - v.敌人法抗 / 100) * v.减伤 * v.物法减伤 * v.法伤 * v.脆弱;
        s[0].fire = total + fd * cnt;
        s[0].fireDps = s[0].fire! / 25;
      }
      return s;
    }

    default:
      return [];
  }
}

export const OPERATOR_GROUPS = [
  { group: "近卫", roles: ["玛恩纳", "赤刃明霄陈", "史尔特尔", "锏", "艾丽妮"] },
  { group: "术重", roles: ["逻各斯", "圣聆初雪", "霍尔海雅", "斩业星熊"] },
  { group: "特种", roles: ["望", "新约能天使", "琳琅诗怀雅", "麒麟R夜刀"] },
  { group: "狙医", roles: ["空弦", "维什戴尔", "迷迭香", "Mon3tr"] },
];

export const PRESETS = {
  朔壳: { 敌人防御: 3000, 敌人法抗: 60, 领袖: true, 身形数量: 0 },
  身形: { 敌人防御: 1200, 敌人法抗: 30, 领袖: true, 身形数量: 0 },
  妄躯: { 敌人防御: 3600, 敌人法抗: 60, 领袖: true, 身形数量: 0 },
  岁: { 敌人防御: 960, 敌人法抗: 50, 领袖: false, 身形数量: 0 },
};

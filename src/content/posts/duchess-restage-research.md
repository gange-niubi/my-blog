---
title: 黑夜君临女爵重演机制研究
published: 2026-02-23
description: 基于 Smithbox 取参与 IDA 逆向，梳理《ELDEN RING NIGHTREIGN》中女爵「重演」技能的触发、记录与性能设计。
tags: [逆向, 游戏, IDA, Smithbox, 艾尔登法环, 黑夜君临]
category: 逆向
draft: false
---

## 一、为什么想做这次逆向

黑夜君临里女爵有一个很有意思的技能：**重演过去 4 秒(后面得知大概是三秒，不过反正我没有搜到具体的数值)内周围敌人所做的所有动作，并重演 40% 他们所受到的伤害**。我好奇的是：这种「重演」在引擎里到底是怎么实现的？

以前在项目里做过一个类似功能叫「预研」——预测敌人一秒内的行动。当时的做法是**单独开一个 RehearsalWorld，把原世界复制过去，在新世界里跑 1 秒 Update**。效果能跑通，但非常吃性能，后来被改掉了。那法环改版里的「重演」总不能是每帧把周围敌人状态全记一遍再回放吧？肯定有更省的做法。

于是我对女爵的「重演」做了一次从工具到结论的完整逆向，这里把研究链和结论整理成一篇博客。

---

## 二、环境与工具：为什么不能直接看源码

- **游戏**：基于 From Software《艾尔登法环》的改版 **ELDEN RING NIGHTREIGN**，主程序为 **nightreign.exe**（如 `Game\nightreign.exe`）。
- **程序类型**：**原生 x64 PE**，非 .NET；联机模组 **SeamlessCoop\nrsc.dll** 也是原生 DLL。因此 **dnSpy 用不了**，不能像 Mono/IL2CPP 那样用 il2cppdumper 或 dnSpy 直接看高可读源码。
- **数据与逻辑**：机制与数值在 **regulation.bin**（From 社 param）；技能逻辑在 **nightreign.exe** 与 **nrsc.dll** 的原生代码里，需要用 **Smithbox** 查 param、用 **IDA Pro（或 Ghidra）** 做反汇编/反编译。

也就是说：想搞清「重演」怎么实现，只能走「Smithbox 取参 → IDA 搜锚点 → 反编译串调用链」这条线。

---

## 三、用 Smithbox 拿到「重演」的锚点参数

### 3.1 工具与文件

- **Smithbox**：编辑/查看 Elden Ring 的 regulation，从 GitHub 下载后解压，主程序 **Smithbox.exe**。
- **regulation.bin**：游戏目录下 **Game\regulation.bin**，用 Smithbox 打开。

![Smithbox 打开 regulation.bin](/images/posts/duchess-restage/smithbox-regulation.png)

### 3.2 实际操作

1. 用 Smithbox 打开 **Game\regulation.bin**。
2. 在 **NpcParam** 里搜 **Duchess** / **女爵**，得到女爵相关 NPC 行。
3. 在 **SpEffectParam** 里搜 **Restage**、**重演**、**再次上演**，或看和「幻影」「4 秒」相关的效果（如 effectEndurance ≈ 4）。
4. 把 **NpcParam**、**SpEffectParam** 导出 CSV，方便后面在 IDA 里按数字搜。

在 **SpEffectParam** 里搜 Restage，即可看到 **703540 [Skill - Duchess] Restage** 及 **stateInfo = 601** 等字段；**NpcParam** 里搜 Duchess 可得女爵相关 NPC ID。下图即 Smithbox 中查到女爵与 Restage 相关条目的示意。

![Smithbox 中查到的 Duchess / Restage 相关条目](/images/posts/duchess-restage/smithbox-duchess.png)

### 3.3 得到的锚点（供 IDA 用）

**NpcParam — 女爵相关 NPC ID：**

| NPC ID       | 说明 |
|--------------|------|
| **521040010** | **Duchess**（主女爵，可玩/战斗） |
| **600030310** | Night Thief (Duchess)（夜晚盗贼形态） |
| 521040000    | Duchess (Roundtable NPC) |
| 521060700    | Revenant (Duchess Remembrance) |
| 其他         | 见导出表 |

**SpEffectParam — 重演技能：**

| SpEffect ID | 名称 | 关键信息 |
|-------------|------|----------|
| **703540** | **[Skill - Duchess] Restage** | **「再次上演」本体**；**stateInfo = 601**（引擎按此分支）；持续时间 4 秒对应 effectEndurance 等。 |
| 703546     | [Skill - Duchess] Turn off Restage Blend | 关闭 Restage 混合 |
| 703500/703501 | [Ultimate - Duchess] Finale 系列 | 终极技，stateInfo 600 |

**发现了一个更好的方案**
**后面的内容暂时删除**
**其实根本没有那么复杂**
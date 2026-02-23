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

**IDA 里要搜的数字：**

- **SpEffect ID**：**703540**（十六进制 0xABD34）
- **stateInfo**：**601**（十六进制 0x259）
- **4 秒**：整数 **4000**（毫秒，0xFA0）或浮点 **4.0**（0x40800000）
- **女爵 NPC**：**521040010**（0x1F0B380A）、**600030310**（Night Thief）

---

## 四、用 IDA 做逆向：文件、搜索与关键函数

### 4.1 分析目标

- **主目标**：**nightreign.exe**。
- 若主程序里线索不够，再对 **SeamlessCoop\nrsc.dll** 做同样的立即数搜索。不要用 `nrsc_launcher.exe` 或 `start_protected_game.exe` 分析技能逻辑。

### 4.2 PDB

打开 exe 时 IDA 可能提示找 PDB。本作没有公开 PDB，选**取消 / Skip** 即可，不加载也能正常反汇编和搜索，只是函数名多为 `sub_xxxx`，需要自己重命名和注释。

### 4.3 立即数搜索与结果

在 IDA 中打开 **nightreign.exe**，用 **Search → Immediate value** 按下面顺序搜即可复现。

![IDA 中搜索 601 等立即数并查看引用](/images/posts/duchess-restage/ida.png)

1. **SpEffect ID 703540**  
   - **Search → Immediate value**，32-bit，输入 **703540** 或 **0xABD34**。  
   - **结果**：在 nightreign.exe 中**无命中**。说明 SpEffect ID 由 regulation 加载，引擎侧不写死该常数，而是按 **stateInfo** 分支。

2. **stateInfo 601**  
   - 搜 **601** 或 **0x259**。  
   - **结果**：**18 处**命中。部分关键地址：  
     - 0x1403ce5b8（sub_1403CE4E0 内：`if (*(WORD*)(v6+342) == 601)`）  
     - 0x1403db638（sub_1403DB410 内，主 SpEffect 应用）  
     - 0x140778265（sub_140778250 内，与 Fade 构造）  
     - 0x140f73ee6（sub_140F73E70 内，注册 601）

3. **4 秒**  
   - 搜 **4000**（0xFA0）或浮点 **4.0**（0x40800000）。  
   - **结果**：4000 出现 30+ 处，多与时间/间隔相关；尚未在「与 601 同一函数」内同时出现，4 秒时间窗更可能在单例消费或上层调用链中。

4. **NPC 521040010**（可选）  
   - 搜 **521040010** 或 **0x1F0B380A**，用于缩小女爵相关逻辑范围。

### 4.4 关键函数与地址汇总

| 地址 | 建议命名 | 作用简述 |
|------|----------|----------|
| **0x140F73E70** | RegisterState_601_Restage | 注册 stateId 599～628 等，**601 对应 type 46** |
| **0x1403DB410** | ApplySpEffect_ByStateInfo | **主 SpEffect 应用**；若 stateInfo==601 则调 sub_14044A340(handler, *(float*)(effect+944)) |
| **0x14044A340** | Restage_PushDurationAndEnqueue | 601 分支：写 duration，再入队到单例 |
| **0x143C137A0** | qword_143C137A0 | **全局单例**：按角色管理多个子容器，用于「记录」与队列 |
| **0x1403C80A0** | ApplySpEffect_WithRestageRecord | 应用 SpEffect 时**先**向单例写记录 |
| **0x140732800** | Restage_GetOrCreateContainerForChr | 按键（如 a1[15]）在单例中取/建该角色的容器 |
| **0x140738BA0** | Restage_PushRecordToContainer | 向容器 push 一条记录，**每条约 120 字节** |

**效果块关键偏移：**

- **+342**：**WORD**，**stateInfo**（601 = Restage）
- **+944**：**float**，**持续时间**（对应 param 的 effectEndurance，如 4 秒）

---

## 五、数据流与已能确定的结论

### 5.1 数据流（已串起来的部分）

1. **regulation.bin**：SpEffectParam 中 **ID=703540** 的条目，**stateInfo=601**，effectEndurance=4 等；加载后进入游戏内存的「效果描述」表。
2. **添加效果**：逻辑按 SpEffect ID 把效果挂到角色。
3. **应用时分枝**：**sub_1403DB410**（或 sub_1403CE4E0）根据效果块 **+342** 的 **stateInfo** 分支；若 **== 601**：  
   - 取 **+944** 的 **float** 作为 duration，调用 **sub_14044A340(handler, duration)**；  
   - sub_14044A340 把 duration 写入 handler，并通过 **sub_140733490** 把任务推入全局单例 **qword_143C137A0** 的队列。
4. **记录侧**：在 **sub_1403C80A0** 中，在满足一定条件时，以 **a1[15]**（角色相关）为键调用 **sub_140732800(单例, a1[15])** 取得或创建该角色对应的容器，再用 **sub_140738BA0(容器, 结构)** 向该容器 **push 一条约 120 字节的记录**，内容包括 SpEffect ID、两个 DWORD（来自 sub_140282970，即角色 +120、+124 的位置/实体标识）、以及一大块与 a6 相关的数据。

也就是说：**只有在「对单位施加 SpEffect」时才会写一条记录**，写入频率等于「效果施加事件」的频率，**不是**每帧对所有单位做全量采样。

### 5.2 已能确定的结论

- **触发**：重演由 **stateInfo 601** 触发；引擎不比较 SpEffect ID 703540，703540 只存在于 regulation 与加载后的表。
- **注册**：启动时 **sub_140F73E70** 将 601 与 type 46 等注册到 state 表。
- **应用与入队**：**sub_1403DB410** 在应用 SpEffect 时，若 stateInfo==601，则用 **effect+944** 的 float 作为 duration 调用 **sub_14044A340**，后者把任务推入 **qword_143C137A0**。
- **记录**：**sub_1403C80A0** 在施加 SpEffect 时，向单例中「该角色对应的容器」**追加一条 120 字节级的记录**（SpEffect ID + 位置/标识 + 一段数据），且为**按事件写入**，非每帧全量记录。

### 5.3 尚未完全对上的部分

- **「周围」**：如何筛出「周围敌人」（半径/距离/扇形）未在已分析函数里明确对应。
- **「4 秒」过滤**：谁在何时遍历单例/容器、按 4 秒时间窗过滤，尚未在 qword_143C137A0 的**读路径**里完全定位（候选为 sub_1403A51A0、sub_1403ADF50 等）。
- **「重演施加」**：对目标或原攻击者施加伤害/表现的具体代码，未与 601 或单例消费一一对应；exe 中字符串 "replay" 的 xref 为空，部分逻辑可能在 **nrsc.dll** 或其它模块。

---

## 六、性能上的推断

- **写入时机**：当前能确定的写入路径在 **sub_1403C80A0**，且仅在**给角色施加 SpEffect** 时、在满足条件的分支内执行 sub_140732800 / sub_140738BA0。即：**只有「正在挂上的这次效果」触发一次写入**。
- **记录内容**：是「效果施加事件」（谁、什么效果、什么位置/状态），而不是「每一帧的完整动作/骨骼」。
- **合理推断**：实现上更可能是「**每次对单位施加 SpEffect/造成伤害时 push 一条（时间戳、攻击者、受害者、SpEffect ID 或 Atk ID、伤害量等）**，并**记录被标记对象所播的动画及所在位置**；女爵使用技能时再按 4 秒窗口与「周围」筛选后重播。常态下只需**离散化地记录周围敌人的部分事件**，对性能的损耗可以类比「打 log」级别，在不开技能时对性能影响很小。

---

## 七、小结与后续

我原先做的大多是 Mono/IL2CPP 或能用 dnSpy 直接看源码的 PC 游戏（如骑砍 2、原神、明日方舟等）。这次面对的是**原生 C++ 的 From 系改版**，没有 metadata，也很难得到高可读的代码，最终只能得出**在「触发与记录侧」较明确、在「周围与重演施加」上仍不完整**的结论。

根据目前的线索，这个「重演」**大概率**是：在每次「对单位施加 SpEffect / 造成伤害」时 **push 一条**记录，同时记录被标记对象的动画与位置；女爵开技能时再按 4 秒窗口与「周围」筛选并重播。这样常态下只需要**离散化地记录周围敌人的部分事件**，对性能的影响可以认为和「打了个 log」差不多。

若之后在单例的消费逻辑或 **nrsc.dll** 里继续跟「4 秒过滤」「周围判定」「重演施加」的代码，可以把整条链补全；本文把从 Smithbox 取参到 IDA 锚点与关键函数的步骤都按实际操作复述了一遍，便于复现与引用。

---

**附录 — 关键地址与偏移速查**

- **stateInfo 601**：效果块偏移 **+342**（WORD）；**duration**：效果块偏移 **+944**（float）。
- **单例**：**qword_143C137A0**（0x143C137A0）。
- **601 注册**：sub_140F73E70；**601 应用与入队**：sub_1403DB410、sub_14044A340；**记录写入**：sub_1403C80A0、sub_140732800、sub_140738BA0。
- **SpEffect Restage**：ID **703540**（0xABD34）；**stateInfo 601**（0x259）；**4 秒**：**4000**（0xFA0）或 **4.0f**（0x40800000）。

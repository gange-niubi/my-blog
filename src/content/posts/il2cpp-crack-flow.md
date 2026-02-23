---
title: 常规无加密 IL2CPP 手游破解流程
published: 2026-02-24
description: 从安装包到 Unity 工程与 IDA 分析的通用流程，适用于未对 global-metadata 与 libil2cpp 做加密的 IL2CPP 手游。
tags: [逆向, IL2CPP, Unity, 手游, Il2CppDumper, AssetRipper, IDA]
category: 逆向
draft: false
---
## 前言
  稍微整理了一下自己常规的操作步骤，把以前我破解一些游戏的流程告诉了AI,让ai剔除其中的具体产品的信息，只保留技术流程，让ai帮我水了这样一篇文章。
  

## 一、适用范围与前提

本文描述的是**常规、无加密**的 IL2CPP 手游解包与逆向流程：游戏没有对 **global-metadata.dat** 和 **libil2cpp.so** 做魔改或加密，只要拿到安装包（如 .apk、.xapk），就能按下面步骤还原工程结构并分析逻辑。

很多商业手游会对这两个文件做保护（例如魔改 metadata、自定义加密等），那就需要先做脱壳/解密，属于另一套攻防；本文不涉及。

---

## 二、常用工具

| 工具 | 用途 |
|------|------|
| **AssetRipper** | 将 apk/xapk 解包为 Unity 工程，得到场景、资源与脚本「空壳」 |
| **Il2CppDumper** | 用 libil2cpp.so + global-metadata.dat 生成脚本、头文件、IDA 脚本等，恢复类名/方法名与地址对应 |
| **IDA Pro**（或 Ghidra） | 反汇编 libil2cpp.so，配合 Il2CppDumper 的脚本可带符号分析 |
| **dnSpy** | 若有 .NET/Mono 相关 dll 可做 C# 分析；纯 IL2CPP 游戏主要用 IDA |
| **Unity** | 打开 AssetRipper 导出的工程，便于按项目结构定位要分析的脚本 |

---

## 三、整体流程概览

1. 用 **AssetRipper** 从安装包解出 Unity 工程 → 得到正确类名、方法名的「空壳」脚本。
2. 从安装包中取出 **libil2cpp.so** 和 **global-metadata.dat**。
3. 用 **Il2CppDumper** 处理这两个文件 → 得到 dump 脚本、头文件、IDA 脚本等。
4. 用 **IDA** 打开 libil2cpp.so，加载 Il2CppDumper 的脚本 → 恢复函数名/符号。
5. 在 Unity 工程里按「类/方法」定位目标逻辑，在 IDA 里按名查实现，分析或还原伪代码/算法。

下面按步骤说明。

---

## 四、步骤一：用 AssetRipper 解包得到 Unity 工程

- **输入**：.apk 或 .xapk（部分渠道包可能是 .xapk，本质是 zip，内含多个 apk 或资源）。
- **操作**：用 AssetRipper 直接打开该安装包，选择导出为 Unity 工程（版本按提示选，一般选与游戏相近的 Unity 版本）。
- **结果**：得到一个 Unity 工程目录，包含场景、预制体、资源，以及大量 C# 脚本。

这些脚本的特点是：**类名、方法名、签名基本正确，但函数体是空的**（因为真实逻辑在 libil2cpp.so 里）。这个工程的作用是：

- 看清游戏的代码结构和类/方法命名；
- 方便按命名在 IDA 里搜索对应函数。

导出后工程里常有大量报错（缺少依赖、API 变更等），可先忽略或按需删掉无关脚本，只保留和你要分析模块相关的部分即可。

---

## 五、步骤二：从安装包中取出 libil2cpp.so 与 global-metadata.dat

IL2CPP 游戏的核心是：

- **libil2cpp.so**：存放所有 C# 编译成的原生代码（在 `lib/<abi>/libil2cpp.so`，如 `lib/arm64-v8a/libil2cpp.so`）。
- **global-metadata.dat**：存放类型、方法、字段等元数据（多数在 apk 根目录或 `assets/bin/Data/Managed/Metadata/` 下，具体路径因包而异）。

**若是 .apk**：  
把 .apk 改名为 .zip 后解压，在解压目录中找：

- `lib/arm64-v8a/libil2cpp.so`（或 armeabi-v7a，视包而定）；
- `assets/bin/Data/Managed/Metadata/global-metadata.dat`（或同名在别处，可搜索文件名）。

**若是 .xapk**：  
.xapk 改名为 .zip 解压后，里面可能是多个小 apk 或目录，对每个再改名为 .zip 解压，在各自解压结果里同样找上述两个文件。找到后复制到同一工作目录备用。

未加密的情况下，这两个文件可直接被 Il2CppDumper 读取，无需额外脱壳或解密。

---

## 六、步骤三：用 Il2CppDumper 生成脚本与头文件

1. 运行 **Il2CppDumper**，先选择 **libil2cpp.so**，再选择 **global-metadata.dat**（或 .dat 等 Il2CppDumper 支持的 metadata 文件名）。
2. 等待解析完成，会在输出目录生成例如：
   - **dump.cs**（或类似）：C# 侧的方法签名、类结构，可与 Unity 工程里的「空壳」对照；
   - **script.py**（IDA 用）：在 IDA 里运行后可给函数、全局变量等填上名称；
   - **idapy.py**（IDA 7.x 用）等，按你用的 IDA 版本选对应脚本；
   - 有时还有 **header**、**cpp** 等，便于对照结构。

这些输出建立了「C# 类/方法名 ↔ so 里地址」的对应关系，是后续在 IDA 里带符号分析的基础。

---

## 七、步骤四：用 IDA 打开 libil2cpp.so 并加载脚本

1. 用 **IDA Pro**（或 Ghidra）打开 **libil2cpp.so**，架构选对（如 ARM64）。
2. 在 IDA 里运行 Il2CppDumper 生成的 **script.py**（或 idapy 等）：  
   File → Script file → 选脚本，执行。
3. 执行完成后，函数、全局变量等会按 dump 结果被重命名，便于按「类名::方法名」搜索。

此时 so 对你来说就是「带符号」的：既有 C# 的类/方法名，又有反汇编/反编译结果，要分析哪个逻辑就直接搜对应函数名即可。

---

## 八、步骤五：结合 Unity 工程与 IDA 做逻辑分析

- 在 **Unity 工程**里：根据 AssetRipper 解出的脚本结构，找到与目标功能相关的类、方法（例如某系统的管理器、某核心算法类）。
- 在 **IDA** 里：用 Il2CppDumper 恢复的名称搜索该类或方法，看反编译伪代码。
- 若伪代码难以阅读，可以：
  - 把关键函数的伪代码复制出来，用大模型（如 Gemini、GPT 等）做「伪代码 → 可读逻辑/近似代码」的辅助理解；
  - 或自己根据调用关系、全局变量、字符串引用等慢慢还原。

这样你就同时拥有：**完整项目结构（Unity 工程）+ 真实实现（IDA + 伪代码）**，适合做算法还原、难度/数值逻辑分析等，且不依赖具体某一款游戏。

---

## 九、关于「无加密」的说明

常见加密方式包括但不限于：

- **魔改 global-metadata.dat**：改格式、加密、校验等，Il2CppDumper 无法直接解析；
- **对 libil2cpp.so 做保护**：加壳、混淆、反调试等，需先脱壳或过保护。

本文流程适用于：**metadata 与 so 均为标准或仅轻微修改、Il2CppDumper 能直接跑通** 的情况。若工具报错或解析结果明显异常，多半是遇到加密/魔改，需要先做针对性处理，再回到本流程。

---

## 十、小结

| 步骤 | 输入 | 工具 | 输出 |
|------|------|------|------|
| 1 | .apk / .xapk | AssetRipper | Unity 工程（空壳脚本 + 资源） |
| 2 | .apk / .xapk | 解压/查找 | libil2cpp.so、global-metadata.dat |
| 3 | .so + metadata | Il2CppDumper | dump.cs、IDA 脚本、头文件等 |
| 4 | libil2cpp.so + 脚本 | IDA | 带符号的 so，可反编译 |
| 5 | Unity 工程 + IDA | 人工/大模型 | 目标逻辑的还原与理解 |

去掉具体游戏与商业细节后，上述流程就是一套通用的「常规无加密 IL2CPP 手游」从安装包到可分析状态的破解流程；遇到具体游戏时，只需在步骤五中替换成该游戏的目标类/方法即可。

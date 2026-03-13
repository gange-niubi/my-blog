<script lang="ts">
  import {
    computeVars,
    calculateRoles,
    OPERATOR_GROUPS,
    PRESETS,
    DEFAULT_INPUTS,
    DEFAULT_BASE_ATTACKS,
    type UserInputs,
    type BaseAttacks,
    type RoleResult,
    type CalcVars,
  } from "../data/arknightsCalc";

  let inputs: UserInputs = { ...DEFAULT_INPUTS };
  let baseAtks: BaseAttacks = { ...DEFAULT_BASE_ATTACKS };
  let selectedRoles: string[] = OPERATOR_GROUPS.flatMap((g) => g.roles);
  let results: RoleResult[] = [];
  let vars: CalcVars | null = null;
  let showVars = false;
  let activeTab = "items"; // items | inputs | results | base

  // 藏品分类
  const itemSections = [
    {
      title: "局外攻击",
      color: "blue",
      items: [
        { key: "剑锤", label: "剑锤", hasInput: false },
        { key: "源石祭坛", label: "源石祭坛", hasInput: true, inputKey: "源石祭坛_n", placeholder: "层数" },
        { key: "登天斧", label: "登天斧", hasInput: true, inputKey: "登天斧_n", placeholder: "阶段" },
        { key: "酿山河", label: "酿山河", hasInput: true, inputKey: "酿山河_n", placeholder: "层数" },
        { key: "兵锋", label: "兵锋", hasInput: true, inputKey: "兵锋_n", placeholder: "层数" },
        { key: "铿金征鼓", label: "铿金征鼓", hasInput: true, inputKey: "铿金征鼓_n", placeholder: "层数" },
        { key: "家常小炒", label: "家常小炒", hasInput: true, inputKey: "家常小炒_n", placeholder: "层数" },
        { key: "得胜琴", label: "得胜琴", hasInput: true, inputKey: "得胜琴_n", placeholder: "层数" },
      ],
    },
    {
      title: "局内攻击",
      color: "green",
      items: [
        { key: "古乔治营养原浆", label: "古乔治营养原浆", hasInput: false },
        { key: "后土残片", label: "后土残片", hasInput: false },
        { key: "封神令", label: "封神令", hasInput: false },
        { key: "岁衡", label: "岁衡", hasInput: false },
        { key: "岁花", label: "岁花", hasInput: true, inputKey: "岁花_n", placeholder: "层数" },
        { key: "契心聆铃", label: "契心聆铃", hasInput: true, inputKey: "契心聆铃_n", placeholder: "层数" },
      ],
    },
    {
      title: "攻速",
      color: "yellow",
      items: [
        { key: "飞陀客运", label: "飞陀客运", hasInput: true, inputKey: "飞陀客运_n", placeholder: "层数" },
        { key: "金酒之杯", label: "金酒之杯", hasInput: false },
      ],
    },
    {
      title: "增伤",
      color: "red",
      items: [
        { key: "讴歌者面纱", label: "讴歌者面纱", hasInput: false },
        { key: "灾难之源", label: "灾难之源", hasInput: false },
        { key: "复仇者", label: "复仇者", hasInput: false },
        { key: "璀璨悲泣", label: "璀璨悲泣", hasInput: false },
        { key: "文明的存续", label: "文明的存续", hasInput: false },
      ],
    },
    {
      title: "特殊",
      color: "purple",
      items: [
        { key: "阿猛", label: "阿猛", hasInput: false },
        { key: "奴隶猎捕器", label: "奴隶猎捕器", hasInput: false },
        { key: "万星源之辉", label: "万星源之辉", hasInput: false },
        { key: "见历", label: "见历", hasInput: false },
        { key: "Scout的狙击镜", label: "Scout的狙击镜", hasInput: true, inputKey: "Scout的狙击镜_n", placeholder: "层数" },
        { key: "Blaze的电锯", label: "Blaze的电锯", hasInput: true, inputKey: "Blaze的电锯_n", placeholder: "层数" },
      ],
    },
    {
      title: "通宝",
      color: "orange",
      items: [
        { key: "火机", label: "火机", hasInput: false },
        { key: "遇良弈", label: "遇良弈", hasInput: false },
        { key: "武人之争", label: "武人之争", hasInput: true, inputKey: "武人之争_n", placeholder: "级别" },
        { key: "贵有衡", label: "贵有衡", hasInput: true, inputKey: "贵有衡_n", placeholder: "层数" },
        { key: "柳伥作", label: "柳伥作", hasInput: false },
        { key: "志欲遂", label: "志欲遂", hasInput: true, inputKey: "志欲遂_n", placeholder: "层数" },
        { key: "火上之灶", label: "火上之灶", hasInput: false },
        { key: "左秉烛", label: "左秉烛", hasInput: true, inputKey: "左秉烛_n", placeholder: "层数" },
      ],
    },
    {
      title: "其余",
      color: "teal",
      items: [
        { key: "皮特水果什锦", label: "皮特水果什锦", hasInput: false },
        { key: "凉拌海草", label: "凉拌海草", hasInput: false },
        { key: "橙味风暴", label: "橙味风暴", hasInput: false },
        { key: "咖啡平原咖啡糖", label: "咖啡平原咖啡糖", hasInput: false },
        { key: "尖叫樱桃", label: "尖叫樱桃", hasInput: false },
        { key: "古旧乐谱残章", label: "古旧乐谱残章", hasInput: false },
        { key: "解约协议", label: "解约协议", hasInput: false },
        { key: "显圣吊坠", label: "显圣吊坠", hasInput: false },
        { key: "皇帝的恩宠", label: "皇帝的恩宠", hasInput: false },
        { key: "损坏的左轮弹巢", label: "损坏的左轮弹巢", hasInput: false },
        { key: "老近卫军之锋", label: "老近卫军之锋", hasInput: false },
      ],
    },
    {
      title: "职业特殊",
      color: "slate",
      items: [
        { key: "铁卫_侵掠", label: "铁卫-侵掠", hasInput: false },
        { key: "折戟_破釜沉舟", label: "折戟-破釜沉舟", hasInput: false },
        { key: "残弩_百步穿杨", label: "残弩-百步穿杨", hasInput: false },
        { key: "残弩_交叉火力", label: "残弩-交叉火力", hasInput: false },
        { key: "残弩_神速", label: "残弩-神速", hasInput: false },
        { key: "断杖_织法者", label: "断杖-织法者", hasInput: false },
        { key: "断杖_苦难巫咒", label: "断杖-苦难巫咒", hasInput: false },
      ],
    },
  ];

  const defenseMultItems = [
    { key: "不赦", label: "不赦 ×1.5" },
    { key: "无封长盒", label: "无封长盒 ×1.3" },
    { key: "残破合影", label: "残破合影 ×0.92" },
    { key: "迷迭香之拥", label: "迷迭香之拥 ×0.8" },
    { key: "同时出现", label: "同时出现 ×1.2" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    red: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400",
    teal: "bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400",
    slate: "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400",
  };

  function applyPreset(name: keyof typeof PRESETS) {
    const p = PRESETS[name];
    inputs = { ...inputs, ...p };
    calculate();
  }

  function toggleRole(role: string) {
    if (selectedRoles.includes(role)) {
      selectedRoles = selectedRoles.filter((r) => r !== role);
    } else {
      selectedRoles = [...selectedRoles, role];
    }
  }

  function selectAllRoles() {
    selectedRoles = OPERATOR_GROUPS.flatMap((g) => g.roles);
  }
  function clearAllRoles() {
    selectedRoles = [];
  }

  function calculate() {
    vars = computeVars(inputs);
    results = calculateRoles(vars, baseAtks, selectedRoles, inputs.烧火棍);
    activeTab = "results";
  }

  function resetAll() {
    inputs = { ...DEFAULT_INPUTS };
    results = [];
    vars = null;
  }

  function fmt(n: number) {
    if (!isFinite(n) || isNaN(n)) return "—";
    return n.toLocaleString("zh-CN", { maximumFractionDigits: 0 });
  }
  function fmtDps(n: number | undefined) {
    if (n === undefined || !isFinite(n) || isNaN(n)) return "";
    return n.toLocaleString("zh-CN", { maximumFractionDigits: 1 });
  }

  // 最大伤害值用于进度条
  $: maxDmg = results.length
    ? Math.max(...results.flatMap((r) => r.skills.map((s) => s.total)))
    : 1;

  const groupColors: Record<string, string> = {
    近卫: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
    术重: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20",
    特种: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/20",
    狙医: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
  };

  const tabs = [
    { id: "items", label: "藏品选择" },
    { id: "inputs", label: "参数输入" },
    { id: "results", label: "计算结果" },
    { id: "base", label: "基础攻击" },
  ];
</script>

<div class="w-full flex flex-col gap-4">
  <!-- 顶栏 -->
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap gap-2">
      {#each Object.keys(PRESETS) as preset}
        <button
          onclick={() => applyPreset(preset as keyof typeof PRESETS)}
          class="px-3 py-1.5 text-sm rounded-lg border border-(--line-divider) bg-(--card-bg) text-70 hover:text-90 hover:border-(--primary) hover:bg-(--primary)/5 transition-all duration-150 cursor-pointer"
        >
          {preset}
        </button>
      {/each}
    </div>
    <div class="flex gap-2">
      <button
        onclick={calculate}
        class="px-4 py-1.5 text-sm font-medium rounded-lg bg-(--primary) text-white hover:opacity-90 transition-opacity cursor-pointer"
      >
        ⚔️ 计算
      </button>
      <button
        onclick={resetAll}
        class="px-4 py-1.5 text-sm rounded-lg border border-(--line-divider) text-60 hover:text-90 transition-colors cursor-pointer"
      >
        重置
      </button>
    </div>
  </div>

  <!-- Tab 导航 -->
  <div class="flex gap-1 border-b border-(--line-divider)">
    {#each tabs as tab}
      <button
        onclick={() => (activeTab = tab.id)}
        class="px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer border-b-2 -mb-px
          {activeTab === tab.id
          ? 'border-(--primary) text-(--primary)'
          : 'border-transparent text-60 hover:text-90'}"
      >
        {tab.label}
        {#if tab.id === "results" && results.length > 0}
          <span class="ml-1 text-xs bg-(--primary)/20 text-(--primary) px-1.5 py-0.5 rounded-full">{results.length}</span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Tab 内容 -->

  <!-- 藏品选择 -->
  {#if activeTab === "items"}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {#each itemSections as section}
        <div class="rounded-xl border border-(--line-divider) bg-(--card-bg) p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full {colorMap[section.color].split(' ')[0].replace('bg-', 'bg-').replace('/10', '/60')}"></span>
            <h3 class="text-sm font-semibold text-90">{section.title}</h3>
          </div>
          <div class="space-y-2">
            {#each section.items as item}
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  bind:checked={inputs[item.key as keyof UserInputs] as boolean}
                  class="w-4 h-4 rounded accent-(--primary) cursor-pointer"
                />
                <span class="text-sm text-70 group-hover:text-90 transition-colors flex-1">
                  {item.label}
                </span>
                {#if item.hasInput && inputs[item.key as keyof UserInputs]}
                  <input
                    type="number"
                    bind:value={inputs[item.inputKey as keyof UserInputs] as number}
                    min="0"
                    class="w-14 text-xs px-2 py-1 rounded-lg border border-(--line-divider) bg-(--card-bg) text-90 text-center focus:outline-none focus:border-(--primary) transition-colors"
                    placeholder={item.placeholder}
                    onkeydown={(e) => e.key === "Enter" && calculate()}
                  />
                {/if}
              </label>
            {/each}
          </div>
        </div>
      {/each}

      <!-- 烧火棍 -->
      <div class="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-lg">🔥</span>
          <h3 class="text-sm font-semibold text-90">辅助效果</h3>
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" bind:checked={inputs.烧火棍} class="w-4 h-4 rounded accent-orange-500 cursor-pointer" />
          <span class="text-sm text-70">烧火棍</span>
        </label>
      </div>
    </div>
  {/if}

  <!-- 参数输入 -->
  {#if activeTab === "inputs"}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 敌方属性 -->
      <div class="rounded-xl border border-(--line-divider) bg-(--card-bg) p-5">
        <h3 class="text-sm font-semibold text-90 mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-(--primary) rounded-full"></span>
          敌方属性
        </h3>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-60 block mb-1">敌人防御</label>
              <input
                type="number"
                bind:value={inputs.敌人防御}
                min="0"
                class="calc-input"
                onkeydown={(e) => e.key === "Enter" && calculate()}
              />
            </div>
            <div>
              <label class="text-xs text-60 block mb-1">敌人法抗 (%)</label>
              <input
                type="number"
                bind:value={inputs.敌人法抗}
                min="0" max="100"
                class="calc-input"
                onkeydown={(e) => e.key === "Enter" && calculate()}
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-60 block mb-1">身形数量</label>
              <input type="number" bind:value={inputs.身形数量} min="0" class="calc-input" />
            </div>
            <div class="flex items-end pb-0.5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" bind:checked={inputs.领袖} class="w-4 h-4 rounded accent-(--primary) cursor-pointer" />
                <span class="text-sm text-70">领袖 (-10%减伤)</span>
              </label>
            </div>
          </div>
          <div>
            <p class="text-xs text-60 mb-2">敌方防御修正</p>
            <div class="grid grid-cols-2 gap-y-1.5 gap-x-3">
              {#each defenseMultItems as dm}
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" bind:checked={inputs[dm.key as keyof UserInputs] as boolean} class="w-3.5 h-3.5 rounded accent-(--primary) cursor-pointer" />
                  <span class="text-xs text-70">{dm.label}</span>
                </label>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- 额外加成 -->
      <div class="rounded-xl border border-(--line-divider) bg-(--card-bg) p-5">
        <h3 class="text-sm font-semibold text-90 mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-(--primary) rounded-full"></span>
          额外加成
        </h3>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-60 block mb-1">局外攻击 (%)</label>
              <input type="number" bind:value={inputs.局外攻击} class="calc-input" onkeydown={(e) => e.key === "Enter" && calculate()} />
            </div>
            <div>
              <label class="text-xs text-60 block mb-1">局内攻击 (%)</label>
              <input type="number" bind:value={inputs.局内攻击} class="calc-input" onkeydown={(e) => e.key === "Enter" && calculate()} />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-60 block mb-1">攻速加成</label>
              <input type="number" bind:value={inputs.攻速加成} class="calc-input" onkeydown={(e) => e.key === "Enter" && calculate()} />
            </div>
            <div>
              <label class="text-xs text-60 block mb-1">脆弱 (%)</label>
              <input type="number" bind:value={inputs.脆弱加成} class="calc-input" onkeydown={(e) => e.key === "Enter" && calculate()} />
            </div>
          </div>
          <div>
            <label class="text-xs text-60 block mb-1">源石锭数目</label>
            <input type="number" bind:value={inputs.源石锭数目} min="0" class="calc-input w-1/2" onkeydown={(e) => e.key === "Enter" && calculate()} />
          </div>
        </div>
      </div>

      <!-- 选择干员 -->
      <div class="rounded-xl border border-(--line-divider) bg-(--card-bg) p-5 md:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-90 flex items-center gap-2">
            <span class="w-1 h-4 bg-(--primary) rounded-full"></span>
            计算干员
          </h3>
          <div class="flex gap-2">
            <button onclick={selectAllRoles} class="text-xs text-60 hover:text-90 px-2 py-1 rounded border border-(--line-divider) cursor-pointer transition-colors">全选</button>
            <button onclick={clearAllRoles} class="text-xs text-60 hover:text-90 px-2 py-1 rounded border border-(--line-divider) cursor-pointer transition-colors">取消</button>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {#each OPERATOR_GROUPS as group}
            <div>
              <div class="text-xs font-medium mb-2 px-2 py-0.5 rounded-full inline-block border {groupColors[group.group]}">
                {group.group}
              </div>
              <div class="space-y-1.5">
                {#each group.roles as role}
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onchange={() => toggleRole(role)}
                      class="w-4 h-4 rounded accent-(--primary) cursor-pointer"
                    />
                    <span class="text-sm text-70 group-hover:text-90 transition-colors">{role}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- 计算结果 -->
  {#if activeTab === "results"}
    {#if results.length === 0}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="text-5xl mb-4">⚔️</div>
        <p class="text-90 font-medium mb-2">尚未计算</p>
        <p class="text-60 text-sm mb-6">请在「藏品选择」和「参数输入」中配置好数据，然后点击计算</p>
        <button
          onclick={calculate}
          class="px-6 py-2 text-sm font-medium rounded-lg bg-(--primary) text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          立即计算
        </button>
      </div>
    {:else}
      <div class="space-y-4">
        {#each results as roleResult}
          <div class="rounded-xl border border-(--line-divider) bg-(--card-bg) overflow-hidden">
            <div class="flex items-center gap-3 px-5 py-3 border-b border-(--line-divider)">
              <span class="text-xs px-2 py-0.5 rounded-full border font-medium {groupColors[roleResult.group]}">
                {roleResult.group}
              </span>
              <h3 class="text-sm font-bold text-90">{roleResult.role}</h3>
            </div>
            <div class="p-4 space-y-3">
              {#each roleResult.skills as skill}
                <div class="space-y-1">
                  <!-- 主技能 -->
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-60 w-28 shrink-0">{skill.name}</span>
                    <div class="flex-1 relative h-5">
                      <div
                        class="absolute inset-y-0 left-0 rounded-full bg-(--primary)/30 transition-all duration-500"
                        style="width: {Math.min((skill.total / maxDmg) * 100, 100).toFixed(1)}%"
                      ></div>
                      <span class="absolute inset-y-0 left-2 flex items-center text-xs font-mono font-semibold text-90">
                        {fmt(skill.total)}
                      </span>
                    </div>
                    {#if skill.dps !== undefined}
                      <span class="text-xs text-60 font-mono w-20 text-right shrink-0">
                        DPS {fmtDps(skill.dps)}
                      </span>
                    {/if}
                  </div>
                  <!-- 烧火棍 -->
                  {#if skill.fire !== undefined}
                    <div class="flex items-center gap-3 pl-4">
                      <span class="text-xs text-orange-500/80 w-28 shrink-0 flex items-center gap-1">
                        🔥 {skill.name.length > 6 ? "烧火棍" : skill.name + "烧"}
                      </span>
                      <div class="flex-1 relative h-4">
                        <div
                          class="absolute inset-y-0 left-0 rounded-full bg-orange-500/20 transition-all duration-500"
                          style="width: {Math.min((skill.fire / maxDmg) * 100, 100).toFixed(1)}%"
                        ></div>
                        <span class="absolute inset-y-0 left-2 flex items-center text-xs font-mono text-orange-600 dark:text-orange-400">
                          {fmt(skill.fire)}
                        </span>
                      </div>
                      {#if skill.fireDps !== undefined}
                        <span class="text-xs text-orange-500/70 font-mono w-20 text-right shrink-0">
                          DPS {fmtDps(skill.fireDps)}
                        </span>
                      {/if}
                    </div>
                  {/if}
                  <!-- 额外数据 -->
                  {#if skill.extra}
                    {#each skill.extra as ex}
                      <div class="flex items-center gap-3 pl-4">
                        <span class="text-xs text-50 w-28 shrink-0 truncate">{ex.label}</span>
                        <span class="text-xs font-mono text-60">{fmt(ex.value)}</span>
                      </div>
                    {/each}
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- 备注 -->
      <div class="rounded-xl border border-(--line-divider) bg-(--card-bg) p-4 text-xs text-50 space-y-1 leading-relaxed">
        <p>① 未考虑万星源之辉造成的法伤</p>
        <p>② 万星源之辉、奴隶猎捕器只参与了艾丽妮、霍尔海雅攻击不含浮空抗性的敌人时伤害计算</p>
        <p>③ 计算"岁"的物法伤害时，由于"岁"不具有难度减伤，但该程序默认减伤为10%，故不勾选"领袖"也会少10%的伤害</p>
        <p>④ 本计算器只为粗略计算，仅具有参考价值。原版制作：@云音梦歌</p>
      </div>
    {/if}
  {/if}

  <!-- 基础攻击配置 -->
  {#if activeTab === "base"}
    <div class="rounded-xl border border-(--line-divider) bg-(--card-bg) p-5">
      <h3 class="text-sm font-semibold text-90 mb-4 flex items-center gap-2">
        <span class="w-1 h-4 bg-(--primary) rounded-full"></span>
        干员基础攻击力
      </h3>
      <p class="text-xs text-60 mb-4">填入干员在当前局内的基础攻击力（含精英化加成，不含其他加成）</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {#each OPERATOR_GROUPS as group}
          {#each group.roles as role}
            <div>
              <label class="text-xs text-60 block mb-1">{role}</label>
              <input
                type="number"
                bind:value={baseAtks[role as keyof BaseAttacks]}
                min="0"
                class="calc-input"
                placeholder="0"
              />
            </div>
          {/each}
        {/each}
      </div>
    </div>
  {/if}

  <!-- 变量查看（折叠） -->
  {#if vars && (activeTab === "results")}
    <div class="rounded-xl border border-(--line-divider) overflow-hidden">
      <button
        onclick={() => (showVars = !showVars)}
        class="w-full flex items-center justify-between px-5 py-3 text-sm text-70 hover:text-90 transition-colors bg-(--card-bg) cursor-pointer"
      >
        <span class="font-medium">变量详情</span>
        <span class="text-xs text-50 transition-transform duration-200" style="transform: rotate({showVars ? 180 : 0}deg)">▼</span>
      </button>
      {#if showVars}
        <div class="px-5 py-4 bg-(--card-bg) border-t border-(--line-divider)">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {#each Object.entries(vars) as [key, val]}
              <div class="flex justify-between items-center text-xs py-1 border-b border-(--line-divider)/50">
                <span class="text-60">{key}</span>
                <span class="font-mono text-90">{Number(val).toFixed(4)}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :global(.calc-input) {
    width: 100%;
    padding: 0.375rem 0.625rem;
    font-size: 0.875rem;
    border-radius: 0.5rem;
    border: 1px solid var(--line-divider);
    background-color: var(--card-bg);
    color: var(--text-90);
    transition: border-color 0.15s;
    outline: none;
  }
  :global(.calc-input:focus) {
    border-color: var(--primary);
  }
</style>

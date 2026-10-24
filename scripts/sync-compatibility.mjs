import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultOutputPath = join(docsRoot, "lib", "compatibility", "data.json");

const FEATURE_LABELS = {
  "dev.turboism.sdk.cubism.textureatlas.TextureAtlasPolygonLayoutService": {
    en: "Polygon-aware atlas layout",
    zh: "多边形图集布局",
    ja: "ポリゴン対応アトラスレイアウト",
    ko: "폴리곤 인식 아틀라스 레이아웃",
  },
  "dev.turboism.sdk.cubism.textureatlas.TextureAtlasEditorSession": {
    en: "Native atlas editor session access",
    zh: "原生纹理图集编辑器会话访问",
    ja: "ネイティブアトラスエディタセッションへのアクセス",
    ko: "네이티브 아틀라스 편집기 세션 액세스",
  },
  "dev.turboism.sdk.cubism.textureatlas.TextureAtlasEditorUi": {
    en: "Native atlas editor UI contribution",
    zh: "原生纹理图集编辑器 UI 贡献",
    ja: "ネイティブアトラスエディタ UI 贡献",
    ko: "네이티브 아틀라스 편집기 UI 기여",
  },
  "dev.turboism.sdk.cubism.textureatlas.TextureAtlasEditorPanel": {
    en: "Atlas editor panel",
    zh: "图集编辑器面板",
    ja: "アトラスエディタパネル",
    ko: "아틀라스 편집기 패널",
  },
  "dev.turboism.sdk.cubism.model.ModelTextures#exportRawImagePsd": {
    en: "Export PSD raw image",
    zh: "导出 PSD 原图",
    ja: "PSD 原画像のエクスポート",
    ko: "PSD 원본 이미지 내보내기",
  },
  "dev.turboism.sdk.cubism.model.ModelTextures#replaceRawImagePsd": {
    en: "Replace PSD raw image",
    zh: "替换 PSD 原图",
    ja: "PSD 原画像の置き換え",
    ko: "PSD 원본 이미지 교체",
  },
  "dev.turboism.sdk.cubism.export.ExportSettingsContributionService": {
    en: "Export settings contribution",
    zh: "导出设置贡献",
    ja: "エクスポート設定贡献",
    ko: "내보내기 설정 기여",
  },
  "dev.turboism.sdk.cubism.backup.EditorAutoBackupService": {
    en: "Editor auto-backup",
    zh: "编辑器自动备份",
    ja: "エディタ自動バックアップ",
    ko: "에디터 자동 백업",
  },
  "dev.turboism.sdk.cubism.backup.EditorAutoBackupService#artifacts": {
    en: "Auto-backup artifacts",
    zh: "自动备份工件",
    ja: "自動バックアップ成果物",
    ko: "자동 백업 아티팩트",
  },
  "dev.turboism.sdk.cubism.backup.EditorAutoBackupService#backupAfterSave": {
    en: "Save-triggered auto-backup",
    zh: "保存触发的自动备份",
    ja: "保存時の自動バックアップ",
    ko: "저장 시 자동 백업",
  },
  "turboism.editor_commands.execute": {
    en: "MCP editor command execution",
    zh: "MCP 编辑器命令执行",
    ja: "MCP Editor コマンド実行",
    ko: "MCP Editor 명령 실행",
  },
  "turboism://host/editor-commands": {
    en: "MCP editor-command listing",
    zh: "MCP 编辑器命令清单",
    ja: "MCP Editor コマンド一覧",
    ko: "MCP Editor 명령 목록",
  },
  "cubism.editor-ui.top-menu": {
    en: "Top menu integration",
    zh: "顶部菜单集成",
    ja: "トップメニュー統合",
    ko: "상단 메뉴 통합",
  },
  "cubism.geometry.read": {
    en: "Mesh geometry read",
    zh: "网格几何读取",
    ja: "メッシュジオメトリ読み取り",
    ko: "메시 지오메트리 읽기",
  },
  "cubism.modeling-tool.selection-brush": {
    en: "Modeling selection brush",
    zh: "建模选区笔刷",
    ja: "モデリング選択ブラシ",
    ko: "모델링 선택 브러시",
  },
  "cubism.protected-export.orchestration": {
    en: "Protected-export orchestration",
    zh: "受保护导出编排",
    ja: "保護付きエクスポートオーケストレーション",
    ko: "보호된 내보내기 오케스트레이션",
  },
  "cubism.autobackup.backup": {
    en: "Auto-backup creation",
    zh: "自动备份创建",
    ja: "自動バックアップ作成",
    ko: "자동 백업 생성",
  },
  "cubism.autobackup.settings": {
    en: "Auto-backup settings",
    zh: "自动备份设置",
    ja: "自動バックアップ設定",
    ko: "자동 백업 설정",
  },
  "cubism.editor-model.auto-yure.read": {
    en: "Auto sway (yure) read",
    zh: "自动摇动读取",
    ja: "自動揺れ読み取り",
    ko: "자동 흔들림 읽기",
  },
  "cubism.integration.external-app-settings.edit-toggle": {
    en: "External-app editing toggle",
    zh: "外部应用编辑开关",
    ja: "外部アプリ編集トグル",
    ko: "외부 앱 편집 토글",
  },
  "cubism.integration.edit-api-bridge.dispatch": {
    en: "Edit protocol bridge dispatch",
    zh: "编辑协议桥接派发",
    ja: "編集プロトコルブリッジディスパッチ",
    ko: "편집 프로토콜 브리지 디스패치",
  },
  "cubism.editor-model.animation-eval": {
    en: "Animation evaluated-parameter bake",
    zh: "动画求值参数烘焙",
    ja: "アニメーション評価パラメータベイク",
    ko: "애니메이션 평가 파라미터 베이크",
  },
  "cubism.editor-model.animation-timeline.write": {
    en: "Animation timeline curve writes",
    zh: "动画时间线曲线写入",
    ja: "アニメーションタイムラインカーブ書き込み",
    ko: "애니메이션 타임라인 커브 쓰기",
  },
  "cubism.editor-model.moc-export.read": {
    en: "Official MOC 5.3 export settings",
    zh: "官方 MOC 5.3 导出设置",
    ja: "公式 MOC 5.3 エクスポート設定",
    ko: "공식 MOC 5.3 내보내기 설정",
  },
  "cubism.editor-model.part-inspector.write": {
    en: "Part inspector writes",
    zh: "部件检查器写入",
    ja: "パーツインスペクタ書き込み",
    ko: "파트 인스펙터 쓰기",
  },
  "cubism.editor-model.part-opacity.write": {
    en: "Part opacity writes",
    zh: "部件不透明度写入",
    ja: "パーツ不透明度書き込み",
    ko: "파트 불투명도 쓰기",
  },
};

const BOUNDARY_TRIAGE = new Set(["CAPABILITY_BOUNDARY", "ADMISSION_STATIC"]);

function versionKey(version) {
  return version.split(".").map((part) => Number.parseInt(part, 10));
}

function compareVersions(a, b) {
  const ka = versionKey(a);
  const kb = versionKey(b);
  for (let i = 0; i < 3; i += 1) {
    if (ka[i] !== kb[i]) return ka[i] - kb[i];
  }
  return 0;
}

function compactRanges(versions, reviewed) {
  const chosen = new Set(versions);
  const ordered = reviewed.filter((v) => chosen.has(v));
  if (ordered.length === 0) return "—";
  if (ordered.length === reviewed.length) {
    return `${reviewed[0]}–${reviewed[reviewed.length - 1]}`;
  }
  const index = new Map(reviewed.map((v, i) => [v, i]));
  const runs = [[ordered[0]]];
  for (const v of ordered.slice(1)) {
    const currentRun = runs[runs.length - 1];
    const prev = currentRun[currentRun.length - 1];
    if (index.get(v) === index.get(prev) + 1) {
      currentRun.push(v);
    } else {
      runs.push([v]);
    }
  }
  return runs
    .map((run) => (run.length === 1 ? run[0] : `${run[0]}–${run[run.length - 1]}`))
    .join(", ");
}

function resolveFeatureLabel(key) {
  const normalized = key.replace(/\(\)$/, "");
  return FEATURE_LABELS[key] ?? FEATURE_LABELS[normalized] ?? null;
}

function isPrefixBoundaryOnly(missingNature, versions) {
  const entries = Object.entries(missingNature ?? {});
  if (entries.length === 0 || !versions || versions.length === 0) return false;
  const earliest = [...versions].sort(compareVersions)[0];
  const boundaryVersions = entries
    .filter(([, kind]) => kind === "boundary")
    .map(([v]) => v);
  if (boundaryVersions.length === 0) return false;
  return boundaryVersions.every((v) => compareVersions(v, earliest) < 0);
}

function summarizeHostValidation(tasks, reviewed) {
  const passed = new Set();
  const boundary = new Set();
  for (const versions of Object.values(tasks ?? {})) {
    for (const [version, result] of Object.entries(versions ?? {})) {
      const status = result?.validationStatus ?? "";
      const category = result?.triageCategory ?? "";
      if (status === "PASS") {
        passed.add(version);
      } else if (BOUNDARY_TRIAGE.has(category)) {
        boundary.add(version);
      }
    }
  }
  for (const v of passed) {
    boundary.delete(v);
  }
  return {
    verified: passed.size > 0 ? compactRanges([...passed], reviewed) : null,
    boundary: boundary.size > 0 ? compactRanges([...boundary], reviewed) : null,
  };
}

function resolveSourceRoot(sourceArgument) {
  const conventionalCandidates = ["/opt/dev/projects/turboism"];
  let current = docsRoot;
  while (true) {
    conventionalCandidates.push(
      join(current, "turboism"),
      resolve(current, "..", "turboism"),
    );
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  const candidates = [
    sourceArgument,
    process.env.TURBOISM_SOURCE_ROOT,
    ...conventionalCandidates,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const resolved = resolve(candidate);
    if (
      existsSync(
        join(resolved, "compatibility", "cubism", "compatibility-matrix.json"),
      ) &&
      existsSync(
        join(resolved, "compatibility", "cubism", "version-boundaries.json"),
      )
    ) {
      return resolved;
    }
  }

  throw new Error(
    "Turboism source repository with compatibility/cubism/{compatibility-matrix,version-boundaries}.json not found. Pass its directory or set TURBOISM_SOURCE_ROOT.",
  );
}

function readGitCommit(sourceRoot) {
  const full = execFileSync("git", ["-C", sourceRoot, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const short = execFileSync(
    "git",
    ["-C", sourceRoot, "rev-parse", "--short=9", "HEAD"],
    { encoding: "utf8" },
  ).trim();
  return { short, full };
}

export function buildCompatibilityData(sourceRoot) {
  const matrixPath = join(
    sourceRoot,
    "compatibility",
    "cubism",
    "compatibility-matrix.json",
  );
  const boundariesPath = join(
    sourceRoot,
    "compatibility",
    "cubism",
    "version-boundaries.json",
  );

  const matrix = JSON.parse(readFileSync(matrixPath, "utf8"));
  const boundariesDoc = JSON.parse(readFileSync(boundariesPath, "utf8"));

  if (matrix.format !== "turboism.compatibility-matrix/v1") {
    throw new Error(`Unexpected compatibility matrix format: ${matrix.format}`);
  }
  if (boundariesDoc.format !== "turboism.version-boundaries/v1") {
    throw new Error(`Unexpected version boundaries format: ${boundariesDoc.format}`);
  }

  const { short: sourceCommit, full: sourceCommitFull } = readGitCommit(sourceRoot);
  const reviewed = matrix.reviewedVersions;
  const reviewedRange = `${reviewed[0]}–${reviewed[reviewed.length - 1]}`;
  const capById = new Map(matrix.capabilities.map((c) => [c.id, c]));
  const boundaryById = new Map(
    (boundariesDoc.boundaries ?? []).map((b) => [b.id, b]),
  );

  const minorPrefixes = [
    { line: "5.0.x", prefix: "5.0." },
    { line: "5.1.x", prefix: "5.1." },
    { line: "5.2.x", prefix: "5.2." },
    { line: "5.3.x", prefix: "5.3." },
  ];

  const capabilityGroups = matrix.capabilityGroups.map((group) => {
    const total = group.capabilities.length;
    const minorCoverage = {};
    for (const { line, prefix } of minorPrefixes) {
      const lineVersions = reviewed.filter((v) => v.startsWith(prefix));
      const counts = lineVersions.map(
        (v) =>
          group.capabilities.filter((capId) =>
            capById.get(capId)?.admitted.includes(v),
          ).length,
      );
      const minAdmitted = Math.min(...counts);
      const maxAdmitted = Math.max(...counts);
      let status = "partial";
      let fullFrom = null;
      if (minAdmitted === total) {
        status = "full";
      } else if (maxAdmitted === 0) {
        status = "none";
      } else if (minAdmitted !== maxAdmitted && maxAdmitted === total) {
        const idx = counts.findIndex((c) => c === total);
        fullFrom = lineVersions[idx] ?? null;
      }
      minorCoverage[line] = {
        status,
        minAdmitted,
        maxAdmitted,
        total,
        ...(fullFrom ? { fullFrom } : {}),
      };
    }
    return {
      id: group.id,
      label: group.label,
      totalCapabilities: total,
      minorCoverage,
    };
  });

  const minorLines = minorPrefixes.map(({ line, prefix }) => {
    const versions = reviewed.filter((v) => v.startsWith(prefix));
    const latestInLine = versions[versions.length - 1];
    const earliestInLine = versions[0];
    const admittedAtStart = matrix.capabilities.filter((c) =>
      c.admitted.includes(earliestInLine),
    ).length;
    const admittedAtEnd = matrix.capabilities.filter((c) =>
      c.admitted.includes(latestInLine),
    ).length;
    let fullGroups = 0;
    let partialGroups = 0;
    let noneGroups = 0;
    for (const group of capabilityGroups) {
      const cov = group.minorCoverage[line];
      if (cov.status === "full") fullGroups += 1;
      else if (cov.status === "none") noneGroups += 1;
      else partialGroups += 1;
    }
    return {
      line,
      range: `${earliestInLine}–${latestInLine}`,
      count: versions.length,
      versions,
      admittedCapabilitiesStart: admittedAtStart,
      admittedCapabilitiesEnd: admittedAtEnd,
      totalCapabilities: matrix.capabilities.length,
      fullGroups,
      partialGroups,
      noneGroups,
    };
  });

  const plugins = matrix.plugins.map((plugin) => {
    const supported = plugin.supportedVersions ?? [];
    const full = plugin.fullFeatureVersions ?? [];
    const allReviewed = supported.length === reviewed.length;
    const supportedRange = allReviewed
      ? "all"
      : compactRanges(supported, reviewed);
    const supportedBoundaryPrefix =
      !allReviewed && isPrefixBoundaryOnly(plugin.supportedGaps, supported);

    let fullFeatureSince = null;
    if (full.length > 0 && full.length < supported.length) {
      const earliestFull = [...full].sort(compareVersions)[0];
      const expectedSuffix = reviewed.filter(
        (v) => compareVersions(v, earliestFull) >= 0,
      );
      if (full.length === expectedSuffix.length) {
        fullFeatureSince = earliestFull;
      }
    }

    const partialFeatures = [];
    for (const note of (plugin.partialFeatures ?? []).slice(0, 5)) {
      const label = resolveFeatureLabel(note.key);
      if (!label) continue;
      const versions = note.versions ?? [];
      const missingOn = note.missingOn ?? [];
      const onlyMode = versions.length <= Math.floor(reviewed.length / 2);
      const range = onlyMode
        ? compactRanges(versions, reviewed)
        : compactRanges(missingOn, reviewed);
      const boundaryPrefix = isPrefixBoundaryOnly(note.missingNature, versions);
      const item = {
        key: note.key.replace(/\(\)$/, ""),
        mode: onlyMode ? "only" : "not_on",
        range,
        boundaryPrefix,
        label,
      };
      if (note.officialSource) {
        item.officialSource = {
          version: note.officialSource.version,
          url: note.officialSource.url,
          ...(note.officialSource.nameZh
            ? { nameZh: note.officialSource.nameZh }
            : {}),
          ...(note.officialSource.nameEn
            ? { nameEn: note.officialSource.nameEn }
            : {}),
        };
      }
      partialFeatures.push(item);
    }

    return {
      directory: plugin.directory,
      id: plugin.id,
      name: plugin.name,
      requiresCubism: Boolean(plugin.requiresCubism),
      supportedRange,
      supportedCount: supported.length,
      supportedBoundaryPrefix,
      ...(fullFeatureSince ? { fullFeatureSince } : {}),
      partialFeatures,
      hostValidation: summarizeHostValidation(plugin.hostValidation, reviewed),
    };
  });

  const restrictedCapabilities = matrix.capabilities
    .filter((cap) => cap.admitted.length < reviewed.length)
    .map((cap) => {
      const missing = reviewed.filter((v) => !cap.admitted.includes(v));
      const boundary = boundaryById.get(cap.id);
      const introducedIn = [...cap.admitted].sort(compareVersions)[0] ?? null;
      return {
        id: cap.id,
        group: cap.group,
        label: resolveFeatureLabel(cap.id) ?? {
          en: cap.id,
          zh: cap.id,
          ja: cap.id,
          ko: cap.id,
        },
        admittedRange: compactRanges(cap.admitted, reviewed),
        missingRange: compactRanges(missing, reviewed),
        introducedIn,
        ...(boundary?.officialSource
          ? { officialSource: boundary.officialSource }
          : {}),
      };
    });

  const releases = [
    {
      version: "0.67.4",
      channel: "stable",
      cubismVersions: reviewed,
      cubismRange: reviewedRange,
      platforms: ["windows-x64"],
    },
    {
      version: "0.44.0",
      channel: "stable",
      cubismVersions: ["5.2.03", "5.3.02", "5.3.03"],
      cubismRange: "5.2.03, 5.3.02, 5.3.03",
      platforms: ["windows-x64"],
    },
  ];

  return {
    format: "turboism-docs.compatibility/v1",
    sourceCommit,
    sourceCommitFull,
    matrixFormat: matrix.format,
    boundariesFormat: boundariesDoc.format,
    reviewedVersions: reviewed,
    reviewedRange,
    releases,
    minorLines,
    plugins,
    capabilityGroups,
    restrictedCapabilities,
  };
}

function main() {
  const args = process.argv.slice(2);
  let sourceArgument;
  let check = false;
  let outputPath = defaultOutputPath;

  for (const arg of args) {
    if (arg === "--check") {
      check = true;
    } else if (arg.startsWith("--source=")) {
      sourceArgument = arg.slice("--source=".length).trim();
    } else if (arg.startsWith("--output=")) {
      outputPath = resolve(arg.slice("--output=".length).trim());
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else if (sourceArgument === undefined) {
      sourceArgument = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  const sourceRoot = resolveSourceRoot(sourceArgument);
  const data = buildCompatibilityData(sourceRoot);
  const serialized = `${JSON.stringify(data, null, 2)}\n`;

  if (check) {
    if (!existsSync(outputPath)) {
      throw new Error(`Compatibility data file is missing: ${outputPath}`);
    }
    const existing = readFileSync(outputPath, "utf8");
    if (existing !== serialized) {
      throw new Error(
        `Compatibility data is out of date: ${outputPath}. Run 'node scripts/sync-compatibility.mjs'.`,
      );
    }
    console.log(
      `OK: ${outputPath} matches Turboism ${data.sourceCommit} (${data.reviewedVersions.length} versions, ${data.plugins.length} plugins, ${data.capabilityGroups.length} capability groups).`,
    );
    return;
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serialized, "utf8");
  console.log(
    `Wrote ${outputPath} from Turboism ${data.sourceCommit} (${data.reviewedVersions.length} versions, ${data.plugins.length} plugins, ${data.capabilityGroups.length} capability groups).`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

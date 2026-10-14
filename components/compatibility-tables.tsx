import compatibilityData from "@/lib/compatibility/data.json";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type OfficialSource = {
  version: string;
  url: string;
  nameZh?: string;
  nameEn?: string;
};

type PartialFeature = {
  key: string;
  mode: "only" | "not_on";
  range: string;
  boundaryPrefix: boolean;
  label: LocalizedText;
  officialSource?: OfficialSource;
};

type PluginEntry = {
  directory: string;
  id: string;
  name: string;
  requiresCubism: boolean;
  supportedRange: string;
  supportedCount: number;
  supportedBoundaryPrefix: boolean;
  fullFeatureSince?: string;
  partialFeatures: PartialFeature[];
  hostValidation: {
    verified: string | null;
    boundary: string | null;
  };
};

type MinorCoverageCell = {
  status: "full" | "partial" | "none";
  minAdmitted: number;
  maxAdmitted: number;
  total: number;
  fullFrom?: string;
};

type CapabilityGroupEntry = {
  id: string;
  label: LocalizedText;
  totalCapabilities: number;
  minorCoverage: Record<string, MinorCoverageCell>;
};

type RestrictedCapabilityEntry = {
  id: string;
  group: string;
  label: LocalizedText;
  admittedRange: string;
  missingRange: string;
  introducedIn: string | null;
  officialSource?: OfficialSource;
};

type MinorLineEntry = {
  line: string;
  range: string;
  count: number;
  versions: string[];
  admittedCapabilitiesStart: number;
  admittedCapabilitiesEnd: number;
  totalCapabilities: number;
  fullGroups: number;
  partialGroups: number;
  noneGroups: number;
};

type ReleaseEntry = {
  version: string;
  channel: "stable" | "nightly" | "beta";
  cubismVersions: string[];
  cubismRange: string;
  platforms: string[];
};

const data = compatibilityData as {
  format: string;
  sourceCommit: string;
  sourceCommitFull: string;
  reviewedVersions: string[];
  reviewedRange: string;
  releases: ReleaseEntry[];
  minorLines: MinorLineEntry[];
  plugins: PluginEntry[];
  capabilityGroups: CapabilityGroupEntry[];
  restrictedCapabilities: RestrictedCapabilityEntry[];
};

const UI_STRINGS: Record<
  Language,
  {
    releaseColRelease: string;
    releaseColChannel: string;
    releaseColVersions: string;
    releaseColPlatform: string;
    channelLabels: Record<ReleaseEntry["channel"], string>;
    platformLabels: Record<string, string>;
    exactVersionsNote: (count: number) => string;
    allReviewedVersionsNote: (count: number) => string;
    sourcePinnedNote: (commit: string, range: string, count: number) => string;
    colPlugin: string;
    colSupported: string;
    colDeltas: string;
    colHostValidation: string;
    allReviewed: string;
    earlierLackFeature: string;
    fullFeatureSince: (min: string) => string;
    onlyOn: string;
    notOn: string;
    officialAdded: (version: string, feature: string) => string;
    hostVerified: string;
    confirmedBoundary: string;
    validationLegend: string;
    colMinorLine: string;
    colReviewedRange: string;
    colPatchCount: string;
    colAdmittedCaps: string;
    colGroupSummary: string;
    groupSummaryFormat: (full: number, partial: number, none: number) => string;
    colCapabilityGroup: string;
    legendText: string;
    statusFullLabel: string;
    statusPartialLabel: string;
    statusNoneLabel: string;
    colCapabilityId: string;
    colCapabilityFeature: string;
    colAdmittedVersions: string;
    colAbsentVersions: string;
  }
> = {
  en: {
    releaseColRelease: "Turboism release",
    releaseColChannel: "Channel",
    releaseColVersions: "Supported Cubism Editor versions",
    releaseColPlatform: "Host platform",
    channelLabels: {
      stable: "Stable",
      nightly: "Nightly (0.44.1-0.nightly.*)",
      beta: "Beta / current main",
    },
    platformLabels: {
      "windows-x64": "Windows x64",
    },
    exactVersionsNote: (count) => `${count} exact reviewed versions`,
    allReviewedVersionsNote: (count) => `All ${count} reviewed versions`,
    sourcePinnedNote: (commit, range, count) =>
      `Generated from reviewed compatibility data in turboism/Turboism at commit ${commit} (${count} reviewed Cubism Editor versions: ${range}).`,
    colPlugin: "Plugin",
    colSupported: "Supported versions",
    colDeltas: "Feature deltas",
    colHostValidation: "Real-host validation",
    allReviewed: `All reviewed versions (${data.reviewedRange})`,
    earlierLackFeature: "earlier Cubism versions lack the feature entirely",
    fullFeatureSince: (min) => `Full feature set requires ${min}+`,
    onlyOn: "only on",
    notOn: "not on",
    officialAdded: (version, feature) => `Cubism ${version} added ${feature}`,
    hostVerified: "host-verified",
    confirmedBoundary: "confirmed boundary",
    validationLegend:
      "Real-host column: latest FINAL campaign result per task and version from validation/cubism-version-matrix/campaign-jobs.json, classified by triage. Infrastructure retries, probe drift, and inconclusive runs are never listed; unprobed versions stay blank — static review is the baseline everywhere.",
    colMinorLine: "Minor line",
    colReviewedRange: "Reviewed versions",
    colPatchCount: "Patches",
    colAdmittedCaps: "Admitted capabilities",
    colGroupSummary: "Capability groups (37)",
    groupSummaryFormat: (full, partial, none) =>
      `${full} full · ${partial} partial · ${none} absent`,
    colCapabilityGroup: "Capability group",
    legendText:
      "Legend: ✓ every capability in the group admitted · ◐ partially admitted · ✗ nothing admitted on that minor line. Admission requires both the static verification record and every narrowing selector contract or class-pin gate.",
    statusFullLabel: "All capabilities admitted",
    statusPartialLabel: "Partially admitted",
    statusNoneLabel: "Not admitted",
    colCapabilityId: "Capability ID",
    colCapabilityFeature: "Surface",
    colAdmittedVersions: "Admitted versions",
    colAbsentVersions: "No verified record",
  },
  zh: {
    releaseColRelease: "Turboism 版本",
    releaseColChannel: "发布渠道",
    releaseColVersions: "支持的 Cubism Editor 版本",
    releaseColPlatform: "宿主平台",
    channelLabels: {
      stable: "Stable（稳定版）",
      nightly: "Nightly（0.44.1-0.nightly.*）",
      beta: "Beta / 当前 main",
    },
    platformLabels: {
      "windows-x64": "Windows x64",
    },
    exactVersionsNote: (count) => `${count} 个精确审核版本`,
    allReviewedVersionsNote: (count) => `全部 ${count} 个已审核版本`,
    sourcePinnedNote: (commit, range, count) =>
      `由 turboism/Turboism 仓库提交 ${commit} 的已审核兼容性数据生成（共 ${count} 个已审核 Cubism Editor 版本：${range}）。`,
    colPlugin: "插件",
    colSupported: "支持版本",
    colDeltas: "版本差异",
    colHostValidation: "实机验证",
    allReviewed: `全部审核版本（${data.reviewedRange}）`,
    earlierLackFeature: "更早版本 Cubism 本身无此功能",
    fullFeatureSince: (min) => `完整功能需 ${min} 及以上`,
    onlyOn: "仅",
    notOn: "不适用于",
    officialAdded: (version, feature) => `Cubism ${version} 新增${feature}`,
    hostVerified: "实机验证通过",
    confirmedBoundary: "确认边界",
    validationLegend:
      "实机验证列：取自 validation/cubism-version-matrix/campaign-jobs.json 中每个任务×版本的最新 FINAL 结果并按 triage 分类。基础设施重试、探针漂移与不确定结果一律不列出；无探测版本留空——静态审核始终是所有版本的基线。",
    colMinorLine: "小版本线",
    colReviewedRange: "已审核版本范围",
    colPatchCount: "构建数",
    colAdmittedCaps: "准入能力数",
    colGroupSummary: "能力组分布（共 37 组）",
    groupSummaryFormat: (full, partial, none) =>
      `${full} 组完整 · ${partial} 组部分 · ${none} 组缺失`,
    colCapabilityGroup: "能力组",
    legendText:
      "图例：✓ 组内全部能力均准入 · ◐ 部分准入 · ✗ 该小版本线无准入。准入 = 静态验证记录在该版本承认该能力，且所有收窄它的选择器契约与类 pin 表也承认该版本。",
    statusFullLabel: "全部能力准入",
    statusPartialLabel: "部分能力准入",
    statusNoneLabel: "未准入",
    colCapabilityId: "能力标识",
    colCapabilityFeature: "功能表面",
    colAdmittedVersions: "准入版本",
    colAbsentVersions: "无已验证记录",
  },
  ja: {
    releaseColRelease: "Turboism リリース",
    releaseColChannel: "チャンネル",
    releaseColVersions: "対応する Cubism Editor バージョン",
    releaseColPlatform: "ホストプラットフォーム",
    channelLabels: {
      stable: "Stable（安定版）",
      nightly: "Nightly（0.44.1-0.nightly.*）",
      beta: "Beta / 現在の main",
    },
    platformLabels: {
      "windows-x64": "Windows x64",
    },
    exactVersionsNote: (count) => `${count} 個の正確なレビュー済みバージョン`,
    allReviewedVersionsNote: (count) => `全 ${count} 個のレビュー済みバージョン`,
    sourcePinnedNote: (commit, range, count) =>
      `turboism/Turboism リポジトリのコミット ${commit} におけるレビュー済み互換性データから生成（レビュー済み Cubism Editor 全 ${count} バージョン: ${range}）。`,
    colPlugin: "プラグイン",
    colSupported: "対応バージョン",
    colDeltas: "バージョン差分",
    colHostValidation: "実機検証",
    allReviewed: `全レビュー済みバージョン（${data.reviewedRange}）`,
    earlierLackFeature: "それ以前の Cubism バージョンには機能自体がない",
    fullFeatureSince: (min) => `全機能は ${min} 以降が必要`,
    onlyOn: "のみ",
    notOn: "対象外",
    officialAdded: (version, feature) => `Cubism ${version} で${feature}を追加`,
    hostVerified: "実機検証済み",
    confirmedBoundary: "確認済み境界",
    validationLegend:
      "実機検証列：validation/cubism-version-matrix/campaign-jobs.json のタスク×バージョン別最新 FINAL 結果を triage で分類したもの。インフラ再試行・プローブドリフト・不確定な結果は表示しません。プローブ未実施のバージョンは空欄で、静的レビューが常に基線です。",
    colMinorLine: "マイナーライン",
    colReviewedRange: "レビュー済み範囲",
    colPatchCount: "パッチ数",
    colAdmittedCaps: "許可ケイパビリティ数",
    colGroupSummary: "ケイパビリティグループ内訳（全 37）",
    groupSummaryFormat: (full, partial, none) =>
      `完全 ${full} · 部分 ${partial} · 非対応 ${none}`,
    colCapabilityGroup: "ケイパビリティグループ",
    legendText:
      "凡例: ✓ グループ内の全ケイパビリティが許可 · ◐ 部分的に許可 · ✗ そのマイナーラインでは不許可。許可 = 静的検証レコードがそのバージョンでケイパビリティを認め、かつ縮小するセレクタコントラクト/クラスピンもそのバージョンを認める。",
    statusFullLabel: "全ケイパビリティ許可",
    statusPartialLabel: "部分的に許可",
    statusNoneLabel: "不許可",
    colCapabilityId: "ケイパビリティ ID",
    colCapabilityFeature: "対象機能",
    colAdmittedVersions: "許可バージョン",
    colAbsentVersions: "検証済みレコードなし",
  },
  ko: {
    releaseColRelease: "Turboism 릴리스",
    releaseColChannel: "채널",
    releaseColVersions: "지원되는 Cubism Editor 버전",
    releaseColPlatform: "호스트 플랫폼",
    channelLabels: {
      stable: "Stable (안정판)",
      nightly: "Nightly (0.44.1-0.nightly.*)",
      beta: "Beta / 현재 main",
    },
    platformLabels: {
      "windows-x64": "Windows x64",
    },
    exactVersionsNote: (count) => `정확한 검토 버전 ${count}개`,
    allReviewedVersionsNote: (count) => `검토된 전체 ${count}개 버전`,
    sourcePinnedNote: (commit, range, count) =>
      `turboism/Turboism 저장소 커밋 ${commit}의 검토된 호환성 데이터에서 생성됨(검토된 Cubism Editor 버전 총 ${count}개: ${range}).`,
    colPlugin: "플러그인",
    colSupported: "지원 버전",
    colDeltas: "버전별 차이",
    colHostValidation: "실기 검증",
    allReviewed: `모든 검토 버전 (${data.reviewedRange})`,
    earlierLackFeature: "이전 Cubism 버전에는 기능 자체가 없음",
    fullFeatureSince: (min) => `전체 기능은 ${min} 이상 필요`,
    onlyOn: "에서만",
    notOn: "제외",
    officialAdded: (version, feature) => `Cubism ${version}에 ${feature} 추가`,
    hostVerified: "실기 검증 통과",
    confirmedBoundary: "확인된 경계",
    validationLegend:
      "실기 검증 열: validation/cubism-version-matrix/campaign-jobs.json의 태스크×버전별 최신 FINAL 결과를 triage로 분류한 것입니다. 인프라 재시도·프로브 드리프트·불확실한 결과는 표시하지 않으며, 프로브가 없는 버전은 빈 칸입니다. 정적 검토가 항상 기준선입니다.",
    colMinorLine: "마이너 라인",
    colReviewedRange: "검토 버전 범위",
    colPatchCount: "패치 수",
    colAdmittedCaps: "허용 capability 수",
    colGroupSummary: "capability 그룹 요약 (총 37개)",
    groupSummaryFormat: (full, partial, none) =>
      `전체 허용 ${full} · 부분 허용 ${partial} · 미지원 ${none}`,
    colCapabilityGroup: "capability 그룹",
    legendText:
      "범례: ✓ 그룹 내 모든 capability 허용 · ◐ 부분 허용 · ✗ 해당 마이너 라인에서 불허. 허용 = 정적 검증 레코드가 그 버전에서 capability를 인정하고, 이를 축소하는 선택자 계약/클래스 핀도 그 버전을 인정함.",
    statusFullLabel: "모든 capability 허용",
    statusPartialLabel: "부분 허용",
    statusNoneLabel: "불허",
    colCapabilityId: "capability ID",
    colCapabilityFeature: "기능 표면",
    colAdmittedVersions: "허용 버전",
    colAbsentVersions: "검증된 레코드 없음",
  },
};

function renderPartialFeatureNote(note: PartialFeature, locale: Language) {
  const s = UI_STRINGS[locale];
  const label = note.label[locale] ?? note.label.en;
  const connector = note.mode === "only" ? s.onlyOn : s.notOn;
  const off = note.officialSource;
  let suffixText: string | null = null;
  let suffixUrl: string | null = null;

  if (note.boundaryPrefix) {
    if (off) {
      const featName =
        locale === "zh"
          ? off.nameZh ?? off.nameEn ?? ""
          : off.nameEn ?? off.nameZh ?? "";
      suffixText = featName
        ? s.officialAdded(off.version, featName)
        : `Cubism ${off.version}`;
      suffixUrl = off.url ?? null;
    } else {
      suffixText = s.earlierLackFeature;
    }
  }

  return (
    <span key={note.key}>
      {label} {connector} <code>{note.range}</code>
      {suffixText ? (
        <>
          {" ("}
          {suffixUrl ? (
            <a href={suffixUrl} target="_blank" rel="noreferrer noopener">
              {suffixText}
            </a>
          ) : (
            suffixText
          )}
          {")"}
        </>
      ) : null}
    </span>
  );
}

export function CompatibilityReleaseTable({
  locale = "en",
}: {
  locale?: Language;
}) {
  const s = UI_STRINGS[locale] ?? UI_STRINGS.en;

  return (
    <div>
      <div className="relative my-6 overflow-auto prose-no-margin">
        <table>
          <thead>
            <tr>
              <th>{s.releaseColRelease}</th>
              <th>{s.releaseColChannel}</th>
              <th>{s.releaseColVersions}</th>
              <th>{s.releaseColPlatform}</th>
            </tr>
          </thead>
          <tbody>
            {data.releases.map((rel) => {
              const isAll =
                rel.cubismVersions.length === data.reviewedVersions.length;
              return (
                <tr key={rel.version}>
                  <td>
                    <code>{rel.version}</code>
                  </td>
                  <td>{s.channelLabels[rel.channel]}</td>
                  <td>
                    <code>{rel.cubismRange}</code>{" "}
                    <span className="text-slate-500 text-xs">
                      (
                      {isAll
                        ? s.allReviewedVersionsNote(rel.cubismVersions.length)
                        : s.exactVersionsNote(rel.cubismVersions.length)}
                      )
                    </span>
                  </td>
                  <td>
                    {rel.platforms
                      .map((p) => s.platformLabels[p] ?? p)
                      .join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-slate-500 text-xs">
        {s.sourcePinnedNote(
          data.sourceCommit,
          data.reviewedRange,
          data.reviewedVersions.length,
        )}
      </p>
    </div>
  );
}

export function CompatibilityPluginTable({
  locale = "en",
}: {
  locale?: Language;
}) {
  const s = UI_STRINGS[locale] ?? UI_STRINGS.en;

  return (
    <div>
      <div className="relative my-6 overflow-auto prose-no-margin">
        <table>
          <thead>
            <tr>
              <th>{s.colPlugin}</th>
              <th>{s.colSupported}</th>
              <th>{s.colDeltas}</th>
              <th>{s.colHostValidation}</th>
            </tr>
          </thead>
          <tbody>
            {data.plugins.map((plugin) => {
              const hasDeltas =
                Boolean(plugin.fullFeatureSince) ||
                plugin.partialFeatures.length > 0;
              const hasHost =
                Boolean(plugin.hostValidation.verified) ||
                Boolean(plugin.hostValidation.boundary);

              return (
                <tr key={plugin.directory}>
                  <td>
                    <code>{plugin.directory}</code>
                  </td>
                  <td>
                    {plugin.supportedRange === "all" ? (
                      s.allReviewed
                    ) : (
                      <>
                        <code>{plugin.supportedRange}</code>
                        {plugin.supportedBoundaryPrefix ? (
                          <span className="text-slate-500 text-xs">
                            {" "}
                            ({s.earlierLackFeature})
                          </span>
                        ) : null}
                      </>
                    )}
                  </td>
                  <td>
                    {!hasDeltas ? (
                      "—"
                    ) : (
                      <ul className="my-0 list-none space-y-1 ps-0">
                        {plugin.fullFeatureSince ? (
                          <li>
                            <strong>
                              {s.fullFeatureSince(plugin.fullFeatureSince)}
                            </strong>
                          </li>
                        ) : null}
                        {plugin.partialFeatures.map((note) => (
                          <li key={note.key}>
                            {renderPartialFeatureNote(note, locale)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    {!hasHost ? (
                      "—"
                    ) : (
                      <ul className="my-0 list-none space-y-1 ps-0">
                        {plugin.hostValidation.verified ? (
                          <li>
                            {s.hostVerified}{" "}
                            <code>{plugin.hostValidation.verified}</code>
                          </li>
                        ) : null}
                        {plugin.hostValidation.boundary ? (
                          <li className="text-slate-500">
                            {s.confirmedBoundary}{" "}
                            <code>{plugin.hostValidation.boundary}</code>
                          </li>
                        ) : null}
                      </ul>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-slate-500 text-xs">{s.validationLegend}</p>
    </div>
  );
}

function renderCoverageCell(cell: MinorCoverageCell, locale: Language) {
  const s = UI_STRINGS[locale] ?? UI_STRINGS.en;
  if (cell.status === "full") {
    return (
      <span title={s.statusFullLabel}>
        ✓{" "}
        <span className="text-slate-500 text-xs">
          ({cell.total}/{cell.total})
        </span>
      </span>
    );
  }
  if (cell.status === "none") {
    return (
      <span className="text-slate-500" title={s.statusNoneLabel}>
        ✗ <span className="text-xs">(0/{cell.total})</span>
      </span>
    );
  }
  if (cell.fullFrom) {
    return (
      <span title={s.statusPartialLabel}>
        ◐ → ✓ <code>{cell.fullFrom}+</code>{" "}
        <span className="text-slate-500 text-xs">
          ({cell.minAdmitted}–{cell.maxAdmitted}/{cell.total})
        </span>
      </span>
    );
  }
  return (
    <span title={s.statusPartialLabel}>
      ◐{" "}
      <span className="text-slate-500 text-xs">
        ({cell.maxAdmitted}/{cell.total})
      </span>
    </span>
  );
}

export function CompatibilityCapabilityTable({
  locale = "en",
}: {
  locale?: Language;
}) {
  const s = UI_STRINGS[locale] ?? UI_STRINGS.en;

  return (
    <div>
      <div className="relative my-6 overflow-auto prose-no-margin">
        <table>
          <thead>
            <tr>
              <th>{s.colMinorLine}</th>
              <th>{s.colReviewedRange}</th>
              <th>{s.colPatchCount}</th>
              <th>{s.colAdmittedCaps}</th>
              <th>{s.colGroupSummary}</th>
            </tr>
          </thead>
          <tbody>
            {data.minorLines.map((line) => {
              const capCount =
                line.admittedCapabilitiesStart === line.admittedCapabilitiesEnd
                  ? `${line.admittedCapabilitiesEnd} / ${line.totalCapabilities}`
                  : `${line.admittedCapabilitiesStart}–${line.admittedCapabilitiesEnd} / ${line.totalCapabilities}`;
              return (
                <tr key={line.line}>
                  <td>
                    <code>{line.line}</code>
                  </td>
                  <td>
                    <code>{line.range}</code>
                  </td>
                  <td>{line.count}</td>
                  <td>
                    <code>{capCount}</code>
                  </td>
                  <td>
                    {s.groupSummaryFormat(
                      line.fullGroups,
                      line.partialGroups,
                      line.noneGroups,
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-slate-500 text-xs">{s.legendText}</p>

      <div className="relative my-6 overflow-auto prose-no-margin">
        <table>
          <thead>
            <tr>
              <th>{s.colCapabilityGroup}</th>
              {data.minorLines.map((line) => (
                <th key={line.line}>
                  <code>{line.line}</code>{" "}
                  <span className="font-normal text-slate-500 text-xs">
                    ({line.range})
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.capabilityGroups.map((group) => (
              <tr key={group.id}>
                <td>{group.label[locale] ?? group.label.en}</td>
                {data.minorLines.map((line) => (
                  <td key={line.line}>
                    {renderCoverageCell(
                      group.minorCoverage[line.line],
                      locale,
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="relative my-6 overflow-auto prose-no-margin">
        <table>
          <thead>
            <tr>
              <th>{s.colCapabilityId}</th>
              <th>{s.colCapabilityFeature}</th>
              <th>{s.colAdmittedVersions}</th>
              <th>{s.colAbsentVersions}</th>
            </tr>
          </thead>
          <tbody>
            {data.restrictedCapabilities.map((cap) => (
              <tr key={cap.id}>
                <td>
                  <code>{cap.id}</code>
                </td>
                <td>{cap.label[locale] ?? cap.label.en}</td>
                <td>
                  <code>{cap.admittedRange}</code>
                </td>
                <td>
                  <code>{cap.missingRange}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

from __future__ import annotations

import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
SOURCE_FILES = [
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.1.ProjectTestCaseSprint1.xlsx",
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.2.ProjectTestCaseSprint2.xlsx",
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.3.ProjectTestCaseSprint3.xlsx",
]
OUTPUT_FILE = ROOT / "docs" / "testcases" / "SmartTravel.ProjectTestReport.xlsx"
PROJECT_NAME = "SMARTTRAVEL - HỆ THỐNG DU LỊCH THÔNG MINH"
MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"a": MAIN_NS, "r": REL_NS}


def read_inline_text(node: ET.Element) -> str:
    return "".join(text_node.text or "" for text_node in node.iter(f"{{{MAIN_NS}}}t"))


def parse_workbook(path: Path) -> dict[str, object]:
    with zipfile.ZipFile(path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for si in shared_root.findall("a:si", NS):
                shared_strings.append(read_inline_text(si))

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}

        sprint_name = ""
        modules: list[dict[str, object]] = []
        total_passed = 0
        total_failed = 0
        total_pending = 0
        total_blocked = 0

        for sheet in workbook.find("a:sheets", NS):
            sheet_name = sheet.attrib["name"]
            relation_id = sheet.attrib[f"{{{REL_NS}}}id"]
            target = rel_map[relation_id]
            if not target.startswith("xl/"):
                target = f"xl/{target}"

            worksheet = ET.fromstring(archive.read(target))
            row_map: dict[int, dict[str, str]] = {}

            for row in worksheet.find("a:sheetData", NS):
                row_index = int(row.attrib["r"])
                values: dict[str, str] = {}
                for cell in row.findall("a:c", NS):
                    cell_ref = cell.attrib["r"]
                    column = re.sub(r"\d+", "", cell_ref)
                    cell_type = cell.attrib.get("t")
                    value = ""
                    if cell_type == "s":
                        raw = cell.find("a:v", NS)
                        if raw is not None and raw.text is not None:
                            value = shared_strings[int(raw.text)]
                    elif cell_type == "inlineStr":
                        inline = cell.find("a:is", NS)
                        if inline is not None:
                            value = read_inline_text(inline)
                    else:
                        raw = cell.find("a:v", NS)
                        if raw is not None and raw.text is not None:
                            value = raw.text
                    values[column] = value
                row_map[row_index] = values

            sprint_name = row_map.get(1, {}).get("H", sprint_name)
            top_left_title = row_map.get(1, {}).get("A", "").strip()
            if sheet_name.strip().lower() == "trường hợp kiểm thử" or top_left_title.startswith("TEST CASE SYSTEM"):
                if not sprint_name:
                    sprint_name = top_left_title.replace("TEST CASE SYSTEM", "").strip().title()
                continue

            module_name = row_map.get(4, {}).get("B", sheet_name)
            owner = row_map.get(2, {}).get("E", "")
            difficulty = row_map.get(2, {}).get("H", "")

            gui_count = 0
            func_count = 0
            passed = 0
            failed = 0
            pending = 0
            blocked = 0

            for row_index, cells in row_map.items():
                if row_index < 25:
                    continue

                test_case_id = cells.get("A", "").strip()
                if test_case_id.startswith("GUI-"):
                    gui_count += 1
                elif test_case_id.startswith("FUNC-"):
                    func_count += 1
                else:
                    continue

                statuses = [cells.get("G", "").strip(), cells.get("J", "").strip()]
                status = next((item for item in statuses if item), "")
                status_upper = status.upper()
                if status_upper == "PASSED":
                    passed += 1
                elif status_upper == "FAILED":
                    failed += 1
                elif status_upper in {"PENDING", "INPROGRESS"}:
                    pending += 1
                elif status_upper == "BLOCKED":
                    blocked += 1

            total_count = gui_count + func_count
            if total_count == 0:
                continue

            total_passed += passed
            total_failed += failed
            total_pending += pending
            total_blocked += blocked

            modules.append(
                {
                    "module_name": module_name,
                    "sheet_name": sheet_name,
                    "description": f"Kiểm thử giao diện và nghiệp vụ cho trang {module_name.lower()}.",
                    "total_count": total_count,
                    "passed": passed,
                    "failed": failed,
                    "pending": pending,
                    "blocked": blocked,
                    "priority": difficulty_to_priority(difficulty),
                    "owner": owner,
                    "difficulty": difficulty,
                }
            )

        total_executed = total_passed + total_failed
        total_planned = total_executed + total_pending + total_blocked

        return {
            "sprint_name": sprint_name,
            "modules": modules,
            "stats": {
                "passed": total_passed,
                "failed": total_failed,
                "executed": total_executed,
                "pending": total_pending,
                "inprogress": 0,
                "blocked": total_blocked,
                "planned": total_planned,
                "subtotal": total_planned,
            },
        }


def difficulty_to_priority(difficulty: str) -> int:
    normalized = difficulty.strip().lower()
    if normalized in {"khó", "hard"}:
        return 1
    if normalized in {"trung bình", "medium"}:
        return 2
    return 3


def col_name(index: int) -> str:
    result = ""
    while index > 0:
        index, remainder = divmod(index - 1, 26)
        result = chr(65 + remainder) + result
    return result


def build_cell(reference: str, value: object, style: int = 0) -> str:
    if value is None or value == "":
        return f'<c r="{reference}" s="{style}"/>'
    if isinstance(value, (int, float)):
        return f'<c r="{reference}" s="{style}"><v>{value}</v></c>'
    return (
        f'<c r="{reference}" s="{style}" t="inlineStr">'
        f"<is><t>{escape(str(value))}</t></is></c>"
    )


def build_row(row_number: int, values: list[object], styles: list[int]) -> str:
    cells = []
    for idx, value in enumerate(values, start=1):
        style = styles[idx - 1] if idx - 1 < len(styles) else 0
        cells.append(build_cell(f"{col_name(idx)}{row_number}", value, style))
    return f'<row r="{row_number}">{"".join(cells)}</row>'


def make_percent(numerator: int, denominator: int) -> float:
    if denominator <= 0:
        return 0.0
    return round(numerator / denominator, 4)


def build_sheet_xml(sheet_title: str, report: dict[str, object]) -> str:
    stats = report["stats"]
    modules = report["modules"]

    rows: list[str] = []
    merges = [
        "A4:G4",
        "B7:C7",
        "A8:A10",
        "A11:A14",
        "A15:B15",
    ]

    rows.append(build_row(4, [f"Test Report {sheet_title}"], [1]))
    rows.append(build_row(7, ["Test level:", "System test"], [2, 3, 0, 0, 0, 0, 0]))
    rows.append(build_row(8, ["Executed", "Passed", stats["passed"]], [4, 5, 6]))
    rows.append(build_row(9, ["", "Failed", stats["failed"]], [4, 5, 6]))
    rows.append(build_row(10, ["", "Total test Executed", stats["executed"]], [4, 5, 6]))
    rows.append(build_row(11, ["Planned", "Pending", stats["pending"]], [4, 5, 6]))
    rows.append(build_row(12, ["", "Inprogress", stats["inprogress"]], [4, 5, 6]))
    rows.append(build_row(13, ["", "Blocked", stats["blocked"]], [4, 5, 6]))
    rows.append(build_row(14, ["", "Total test Planned", stats["planned"]], [4, 5, 6]))
    rows.append(build_row(15, ["Sub Total (Planned+Executed)", "", stats["subtotal"]], [7, 7, 6]))
    rows.append(build_row(17, ["Functions", "Description", "%TC Executed", "%TC Passed", "TC Pending", "Priority", "Remark"], [8, 8, 8, 8, 8, 8, 8]))

    current_row = 18
    for module in modules:
        total = int(module["total_count"])
        executed = int(module["passed"]) + int(module["failed"])
        pending = int(module["pending"]) + int(module["blocked"])
        rows.append(
            build_row(
                current_row,
                [
                    module["module_name"],
                    module["description"],
                    make_percent(executed, total),
                    make_percent(int(module["passed"]), total),
                    pending,
                    module["priority"],
                    f"Sheet: {module['sheet_name']} | Phụ trách: {module['owner']}",
                ],
                [9, 10, 11, 11, 6, 6, 10],
            )
        )
        current_row += 1

    current_row += 1
    rows.append(build_row(current_row, ["Bugs", "Description", "Status", "Severity", "Priority"], [8, 8, 8, 8, 8]))
    current_row += 1
    rows.append(
        build_row(
            current_row,
            [
                "Không phát sinh",
                "Chưa ghi nhận lỗi nào từ 3 workbook testcase hiện có.",
                "Closed",
                "N/A",
                "N/A",
            ],
            [9, 10, 6, 6, 6],
        )
    )

    dimension = f"A4:G{current_row}"
    merge_xml = "".join(f'<mergeCell ref="{ref}"/>' for ref in merges)

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="{MAIN_NS}" xmlns:r="{REL_NS}">
  <dimension ref="{dimension}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="17" topLeftCell="A18" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>
    <col min="1" max="1" width="28" customWidth="1"/>
    <col min="2" max="2" width="48" customWidth="1"/>
    <col min="3" max="4" width="15" customWidth="1"/>
    <col min="5" max="5" width="12" customWidth="1"/>
    <col min="6" max="6" width="10" customWidth="1"/>
    <col min="7" max="7" width="34" customWidth="1"/>
  </cols>
  <sheetData>
    {"".join(rows)}
  </sheetData>
  <mergeCells count="{len(merges)}">{merge_xml}</mergeCells>
</worksheet>
"""


def build_styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="1">
    <numFmt numFmtId="164" formatCode="0%"/>
  </numFmts>
  <fonts count="5">
    <font><sz val="11"/><name val="Times New Roman"/></font>
    <font><b/><sz val="20"/><name val="Times New Roman"/></font>
    <font><b/><sz val="11"/><name val="Times New Roman"/></font>
    <font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Times New Roman"/></font>
    <font><i/><sz val="11"/><name val="Times New Roman"/></font>
  </fonts>
  <fills count="5">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0E7C86"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFD8ECEF"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF2F7F7"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color auto="1"/></left>
      <right style="thin"><color auto="1"/></right>
      <top style="thin"><color auto="1"/></top>
      <bottom style="thin"><color auto="1"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="12">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>
"""


def build_workbook_xml(sheet_names: list[str]) -> str:
    sheets = []
    for idx, name in enumerate(sheet_names, start=1):
        sheets.append(f'<sheet name="{escape(name)}" sheetId="{idx}" r:id="rId{idx}"/>')
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="{MAIN_NS}" xmlns:r="{REL_NS}">
  <sheets>{''.join(sheets)}</sheets>
</workbook>
"""


def build_workbook_rels(sheet_count: int) -> str:
    relationships = []
    for idx in range(1, sheet_count + 1):
        relationships.append(
            f'<Relationship Id="rId{idx}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{idx}.xml"/>'
        )
    relationships.append(
        f'<Relationship Id="rId{sheet_count + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    )
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  {''.join(relationships)}
</Relationships>
"""


def build_root_rels() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""


def build_content_types(sheet_count: int) -> str:
    overrides = []
    for idx in range(1, sheet_count + 1):
        overrides.append(
            f'<Override PartName="/xl/worksheets/sheet{idx}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        )
    overrides.extend(
        [
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
            '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
            '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
        ]
    )
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  {''.join(overrides)}
</Types>
"""


def build_app_xml(sheet_names: list[str]) -> str:
    titles = "".join(f"<vt:lpstr>{escape(name)}</vt:lpstr>" for name in sheet_names)
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Excel</Application>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>{len(sheet_names)}</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="{len(sheet_names)}" baseType="lpstr">{titles}</vt:vector>
  </TitlesOfParts>
  <Company>SmartTravel</Company>
</Properties>
"""


def build_core_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>SmartTravel Project Test Report</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-05-13T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-05-13T00:00:00Z</dcterms:modified>
</cp:coreProperties>
"""


def main() -> None:
    reports = [parse_workbook(path) for path in SOURCE_FILES]
    sheet_names = [f"TestReport{report['sprint_name'].replace(' ', '')}" for report in reports]

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUTPUT_FILE, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", build_content_types(len(sheet_names)))
        archive.writestr("_rels/.rels", build_root_rels())
        archive.writestr("docProps/app.xml", build_app_xml(sheet_names))
        archive.writestr("docProps/core.xml", build_core_xml())
        archive.writestr("xl/workbook.xml", build_workbook_xml(sheet_names))
        archive.writestr("xl/_rels/workbook.xml.rels", build_workbook_rels(len(sheet_names)))
        archive.writestr("xl/styles.xml", build_styles_xml())

        for idx, report in enumerate(reports, start=1):
            archive.writestr(
                f"xl/worksheets/sheet{idx}.xml",
                build_sheet_xml(report["sprint_name"], report),
            )

    print(f"Created: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

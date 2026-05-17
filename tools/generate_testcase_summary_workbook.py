from __future__ import annotations

import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
SOURCE_FILES = [
    ROOT / "docs" / "testcases" / "Sprint_1_Test_Cases_Vietnamese.xlsx",
    ROOT / "docs" / "testcases" / "Sprint_2_Test_Cases_Vietnamese.xlsx",
    ROOT / "docs" / "testcases" / "Sprint_3_Test_Cases_Vietnamese.xlsx",
]
OUTPUT_FILE = ROOT / "docs" / "testcases" / "Tong_hop_test_case_3_sprint.xlsx"
PROJECT_NAME = "SMARTTRAVEL - HỆ THỐNG DU LỊCH THÔNG MINH"

NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"


def read_inline_text(node: ET.Element) -> str:
    return "".join(text_node.text or "" for text_node in node.iter(f"{{{MAIN_NS}}}t"))


def parse_workbook(path: Path) -> tuple[str, list[dict[str, object]]]:
    with zipfile.ZipFile(path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for si in root.findall("a:si", NS):
                shared_strings.append(read_inline_text(si))

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}

        modules: list[dict[str, object]] = []
        sprint_name = ""

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
            module_name = row_map.get(4, {}).get("B", sheet_name)
            owner = row_map.get(2, {}).get("E", "")
            difficulty = row_map.get(2, {}).get("H", "")

            gui_count = 0
            func_count = 0
            for row_index, cells in row_map.items():
                if row_index < 25:
                    continue
                cell_value = cells.get("A", "").strip()
                if cell_value.startswith("GUI-"):
                    gui_count += 1
                elif cell_value.startswith("FUNC-"):
                    func_count += 1

            modules.append(
                {
                    "module_name": module_name,
                    "sheet_name": sheet_name,
                    "gui_count": gui_count,
                    "func_count": func_count,
                    "total_count": gui_count + func_count,
                    "owner": owner,
                    "difficulty": difficulty,
                }
            )

    return sprint_name, modules


def column_name(index: int) -> str:
    result = ""
    while index > 0:
        index, remainder = divmod(index - 1, 26)
        result = chr(65 + remainder) + result
    return result


def build_cell(reference: str, value: object, style: int = 0) -> str:
    if value is None:
        return f'<c r="{reference}" s="{style}"/>'

    if isinstance(value, (int, float)):
        return f'<c r="{reference}" s="{style}"><v>{value}</v></c>'

    text = str(value)
    if text == "":
        return f'<c r="{reference}" s="{style}"/>'
    return (
        f'<c r="{reference}" s="{style}" t="inlineStr">'
        f"<is><t>{escape(text)}</t></is></c>"
    )


def build_row_xml(row_number: int, values: list[object], styles: list[int]) -> str:
    cells = []
    for index, value in enumerate(values, start=1):
        style = styles[index - 1] if index - 1 < len(styles) else 0
        cells.append(build_cell(f"{column_name(index)}{row_number}", value, style))
    return f'<row r="{row_number}">{"".join(cells)}</row>'


def build_sheet_xml(sprint_title: str, modules: list[dict[str, object]]) -> str:
    rows: list[str] = []
    merges = [
        "A1:H1",
        "B2:H2",
    ]

    rows.append(build_row_xml(1, [f"TEST CASE SYSTEM {sprint_title.upper()}"], [1]))
    rows.append(
        build_row_xml(
            2,
            ["Tên dự án", PROJECT_NAME],
            [2, 3],
        )
    )
    rows.append(
        build_row_xml(
            4,
            ["STT", "Chức năng", "Sheet Name", "GUI", "FUNC", "Tổng TC", "Phụ trách", "Độ khó"],
            [4, 4, 4, 4, 4, 4, 4, 4],
        )
    )

    start_row = 5
    total_gui = total_func = total_all = 0
    for idx, module in enumerate(modules, start=1):
        gui = int(module["gui_count"])
        func = int(module["func_count"])
        total = int(module["total_count"])
        total_gui += gui
        total_func += func
        total_all += total

        rows.append(
            build_row_xml(
                start_row,
                [
                    idx,
                    module["module_name"],
                    module["sheet_name"],
                    gui,
                    func,
                    total,
                    module["owner"],
                    module["difficulty"],
                ],
                [5, 6, 6, 7, 7, 7, 6, 6],
            )
        )
        start_row += 1

    rows.append(
        build_row_xml(
            start_row,
            ["Tổng cộng", "", "", total_gui, total_func, total_all, "", ""],
            [8, 8, 8, 8, 8, 8, 8, 8],
        )
    )
    merges.append(f"A{start_row}:C{start_row}")

    merge_xml = "".join(f'<mergeCell ref="{merge}"/>' for merge in merges)
    dimension = f"A1:H{start_row}"

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="{MAIN_NS}" xmlns:r="{REL_NS}">
  <dimension ref="{dimension}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>
    <col min="1" max="1" width="8" customWidth="1"/>
    <col min="2" max="2" width="34" customWidth="1"/>
    <col min="3" max="3" width="26" customWidth="1"/>
    <col min="4" max="6" width="11" customWidth="1"/>
    <col min="7" max="7" width="16" customWidth="1"/>
    <col min="8" max="8" width="14" customWidth="1"/>
  </cols>
  <sheetData>
    {"".join(rows)}
  </sheetData>
  <mergeCells count="{len(merges)}">
    {merge_xml}
  </mergeCells>
</worksheet>
"""


def build_styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="4">
    <font><sz val="11"/><name val="Times New Roman"/></font>
    <font><b/><sz val="20"/><name val="Times New Roman"/></font>
    <font><b/><color rgb="FFFFFFFF"/><sz val="12"/><name val="Times New Roman"/></font>
    <font><b/><sz val="12"/><name val="Times New Roman"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0B7F80"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFDFF4F3"/><bgColor indexed="64"/></patternFill></fill>
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
  <cellXfs count="9">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
      <alignment horizontal="left" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>
"""


def build_workbook_xml(sheet_names: list[str]) -> str:
    sheet_xml = []
    for idx, name in enumerate(sheet_names, start=1):
        sheet_xml.append(
            f'<sheet name="{escape(name)}" sheetId="{idx}" r:id="rId{idx}"/>'
        )
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="{MAIN_NS}" xmlns:r="{REL_NS}">
  <sheets>
    {"".join(sheet_xml)}
  </sheets>
</workbook>
"""


def build_workbook_rels(sheet_count: int) -> str:
    parts = []
    for idx in range(1, sheet_count + 1):
        parts.append(
            f'<Relationship Id="rId{idx}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{idx}.xml"/>'
        )
    parts.append(
        f'<Relationship Id="rId{sheet_count + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    )
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  {"".join(parts)}
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
  {"".join(overrides)}
</Types>
"""


def build_app_xml(sheet_names: list[str]) -> str:
    titles = "".join(f"<vt:lpstr>{escape(name)}</vt:lpstr>" for name in sheet_names)
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Excel</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>{len(sheet_names)}</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="{len(sheet_names)}" baseType="lpstr">
      {titles}
    </vt:vector>
  </TitlesOfParts>
  <Company>SmartTravel</Company>
</Properties>
"""


def build_core_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Tổng hợp test case 3 sprint</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-05-13T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-05-13T00:00:00Z</dcterms:modified>
</cp:coreProperties>
"""


def main() -> None:
    sprint_sheets: list[tuple[str, list[dict[str, object]]]] = []
    for source in SOURCE_FILES:
        sprint_name, modules = parse_workbook(source)
        sprint_sheets.append((sprint_name, modules))

    sheet_names = [sprint_name for sprint_name, _ in sprint_sheets]
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(OUTPUT_FILE, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", build_content_types(len(sheet_names)))
        archive.writestr("_rels/.rels", build_root_rels())
        archive.writestr("docProps/app.xml", build_app_xml(sheet_names))
        archive.writestr("docProps/core.xml", build_core_xml())
        archive.writestr("xl/workbook.xml", build_workbook_xml(sheet_names))
        archive.writestr("xl/_rels/workbook.xml.rels", build_workbook_rels(len(sheet_names)))
        archive.writestr("xl/styles.xml", build_styles_xml())

        for idx, (sprint_name, modules) in enumerate(sprint_sheets, start=1):
            archive.writestr(
                f"xl/worksheets/sheet{idx}.xml",
                build_sheet_xml(sprint_name, modules),
            )

    print(f"Created: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

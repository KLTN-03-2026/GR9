from __future__ import annotations

import math
import re
import zipfile
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
SOURCE_FILES = [
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.1.ProjectTestCaseSprint1.xlsx",
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.2.ProjectTestCaseSprint2.xlsx",
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.3.ProjectTestCaseSprint3.xlsx",
]
OUTPUT_FILE = ROOT / "docs" / "testcases" / "SmartTravel.ProjectSprintBacklog_HorizontalChart_v5.xlsx"
PROJECT_NAME = "XÂY DỰNG HỆ THỐNG LẬP KẾ HOẠCH DU LỊCH THÔNG MINH TÍCH HỢP ĐẶT DỊCH VỤ DỰA TRÊN CÔNG NGHỆ AI"
TEAM_MEMBERS = ["Tính", "Thành", "Bảo", "Trí", "Ngọc"]
LEGEND_ITEMS = [
    ("Kết thúc đúng hạn", 17),
    ("Muộn", 18),
    ("Trước thời hạn", 19),
]

SPRINT_WINDOWS = {
    "Sprint 1": (date(2026, 3, 12), date(2026, 3, 31)),
    "Sprint 2": (date(2026, 4, 1), date(2026, 4, 24)),
    "Sprint 3": (date(2026, 4, 25), date(2026, 5, 15)),
}

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"a": MAIN_NS, "r": REL_NS}


def read_inline_text(node: ET.Element) -> str:
    return "".join(text_node.text or "" for text_node in node.iter(f"{{{MAIN_NS}}}t"))


def excel_serial(day: date) -> int:
    base = date(1899, 12, 30)
    return (day - base).days


def normalize_sprint(raw: str) -> str:
    raw = (raw or "").strip()
    if raw.startswith("Sprint"):
        return raw
    if "SPRINT" in raw.upper():
        digits = re.findall(r"\d+", raw)
        if digits:
            return f"Sprint {digits[0]}"
    return raw or "Sprint"


def difficulty_to_hours(difficulty: str) -> tuple[int, int]:
    normalized = (difficulty or "").strip().lower()
    if normalized == "khó":
        return 12, 14
    if normalized == "trung bình":
        return 8, 9
    return 6, 6


def phase_hours(difficulty: str) -> list[tuple[str, int, int]]:
    normalized = (difficulty or "").strip().lower()
    if normalized == "khó":
        return [
            ("User interface design", 3, 3),
            ("Coding", 6, 7),
            ("Testing", 2, 2),
            ("Fix Bug", 2, 2),
            ("Retesting", 1, 1),
        ]
    if normalized == "trung bình":
        return [
            ("User interface design", 2, 2),
            ("Coding", 4, 4),
            ("Testing", 1, 1),
            ("Fix Bug", 1, 1),
            ("Retesting", 1, 1),
        ]
    return [
        ("User interface design", 1, 1),
        ("Coding", 3, 3),
        ("Testing", 1, 1),
        ("Fix Bug", 1, 1),
        ("Retesting", 1, 1),
    ]


def pick_component(module_name: str) -> str:
    name = module_name.lower()
    tokens = re.findall(r"\w+", name, flags=re.UNICODE)
    if "đăng" in name or "mật khẩu" in name or "otp" in name:
        return "Authentication"
    if "provider" in name and "booking" not in name and "dashboard" not in name:
        return "Provider Onboarding"
    if "dashboard" in name:
        return "Dashboard"
    if "tour" in name and "tracking" not in name and "booking" not in name and "ai" not in name:
        return "Tour Management"
    if "service" in name:
        return "Service Management"
    if "guide" in name and "tracking" not in name:
        return "Guide Management"
    if "booking" in name:
        return "Booking Flow"
    if "tracking" in name:
        return "Tracking"
    if "ai" in tokens or "planner" in name or "chat ai" in name:
        return "AI Features"
    if "header" in name or "thông báo" in name or "tìm kiếm" in name:
        return "Shared Layout"
    if "phân tích" in name:
        return "Analytics"
    if "đánh giá" in name:
        return "Review"
    return "Core Feature"


def parse_testcase_workbook(path: Path) -> dict[str, object]:
    with zipfile.ZipFile(path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for si in root.findall("a:si", NS):
                shared_strings.append(read_inline_text(si))

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}

        sprint_name = ""
        modules = []
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
                    column = re.sub(r"\d+", "", cell.attrib["r"])
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
            top_left = row_map.get(1, {}).get("A", "").strip()
            if sheet_name.strip().lower() == "trường hợp kiểm thử" or top_left.startswith("TEST CASE SYSTEM"):
                continue

            module_name = row_map.get(4, {}).get("B", sheet_name)
            owner = row_map.get(2, {}).get("E", "")
            difficulty = row_map.get(2, {}).get("H", "")
            total_cases = 0
            for row_index, cells in row_map.items():
                if row_index < 25:
                    continue
                test_case_id = cells.get("A", "").strip()
                if test_case_id.startswith("GUI-") or test_case_id.startswith("FUNC-"):
                    total_cases += 1
            if total_cases == 0:
                continue
            est, actual = difficulty_to_hours(difficulty)
            modules.append(
                {
                    "module_name": module_name,
                    "sheet_name": sheet_name,
                    "owner": owner,
                    "difficulty": difficulty,
                    "component": pick_component(module_name),
                    "estimate": est,
                    "actual": actual,
                    "cases": total_cases,
                }
            )

    return {
        "sprint_name": normalize_sprint(sprint_name),
        "modules": modules,
    }


def distribute_hours(total_hours: int, days: int) -> list[int]:
    result = [0] * days
    if days <= 0:
        return result
    base = total_hours // days
    remainder = total_hours % days
    for idx in range(days):
        result[idx] = base + (1 if idx < remainder else 0)
    return result


def assign_timeline(tasks: list[dict[str, object]], sprint_days: list[date]) -> None:
    owner_cursor = defaultdict(lambda: 0)
    for task in tasks:
        owners = [name.strip() for name in str(task["responsible"]).split(",") if name.strip()]
        primary_owner = owners[0] if owners and owners[0] != "All team" else "All team"
        actual_duration = max(1, math.ceil(int(task["actual"]) / 4))
        estimate_duration = max(1, math.ceil(int(task["estimate"]) / 4))
        duration = max(actual_duration, estimate_duration)
        if primary_owner == "All team":
            start = 0
        else:
            start = owner_cursor[primary_owner]
        if start + duration > len(sprint_days):
            start = max(0, len(sprint_days) - duration)
        timeline = [0] * len(sprint_days)
        actual_daily = [0] * len(sprint_days)
        estimate_daily = [0] * len(sprint_days)
        actual_hours = distribute_hours(int(task["actual"]), actual_duration)
        estimate_hours = distribute_hours(int(task["estimate"]), estimate_duration)
        for offset in range(duration):
            if start + offset < len(timeline):
                timeline[start + offset] = 1
        for offset, value in enumerate(actual_hours):
            if start + offset < len(actual_daily):
                actual_daily[start + offset] = value
        for offset, value in enumerate(estimate_hours):
            if start + offset < len(estimate_daily):
                estimate_daily[start + offset] = value
        task["timeline"] = timeline
        task["actual_daily"] = actual_daily
        task["estimate_daily"] = estimate_daily
        task["status"] = (
            "late" if int(task["actual"]) > int(task["estimate"])
            else "early" if int(task["actual"]) < int(task["estimate"])
            else "ontime"
        )
        if primary_owner != "All team":
            owner_cursor[primary_owner] = min(len(sprint_days) - 1, start + duration)


def build_sprint_tasks(report: dict[str, object]) -> list[dict[str, object]]:
    sprint_name = report["sprint_name"]
    modules = report["modules"]
    tasks = [
        {
            "sprint": sprint_name,
            "component": "Planning",
            "task_name": "Họp kế hoạch sprint",
            "responsible": "All team",
            "actual": 10,
            "estimate": 10,
        },
        {
            "sprint": "",
            "component": "Planning",
            "task_name": f"Tạo Sprint Backlog {sprint_name.split()[-1]}",
            "responsible": "Ngọc,Bảo",
            "actual": 4,
            "estimate": 4,
        },
        {
            "sprint": "",
            "component": "Documentation",
            "task_name": "Tạo tài liệu kiểm thử cho sprint",
            "responsible": "Trí,Ngọc",
            "actual": 4,
            "estimate": 4,
        },
    ]

    for module in modules:
        tasks.append(
            {
                "sprint": "",
                "component": "Analysis",
                "task_name": module["module_name"],
                "responsible": module["owner"],
                "actual": 1,
                "estimate": 1,
                "sheet_name": module["sheet_name"],
                "cases": module["cases"],
                "base_component": module["component"],
            }
        )
        for phase_name, estimate, actual in phase_hours(module["difficulty"]):
            tasks.append(
                {
                    "sprint": "",
                    "component": phase_name,
                    "task_name": module["module_name"],
                    "responsible": module["owner"],
                    "actual": actual,
                    "estimate": estimate,
                    "sheet_name": module["sheet_name"],
                    "cases": module["cases"],
                    "base_component": module["component"],
                }
            )
    component_order = {
        "Planning": 0,
        "Documentation": 1,
        "Analysis": 2,
        "User interface design": 3,
        "Design database": 4,
        "Coding": 5,
        "Testing": 6,
        "Fix Bug": 7,
        "Retesting": 8,
        "Refactoring": 9,
        "Release Build": 10,
    }
    return sorted(tasks, key=lambda task: (component_order.get(task["component"], 99), task["task_name"]))


def compute_member_totals(tasks: list[dict[str, object]]) -> dict[str, dict[str, float]]:
    totals = {member: {"actual": 0.0, "estimate": 0.0} for member in TEAM_MEMBERS}
    for task in tasks:
        owners = [name.strip() for name in str(task["responsible"]).split(",") if name.strip()]
        if not owners:
            continue
        if owners == ["All team"]:
            owners = TEAM_MEMBERS[:]
        split_actual = float(task["actual"]) / len(owners)
        split_estimate = float(task["estimate"]) / len(owners)
        for owner in owners:
            if owner in totals:
                totals[owner]["actual"] += split_actual
                totals[owner]["estimate"] += split_estimate
    return totals


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


def build_row(row_number: int, values: list[object], styles: list[int], extra_attrs: str = "") -> str:
    cells = []
    for idx, value in enumerate(values, start=1):
        style = styles[idx - 1] if idx - 1 < len(styles) else 0
        cells.append(build_cell(f"{col_name(idx)}{row_number}", value, style))
    return f'<row r="{row_number}"{extra_attrs}>{"".join(cells)}</row>'


def build_sprint_sheet_xml(report: dict[str, object], totals: dict[str, dict[str, float]], chart_index: int) -> tuple[str, str, str, str, int]:
    sprint_name = report["sprint_name"]
    start_day, end_day = SPRINT_WINDOWS[sprint_name]
    sprint_days = [start_day + timedelta(days=idx) for idx in range((end_day - start_day).days + 1)]
    tasks = build_sprint_tasks(report)
    assign_timeline(tasks, sprint_days)

    rows = []
    merges = ["C1:D1", "C2:D2", "C3:D3", "C4:D4", "B6:E6"]
    header_styles = [1, 0, 2, 2, 0, 3]

    rows.append(build_row(1, ["Project name:", "", PROJECT_NAME, "", "", "Kết thúc đúng hạn", "", "", LEGEND_ITEMS[0][0]], [1, 0, 2, 2, 0, 3, 0, 0, LEGEND_ITEMS[0][1]]))
    rows.append(build_row(2, ["Module name:", "", sprint_name, "", "", "Đúng tiến độ", "", "", LEGEND_ITEMS[1][0]], [1, 0, 2, 2, 0, 3, 0, 0, LEGEND_ITEMS[1][1]]))
    rows.append(build_row(3, ["Start date:", "", excel_serial(start_day), "", "", "Trong kế hoạch", "", "", LEGEND_ITEMS[2][0]], [1, 0, 4, 4, 0, 3, 0, 0, LEGEND_ITEMS[2][1]]))
    rows.append(build_row(4, ["End date:", "", excel_serial(end_day), "", "", f"{len(sprint_days)} ngày"], [1, 0, 4, 4, 0, 3]))
    rows.append(build_row(5, ["", "", "", "", "", ""], [0, 0, 0, 0, 0, 0]))
    rows.append(build_row(6, ["", "SPRINT REPORT", "", "", ""], [0, 5, 5, 5, 5]))
    rows.append(build_row(7, ["", "No", "Thành viên", "Thực tế", "Ước tính"], [0, 6, 6, 6, 6]))

    team_order = TEAM_MEMBERS
    summary_row = 8
    for idx, member in enumerate(team_order, start=1):
        rows.append(
            build_row(
                summary_row,
                ["", idx, member, round(totals[member]["actual"], 1), round(totals[member]["estimate"], 1)],
                [0, 7, 8, 7, 7],
            )
        )
        summary_row += 1
    rows.append(
        build_row(
            summary_row,
            ["", "Tổng", "", round(sum(t["actual"] for t in totals.values()), 1), round(sum(t["estimate"] for t in totals.values()), 1)],
            [0, 9, 9, 9, 9],
        )
    )

    task_header_row = summary_row + 2
    date_headers = [excel_serial(day) for day in sprint_days]
    header_values = ["Sprint", "Component", "Task name", "", "Responsible Member", "", "Thực tế", "Ước tính"] + date_headers
    header_styles = [6, 6, 6, 6, 6, 6, 6, 6] + [10] * len(date_headers)
    rows.append(build_row(task_header_row, header_values, header_styles))
    merges.extend([
        f"C{task_header_row}:D{task_header_row}",
        f"E{task_header_row}:F{task_header_row}",
    ])

    current_row = task_header_row + 1
    component_ranges: list[tuple[int, int]] = []
    current_component = None
    component_start = current_row
    for task in tasks:
        timeline_values = [value if value else 0 for value in task["actual_daily"]]
        values = [
            task["sprint"],
            task["component"],
            task["task_name"],
            "",
            task["responsible"],
            "",
            task["actual"],
            task["estimate"],
        ] + timeline_values
        status_style = 17 if task["status"] == "ontime" else 18 if task["status"] == "late" else 19
        timeline_styles = [status_style if value else 23 for value in timeline_values]
        styles = [8, 8, 8, 8, 8, 8, 7, 7] + timeline_styles
        rows.append(build_row(current_row, values, styles))
        merges.extend([f"C{current_row}:D{current_row}", f"E{current_row}:F{current_row}"])
        if current_component is None:
            current_component = task["component"]
            component_start = current_row
        elif task["component"] != current_component:
            component_ranges.append((component_start, current_row - 1))
            current_component = task["component"]
            component_start = current_row
        current_row += 1
    if current_component is not None:
        component_ranges.append((component_start, current_row - 1))

    for start, end in component_ranges:
        if end > start:
            merges.append(f"B{start}:B{end}")

    total_row = current_row
    daily_totals = []
    for day_index in range(len(sprint_days)):
        daily_totals.append(sum(int(task["actual_daily"][day_index]) for task in tasks))
    total_values = ["", "Tổng", "", "", "", "", round(sum(task["actual"] for task in tasks), 1), round(sum(task["estimate"] for task in tasks), 1)] + daily_totals
    total_styles = [0, 16, 16, 16, 16, 16, 16, 16] + [16] * len(daily_totals)
    rows.append(build_row(total_row, total_values, total_styles))
    merges.extend([f"B{total_row}:D{total_row}", f"E{total_row}:F{total_row}"])
    current_row += 1

    chart_data_start_row = current_row
    actual_remaining = [sum(int(task["actual"]) for task in tasks)]
    estimate_remaining = [sum(int(task["estimate"]) for task in tasks)]
    for day_index in range(len(sprint_days)):
        actual_remaining.append(max(0, actual_remaining[-1] - sum(task["actual_daily"][day_index] for task in tasks)))
        estimate_remaining.append(max(0, estimate_remaining[-1] - sum(task["estimate_daily"][day_index] for task in tasks)))
    actual_remaining = actual_remaining[1:]
    estimate_remaining = estimate_remaining[1:]

    data_col_start = 9  # I
    rows.append(
        build_row(
            chart_data_start_row,
            ["", "Thực tế", "", "", "", "", "", ""] + actual_remaining,
            [0, 14, 14, 14, 14, 14, 14, 14] + [7] * len(sprint_days),
        )
    )
    rows.append(
        build_row(
            chart_data_start_row + 1,
            ["", "Ước tính", "", "", "", "", "", ""] + estimate_remaining,
            [0, 14, 14, 14, 14, 14, 14, 14] + [7] * len(sprint_days),
        )
    )
    merges.extend([f"B{chart_data_start_row}:H{chart_data_start_row}", f"B{chart_data_start_row + 1}:H{chart_data_start_row + 1}"])
    date_start_col = col_name(data_col_start)
    date_end_col = col_name(data_col_start + len(sprint_days) - 1)
    chart_data_end_row = chart_data_start_row + 1

    chart_top_row = chart_data_end_row + 1
    chart_bottom_row = chart_top_row + 18

    dimension = f"A1:{col_name(max(8 + len(sprint_days), data_col_start + len(sprint_days)))}{chart_bottom_row}"
    merge_xml = "".join(f'<mergeCell ref="{ref}"/>' for ref in merges)

    cols_xml = [
        '<col min="1" max="1" width="12" customWidth="1"/>',
        '<col min="2" max="2" width="18" customWidth="1"/>',
        '<col min="3" max="4" width="24" customWidth="1"/>',
        '<col min="5" max="6" width="18" customWidth="1"/>',
        '<col min="7" max="8" width="8" customWidth="1"/>',
        f'<col min="9" max="{8 + len(sprint_days)}" width="4.8" customWidth="1"/>',
    ]

    sheet_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="{MAIN_NS}" xmlns:r="{REL_NS}">
  <dimension ref="A1:{col_name(max(8 + len(sprint_days), data_col_start + len(sprint_days) - 1))}{chart_bottom_row}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="{task_header_row}" xSplit="8" topLeftCell="I{task_header_row + 1}" activePane="bottomRight" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>{''.join(cols_xml)}</cols>
  <sheetData>{''.join(rows)}</sheetData>
  <mergeCells count="{len(merges)}">{merge_xml}</mergeCells>
  <drawing r:id="rId1"/>
</worksheet>
"""
    drawing_xml = build_chart_drawing_xml(chart_index, chart_top_row - 1, chart_bottom_row - 1)
    drawing_rels_xml = build_drawing_rels_xml(chart_index)
    sheet_rels_xml = build_sheet_rels_xml(chart_index)
    chart_xml = build_chart_xml(
        sprint_name,
        chart_index,
        date_start_col,
        date_end_col,
        task_header_row,
        chart_data_start_row,
        chart_data_start_row + 1,
    )
    return sheet_xml, sheet_rels_xml, drawing_xml, drawing_rels_xml, chart_xml


def build_total_sheet_xml(all_totals: dict[str, dict[str, dict[str, float]]]) -> str:
    rows = []
    merges = ["A1:K1", "A2:A3"]
    rows.append(build_row(1, ["SPRINT BACKLOG REPORT"], [11]))

    header_row2 = [""]
    header_row3 = [""]
    for member in TEAM_MEMBERS:
        header_row2.extend([member, ""])
        header_row3.extend(["Thực tế", "Ước tính"])
    rows.append(build_row(2, header_row2, [12] * len(header_row2)))
    rows.append(build_row(3, header_row3, [13] * len(header_row3)))
    for idx, member in enumerate(TEAM_MEMBERS):
        col_start = 2 + idx * 2
        merges.append(f"{col_name(col_start)}2:{col_name(col_start + 1)}2")

    sprint_names = ["Sprint 1", "Sprint 2", "Sprint 3"]
    current_row = 4
    grand_actual = grand_estimate = 0.0
    for sprint_name in sprint_names:
        values = [sprint_name]
        for member in TEAM_MEMBERS:
            actual = round(all_totals[sprint_name][member]["actual"], 1)
            estimate = round(all_totals[sprint_name][member]["estimate"], 1)
            grand_actual += actual
            grand_estimate += estimate
            values.extend([actual, estimate])
        rows.append(build_row(current_row, values, [14] + [7] * (len(values) - 1)))
        current_row += 1

    total_values = ["Tổng"]
    for member in TEAM_MEMBERS:
        actual_sum = round(sum(all_totals[s][member]["actual"] for s in sprint_names), 1)
        estimate_sum = round(sum(all_totals[s][member]["estimate"] for s in sprint_names), 1)
        total_values.extend([actual_sum, estimate_sum])
    rows.append(build_row(current_row, total_values, [15] + [15] * (len(total_values) - 1)))
    current_row += 3
    rows.append(build_row(current_row, ["", "", "", "", "FINAL TOTAL", ""], [0, 0, 0, 0, 16, 16]))
    merges.append(f"E{current_row}:F{current_row}")
    current_row += 1
    rows.append(build_row(current_row, ["", "", "", "", "Thực tế", round(sum(sum(all_totals[s][m]['actual'] for m in TEAM_MEMBERS) for s in sprint_names), 1)], [0, 0, 0, 0, 14, 15]))
    current_row += 1
    rows.append(build_row(current_row, ["", "", "", "", "Ước tính", round(sum(sum(all_totals[s][m]['estimate'] for m in TEAM_MEMBERS) for s in sprint_names), 1)], [0, 0, 0, 0, 14, 15]))

    merge_xml = "".join(f'<mergeCell ref="{ref}"/>' for ref in merges)
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="{MAIN_NS}" xmlns:r="{REL_NS}">
  <dimension ref="A1:K{current_row}"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>
    <col min="1" max="1" width="12" customWidth="1"/>
    <col min="2" max="11" width="11" customWidth="1"/>
  </cols>
  <sheetData>{''.join(rows)}</sheetData>
  <mergeCells count="{len(merges)}">{merge_xml}</mergeCells>
</worksheet>
"""


def build_sheet_rels_xml(chart_index: int) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing{chart_index}.xml"/>
</Relationships>
"""


def build_drawing_rels_xml(chart_index: int) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart{chart_index}.xml"/>
</Relationships>
"""


def build_chart_drawing_xml(chart_index: int, top_row: int, bottom_row: int) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <xdr:twoCellAnchor>
    <xdr:from>
      <xdr:col>1</xdr:col>
      <xdr:colOff>0</xdr:colOff>
      <xdr:row>{top_row}</xdr:row>
      <xdr:rowOff>0</xdr:rowOff>
    </xdr:from>
    <xdr:to>
      <xdr:col>13</xdr:col>
      <xdr:colOff>0</xdr:colOff>
      <xdr:row>{bottom_row}</xdr:row>
      <xdr:rowOff>0</xdr:rowOff>
    </xdr:to>
    <xdr:graphicFrame macro="">
      <xdr:nvGraphicFramePr>
        <xdr:cNvPr id="{chart_index + 1}" name="Chart {chart_index}"/>
        <xdr:cNvGraphicFramePr/>
      </xdr:nvGraphicFramePr>
      <xdr:xfrm>
        <a:off x="0" y="0"/>
        <a:ext cx="0" cy="0"/>
      </xdr:xfrm>
      <a:graphic>
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
          <c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId1"/>
        </a:graphicData>
      </a:graphic>
    </xdr:graphicFrame>
    <xdr:clientData/>
  </xdr:twoCellAnchor>
</xdr:wsDr>
"""


def build_chart_xml(sheet_name: str, chart_index: int, date_start_col: str, date_end_col: str, date_row: int, actual_row: int, estimate_row: int) -> str:
    sheet_ref = f"'{sheet_name}'"
    cat_ref = f"{sheet_ref}!${date_start_col}${date_row}:${date_end_col}${date_row}"
    actual_ref = f"{sheet_ref}!${date_start_col}${actual_row}:${date_end_col}${actual_row}"
    estimate_ref = f"{sheet_ref}!${date_start_col}${estimate_row}:${date_end_col}${estimate_row}"
    axis_cat = 100000 + chart_index * 10
    axis_val = 100001 + chart_index * 10
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <c:lang val="vi-VN"/>
  <c:chart>
    <c:autoTitleDeleted val="1"/>
    <c:plotArea>
      <c:layout/>
      <c:lineChart>
        <c:grouping val="standard"/>
        <c:varyColors val="0"/>
        <c:ser>
          <c:idx val="0"/>
          <c:order val="0"/>
          <c:tx><c:v>Thực tế</c:v></c:tx>
          <c:spPr><a:ln w="28575"><a:solidFill><a:srgbClr val="5B9BD5"/></a:solidFill></a:ln></c:spPr>
          <c:marker><c:symbol val="none"/></c:marker>
          <c:cat><c:strRef><c:f>{cat_ref}</c:f></c:strRef></c:cat>
          <c:val><c:numRef><c:f>{actual_ref}</c:f></c:numRef></c:val>
        </c:ser>
        <c:ser>
          <c:idx val="1"/>
          <c:order val="1"/>
          <c:tx><c:v>Ước tính</c:v></c:tx>
          <c:spPr><a:ln w="28575"><a:solidFill><a:srgbClr val="ED7D31"/></a:solidFill></a:ln></c:spPr>
          <c:marker><c:symbol val="none"/></c:marker>
          <c:cat><c:strRef><c:f>{cat_ref}</c:f></c:strRef></c:cat>
          <c:val><c:numRef><c:f>{estimate_ref}</c:f></c:numRef></c:val>
        </c:ser>
        <c:axId val="{axis_cat}"/>
        <c:axId val="{axis_val}"/>
      </c:lineChart>
      <c:catAx>
        <c:axId val="{axis_cat}"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="b"/>
        <c:numFmt formatCode="General" sourceLinked="1"/>
        <c:majorTickMark val="out"/>
        <c:minorTickMark val="none"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="{axis_val}"/>
        <c:crosses val="autoZero"/>
        <c:auto val="1"/>
        <c:lblAlgn val="ctr"/>
        <c:lblOffset val="100"/>
      </c:catAx>
      <c:valAx>
        <c:axId val="{axis_val}"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="l"/>
        <c:majorGridlines/>
        <c:numFmt formatCode="General" sourceLinked="1"/>
        <c:majorTickMark val="out"/>
        <c:minorTickMark val="none"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="{axis_cat}"/>
        <c:crosses val="autoZero"/>
        <c:crossBetween val="between"/>
      </c:valAx>
    </c:plotArea>
    <c:legend>
      <c:legendPos val="r"/>
      <c:layout/>
    </c:legend>
    <c:plotVisOnly val="1"/>
  </c:chart>
</c:chartSpace>
"""


def build_styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="1">
    <numFmt numFmtId="164" formatCode="dd/mm/yyyy"/>
  </numFmts>
  <fonts count="7">
    <font><sz val="11"/><name val="Times New Roman"/></font>
    <font><b/><sz val="11"/><name val="Times New Roman"/></font>
    <font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Times New Roman"/></font>
    <font><b/><sz val="18"/><name val="Times New Roman"/></font>
    <font><b/><i/><sz val="11"/><name val="Times New Roman"/></font>
    <font><b/><sz val="12"/><name val="Times New Roman"/></font>
    <font><b/><color rgb="FF000000"/><sz val="11"/><name val="Times New Roman"/></font>
  </fonts>
  <fills count="13">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0E7C86"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE6F3F3"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF8FBFB"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFD2ECEC"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFFF00"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF92D050"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFC000"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF00B0F0"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFF6666"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFD9EAD3"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/><bgColor indexed="64"/></patternFill></fill>
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
  <cellXfs count="24">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="164" fontId="2" fillId="2" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" textRotation="90"/></xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="5" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="6" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="6" fillId="10" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="6" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="6" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="6" fillId="10" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="6" fillId="11" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="12" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
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
    rels = []
    for idx in range(1, sheet_count + 1):
        rels.append(f'<Relationship Id="rId{idx}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{idx}.xml"/>')
    rels.append(f'<Relationship Id="rId{sheet_count + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>')
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">{''.join(rels)}</Relationships>
"""


def build_root_rels() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""


def build_content_types(sheet_count: int, chart_count: int) -> str:
    overrides = []
    for idx in range(1, sheet_count + 1):
        overrides.append(f'<Override PartName="/xl/worksheets/sheet{idx}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')
    for idx in range(1, chart_count + 1):
        overrides.append(f'<Override PartName="/xl/drawings/drawing{idx}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>')
        overrides.append(f'<Override PartName="/xl/charts/chart{idx}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>')
    overrides.extend([
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
        '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
    ])
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
  <dc:title>SmartTravel Project Sprint Backlog</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-05-13T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-05-13T00:00:00Z</dcterms:modified>
</cp:coreProperties>
"""


def main() -> None:
    reports = [parse_testcase_workbook(path) for path in SOURCE_FILES]
    all_totals = {}
    sprint_packages = []
    for report in reports:
        tasks = build_sprint_tasks(report)
        totals = compute_member_totals(tasks)
        all_totals[report["sprint_name"]] = totals
        sprint_packages.append(build_sprint_sheet_xml(report, totals, len(sprint_packages) + 1))

    sheet_names = ["Sprint 1", "Sprint 2", "Sprint 3", "Total"]
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUTPUT_FILE, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", build_content_types(4, len(sprint_packages)))
        archive.writestr("_rels/.rels", build_root_rels())
        archive.writestr("docProps/app.xml", build_app_xml(sheet_names))
        archive.writestr("docProps/core.xml", build_core_xml())
        archive.writestr("xl/workbook.xml", build_workbook_xml(sheet_names))
        archive.writestr("xl/_rels/workbook.xml.rels", build_workbook_rels(4))
        archive.writestr("xl/styles.xml", build_styles_xml())
        for idx, package in enumerate(sprint_packages, start=1):
            sheet_xml, sheet_rels_xml, drawing_xml, drawing_rels_xml, chart_xml = package
            archive.writestr(f"xl/worksheets/sheet{idx}.xml", sheet_xml)
            archive.writestr(f"xl/worksheets/_rels/sheet{idx}.xml.rels", sheet_rels_xml)
            archive.writestr(f"xl/drawings/drawing{idx}.xml", drawing_xml)
            archive.writestr(f"xl/drawings/_rels/drawing{idx}.xml.rels", drawing_rels_xml)
            archive.writestr(f"xl/charts/chart{idx}.xml", chart_xml)
        archive.writestr("xl/worksheets/sheet4.xml", build_total_sheet_xml(all_totals))
    print(f"Created: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

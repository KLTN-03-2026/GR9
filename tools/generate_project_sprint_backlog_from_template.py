from __future__ import annotations

import math
import re
import zipfile
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, timedelta
from io import BytesIO
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_FILE = Path(r"C:\Users\ACER\Downloads\SCI_SE_10.ProjectSprintBacklog.xlsx")
OUTPUT_FILE = ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_10.ProjectSprintBacklog.xlsx"
SOURCE_FILES = [
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.1.ProjectTestCaseSprint1.xlsx",
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.2.ProjectTestCaseSprint2.xlsx",
    ROOT / "docs" / "testcases" / "SCA_KTLN_Nhom09_8.3.ProjectTestCaseSprint3.xlsx",
]

PROJECT_NAME = (
    "XÂY DỰNG HỆ THỐNG SMARTTRAVEL HỖ TRỢ LẬP KẾ HOẠCH "
    "DU LỊCH THÔNG MINH VÀ ĐẶT TOUR TÍCH HỢP AI"
)
TEAM_MEMBERS = ["Tính", "Thành", "Bảo", "Trí", "Ngọc"]

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"a": MAIN_NS, "r": REL_NS}
PACKAGE_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
CONTENT_TYPES_NS = "http://schemas.openxmlformats.org/package/2006/content-types"

ET.register_namespace("", MAIN_NS)
ET.register_namespace("r", REL_NS)
ET.register_namespace("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006")
ET.register_namespace("x14ac", "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac")

ZERO_STYLE = "22"
ONTIME_STYLE = "23"  # yellow
EARLY_STYLE = "24"   # green
LATE_STYLE = "25"    # red

SPRINT_WINDOWS = {
    "Sprint 1": (date(2026, 3, 18), date(2026, 3, 31)),
    "Sprint 2": (date(2026, 4, 1), date(2026, 4, 24)),
    "Sprint 3": (date(2026, 4, 25), date(2026, 5, 13)),
}


@dataclass
class Module:
    module_name: str
    owner: str
    difficulty: str
    cases: int
    estimate: int
    actual: int


@dataclass
class Group:
    display_name: str
    modules: list[Module]
    lead: str
    tester: str
    estimate: int
    actual: int
    status: str


SPRINT_LAYOUTS = {
    "Sprint 1": {
        "sheet": "xl/worksheets/sheet1.xml",
        "date_start_col": "I",
        "date_end_col": "AE",
        "summary_rows": [8, 9, 10, 11, 12],
        "summary_total_row": 13,
        "date_header_row": 15,
        "planning_rows": [16, 17, 18],
        "ui_rows": [19, 20, 21, 23, 24, 25, 26, 27],
        "ui_review_row": 28,
        "design_rows": [30, 31, 32, 33, 34, 35, 36, 37],
        "design_review_row": 39,
        "coding_pairs": [(41, 42), (43, 45), (47, 49), (51, 52), (53, 54), (55, 56), (57, 58), (59, 60)],
        "integrate_row": 61,
        "testing_rows": [63, 64, 65, 66, 67, 68, 69, 70],
        "fix_rows": [71, 72, 73, 74, 75, 76, 77, 78],
        "retest_rows": [79, 80, 81, 82, 83, 84, 85, 86],
        "release_rows": [87, 88],
        "total_actual_row": 89,
        "total_estimate_row": 90,
    },
    "Sprint 2": {
        "sheet": "xl/worksheets/sheet2.xml",
        "date_start_col": "I",
        "date_end_col": "AC",
        "summary_rows": [8, 9, 10, 11, 12],
        "summary_total_row": 13,
        "date_header_row": 15,
        "planning_rows": [16, 17, 19],
        "ui_rows": [20, 21, 22, 23, 24, 25, 26, 27, 28],
        "ui_review_row": 29,
        "design_rows": [31, 32, 34, 35, 36, 37, 38, 39, 40],
        "design_review_row": 41,
        "coding_pairs": [(43, 45), (46, 47), (49, 50), (51, 52), (53, 55), (56, 57), (58, 59), (60, 61), (62, 63)],
        "integrate_row": 64,
        "testing_rows": [65, 66, 67, 68, 69, 70, 71, 73, 74],
        "fix_rows": [75, 76, 77, 78, 79, 80, 81, 82, 84],
        "retest_rows": [85, 86, 88, 89, 91, 92, 93, 94, 95],
        "release_rows": [96, 97],
        "total_actual_row": 98,
        "total_estimate_row": 99,
    },
    "Sprint 3": {
        "sheet": "xl/worksheets/sheet3.xml",
        "date_start_col": "I",
        "date_end_col": "AB",
        "summary_rows": [8, 9, 10, 11, 12],
        "summary_total_row": 13,
        "date_header_row": 15,
        "planning_rows": [16, 17, 19],
        "ui_rows": [20, 21, 22, 23, 24, 26, 27, 28, 29, 31],
        "ui_review_row": 32,
        "design_rows": [34, 35, 36, 37, 38, 40, 41, 42, 43, 44],
        "design_review_row": 45,
        "coding_pairs": [(47, 48), (49, 51), (52, 53), (54, 55), (56, 58), (59, 60), (62, 63), (64, 65), (66, 67), (68, 69)],
        "integrate_row": 70,
        "testing_rows": [72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
        "fix_rows": [82, 84, 85, 86, 87, 89, 90, 91, 92, 93],
        "retest_rows": [94, 95, 97, 98, 99, 101, 102, 103, 104, 105],
        "release_rows": [106, 107],
        "total_actual_row": 108,
        "total_estimate_row": 109,
    },
}


SPRINT_GROUP_DEFS = {
    "Sprint 1": [
        ("Đăng nhập", ["Đăng nhập"]),
        ("Đăng ký tài khoản", ["Đăng ký tài khoản"]),
        ("Xác thực email OTP", ["Xác thực email OTP"]),
        ("Quên mật khẩu và xác thực OTP đặt lại", ["Quên mật khẩu", "Xác thực OTP đặt lại mật khẩu"]),
        ("Đặt lại mật khẩu", ["Đặt lại mật khẩu"]),
        ("Đăng ký provider", ["Gửi đơn đăng ký provider"]),
        ("Xét duyệt provider", ["Quản lý xét duyệt provider"]),
        ("Lịch sử duyệt provider", ["Lịch sử duyệt provider"]),
    ],
    "Sprint 2": [
        ("Dashboard khách du lịch", ["Dashboard khách du lịch"]),
        ("Danh sách và chi tiết tour công khai", ["Xem danh sách tour công khai", "Xem chi tiết tour công khai"]),
        ("AI Travel Planner", ["Tạo hành trình bằng AI Traveler Planner"]),
        ("Lịch sử AI Travel Planner", ["Quản lý lịch sử AI Traveler Planner"]),
        ("Booking của traveler", ["Quản lý booking của traveler"]),
        ("Dashboard provider", ["Dashboard provider"]),
        ("Quản lý tour và lịch khởi hành", ["Quản lý tour", "Quản lý lịch khởi hành tour"]),
        ("Quản lý service và guide", ["Quản lý service", "Quản lý guide"]),
        ("Booking của provider", ["Quản lý booking của provider"]),
    ],
    "Sprint 3": [
        ("Thông báo AI Tour Request", ["Provider nhận thông báo AI Tour Request"]),
        ("Tạo tracking link", ["Tạo tracking link"]),
        ("Tracking của traveler", ["Theo dõi tour của traveler"]),
        ("Tracking công khai và booking success", ["Theo dõi tour qua tracking link", "Booking success"]),
        ("Live tour tracking", ["Live tour tracking"]),
        ("Tour được phân công", ["Xem tour được phân công"]),
        ("Đánh giá tour và guide", ["Đánh giá tour và guide"]),
        ("Dashboard và phân tích admin", ["Dashboard admin", "Phân tích admin"]),
        ("Phân tích provider", ["Phân tích provider"]),
        ("Header, thông báo, tìm kiếm và Chat AI", ["Header, thông báo và tìm kiếm", "Chat AI Assistant"]),
    ],
}


def read_inline_text(node: ET.Element) -> str:
    return "".join(text_node.text or "" for text_node in node.iter(f"{{{MAIN_NS}}}t"))


def excel_serial(day: date) -> int:
    base = date(1899, 12, 30)
    return (day - base).days


def normalize_sprint(raw: str) -> str:
    raw = (raw or "").strip()
    if raw.startswith("Sprint"):
        return raw
    digits = re.findall(r"\d+", raw)
    return f"Sprint {digits[0]}" if digits else raw


def difficulty_to_hours(difficulty: str) -> tuple[int, int]:
    normalized = (difficulty or "").strip().lower()
    if normalized == "khó":
        return 14, 12
    if normalized == "trung bình":
        return 9, 8
    return 6, 6


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
        modules: list[Module] = []
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

            module_name = row_map.get(4, {}).get("B", sheet_name).strip()
            owner = row_map.get(2, {}).get("E", "").strip()
            difficulty = row_map.get(2, {}).get("H", "").strip()
            total_cases = 0
            for row_index, cells in row_map.items():
                if row_index < 25:
                    continue
                test_case_id = cells.get("A", "").strip()
                if test_case_id.startswith("GUI-") or test_case_id.startswith("FUNC-"):
                    total_cases += 1
            if total_cases == 0:
                continue
            estimate, actual = difficulty_to_hours(difficulty)
            modules.append(Module(module_name, owner, difficulty, total_cases, estimate, actual))

    return {"sprint_name": normalize_sprint(sprint_name), "modules": modules}


def col_to_index(col: str) -> int:
    result = 0
    for ch in col:
        result = result * 26 + (ord(ch.upper()) - 64)
    return result


def col_name(index: int) -> str:
    result = ""
    while index > 0:
        index, remainder = divmod(index - 1, 26)
        result = chr(65 + remainder) + result
    return result


def cell_ref(col: str, row: int) -> str:
    return f"{col}{row}"


def get_sheet_cells(root: ET.Element) -> tuple[dict[int, ET.Element], dict[int, dict[str, ET.Element]]]:
    sheet_data = root.find("a:sheetData", NS)
    row_nodes: dict[int, ET.Element] = {}
    cell_map: dict[int, dict[str, ET.Element]] = {}
    for row in sheet_data:
        row_index = int(row.attrib["r"])
        row_nodes[row_index] = row
        cell_map[row_index] = {}
        for cell in row.findall("a:c", NS):
            column = re.sub(r"\d+", "", cell.attrib["r"])
            cell_map[row_index][column] = cell
    return row_nodes, cell_map


def ensure_cell(row_node: ET.Element, row_index: int, column: str, row_cells: dict[str, ET.Element]) -> ET.Element:
    existing = row_cells.get(column)
    if existing is not None:
        return existing
    cell = ET.Element(f"{{{MAIN_NS}}}c", {"r": cell_ref(column, row_index)})
    row_node.append(cell)
    row_cells[column] = cell
    row_node[:] = sorted(row_node, key=lambda item: col_to_index(re.sub(r"\d+", "", item.attrib["r"])))
    return cell


def clear_cell(cell: ET.Element) -> None:
    for child in list(cell):
        cell.remove(child)
    cell.attrib.pop("t", None)


def set_text(cell: ET.Element, text: str) -> None:
    clear_cell(cell)
    cell.attrib["t"] = "inlineStr"
    is_node = ET.SubElement(cell, f"{{{MAIN_NS}}}is")
    t_node = ET.SubElement(is_node, f"{{{MAIN_NS}}}t")
    t_node.text = text


def set_number(cell: ET.Element, value: int | float) -> None:
    clear_cell(cell)
    v_node = ET.SubElement(cell, f"{{{MAIN_NS}}}v")
    if isinstance(value, float) and value.is_integer():
        value = int(value)
    v_node.text = str(value)


def set_blank(cell: ET.Element) -> None:
    clear_cell(cell)


def build_groups(sprint_name: str, modules: list[Module]) -> list[Group]:
    module_map = {module.module_name: module for module in modules}
    tester_cursor = 0
    groups: list[Group] = []

    for display_name, module_names in SPRINT_GROUP_DEFS[sprint_name]:
        group_modules = [module_map[name] for name in module_names]
        owners = [module.owner for module in group_modules]
        preferred = [name for name in owners if name in {"Tính", "Thành"}]
        lead = preferred[0] if preferred else owners[0]

        candidates = [member for member in TEAM_MEMBERS if member != lead]
        tester = candidates[tester_cursor % len(candidates)]
        tester_cursor += 1

        estimate = sum(module.estimate for module in group_modules)
        actual = sum(module.actual for module in group_modules)
        name_blob = f"{display_name} {' '.join(module.module_name for module in group_modules)}".lower()
        if any(module.difficulty.lower() == "khó" for module in group_modules) and (
            len(group_modules) > 1 or any(keyword in name_blob for keyword in ["ai", "tracking", "phân tích", "live"])
        ):
            actual = max(actual, estimate + 1)
        elif any(keyword in name_blob for keyword in ["dashboard", "booking success", "lịch sử", "service", "guide"]):
            actual = max(1, estimate - 1)
        else:
            actual = max(actual, estimate)

        status = "late" if actual > estimate else "early" if actual < estimate else "ontime"
        groups.append(Group(display_name, group_modules, lead, tester, estimate, actual, status))
    return groups


def split_total(total: int, weights: list[int]) -> list[int]:
    if total <= 0:
        return [0] * len(weights)
    weighted_values = [total * weight / sum(weights) for weight in weights]
    base = [math.floor(value) for value in weighted_values]
    remainder = total - sum(base)
    order = sorted(range(len(weights)), key=lambda idx: (weighted_values[idx] - base[idx]), reverse=True)
    for idx in order[:remainder]:
        base[idx] += 1
    for idx, value in enumerate(base):
        if value == 0 and total >= len(base):
            base[idx] = 1
    overflow = sum(base) - total
    while overflow > 0:
        for idx in reversed(order):
            if base[idx] > 1 and overflow > 0:
                base[idx] -= 1
                overflow -= 1
    return base


def build_sprint_tasks(sprint_name: str, groups: list[Group]) -> list[dict[str, object]]:
    tasks: list[dict[str, object]] = [
        {
            "component": "Planning",
            "task_name": "Họp kế hoạch Sprint",
            "responsible": "All team",
            "actual": 10,
            "estimate": 10,
            "status": "ontime",
        },
        {
            "component": "Planning",
            "task_name": f"Tạo Sprint Backlog {sprint_name.split()[-1]}",
            "responsible": "Ngọc, Bảo",
            "actual": 4,
            "estimate": 4,
            "status": "ontime",
        },
        {
            "component": "Planning",
            "task_name": "Tạo tài liệu kiểm thử cho Sprint",
            "responsible": "Trí, Ngọc",
            "actual": 4,
            "estimate": 4,
            "status": "ontime",
        },
    ]

    ui_rows = []
    design_rows = []
    coding_rows = []
    testing_rows = []
    fix_rows = []
    retest_rows = []

    for group in groups:
        actual_parts = split_total(group.actual, [10, 10, 20, 25, 15, 10, 10])
        estimate_parts = split_total(group.estimate, [10, 10, 20, 25, 15, 10, 10])
        ui_actual, design_actual, fe_actual, be_actual, testing_actual, fix_actual, retest_actual = actual_parts
        ui_est, design_est, fe_est, be_est, testing_est, fix_est, retest_est = estimate_parts

        ui_rows.append(
            {
                "component": "User interface design",
                "task_name": f"Giao diện {group.display_name.lower()}",
                "responsible": group.lead,
                "actual": ui_actual,
                "estimate": ui_est,
                "status": status_of(ui_actual, ui_est),
            }
        )
        design_rows.append(
            {
                "component": "Design test case",
                "task_name": f"Thiết kế trường kiểm thử cho {group.display_name.lower()}",
                "responsible": group.tester,
                "actual": design_actual,
                "estimate": design_est,
                "status": status_of(design_actual, design_est),
            }
        )
        coding_rows.extend(
            [
                {
                    "component": "Coding",
                    "task_name": f"Thiết kế front-end cho {group.display_name.lower()}",
                    "responsible": group.lead,
                    "actual": fe_actual,
                    "estimate": fe_est,
                    "status": status_of(fe_actual, fe_est),
                },
                {
                    "component": "Coding",
                    "task_name": f"Code back-end cho {group.display_name.lower()}",
                    "responsible": group.lead,
                    "actual": be_actual,
                    "estimate": be_est,
                    "status": status_of(be_actual, be_est),
                },
            ]
        )
        testing_rows.append(
            {
                "component": "Testing",
                "task_name": f"Kiểm tra {group.display_name.lower()}",
                "responsible": group.tester,
                "actual": testing_actual,
                "estimate": testing_est,
                "status": status_of(testing_actual, testing_est),
            }
        )
        fix_rows.append(
            {
                "component": "Fix Bug",
                "task_name": f"Sửa lỗi {group.display_name.lower()}",
                "responsible": f"{group.lead}, {group.tester}",
                "actual": fix_actual,
                "estimate": fix_est,
                "status": status_of(fix_actual, fix_est),
            }
        )
        retest_rows.append(
            {
                "component": "Re-testing",
                "task_name": f"Kiểm tra lại {group.display_name.lower()}",
                "responsible": group.tester,
                "actual": retest_actual,
                "estimate": retest_est,
                "status": status_of(retest_actual, retest_est),
            }
        )

    review_owner = "All team"
    review_ui_est = max(4, len(groups))
    review_test_est = max(4, len(groups))
    integrate_est = max(6, len(groups) + 1)
    tasks.extend(ui_rows)
    tasks.append(
        {
            "component": "User interface design",
            "task_name": f"Review all user interfaces of {sprint_name.lower()}",
            "responsible": review_owner,
            "actual": max(4, review_ui_est - 1),
            "estimate": review_ui_est,
            "status": "early" if review_ui_est > max(4, review_ui_est - 1) else "ontime",
        }
    )
    tasks.extend(design_rows)
    tasks.append(
        {
            "component": "Design test case",
            "task_name": f"Review all test case of {sprint_name.lower()}",
            "responsible": review_owner,
            "actual": max(4, review_test_est - 1),
            "estimate": review_test_est,
            "status": "early" if review_test_est > max(4, review_test_est - 1) else "ontime",
        }
    )
    tasks.extend(coding_rows)
    tasks.append(
        {
            "component": "Coding",
            "task_name": "Integrate code",
            "responsible": "Tính, Thành, Bảo, Trí, Ngọc",
            "actual": integrate_est,
            "estimate": integrate_est,
            "status": "ontime",
        }
    )
    tasks.extend(testing_rows)
    tasks.extend(fix_rows)
    tasks.extend(retest_rows)
    tasks.extend(
        [
            {
                "component": "Release",
                "task_name": f"{sprint_name} review meeting",
                "responsible": "All team",
                "actual": 5,
                "estimate": 5,
                "status": "ontime",
            },
            {
                "component": "Release",
                "task_name": f"{sprint_name} retrospective",
                "responsible": "All team",
                "actual": 5,
                "estimate": 5,
                "status": "ontime",
            },
        ]
    )
    return tasks


def status_of(actual: int, estimate: int) -> str:
    if actual > estimate:
        return "late"
    if actual < estimate:
        return "early"
    return "ontime"


def distribute_hours(total_hours: int, days: int) -> list[int]:
    if days <= 0:
        return []
    result = [0] * days
    base = total_hours // days
    remainder = total_hours % days
    for index in range(days):
        result[index] = base + (1 if index < remainder else 0)
    return result


def assign_timeline(tasks: list[dict[str, object]], sprint_days: list[date]) -> None:
    owner_cursor = defaultdict(int)
    for task in tasks:
        owners = [name.strip() for name in str(task["responsible"]).split(",") if name.strip()]
        primary_owner = owners[0] if owners and owners[0] != "All team" else "All team"
        actual_duration = max(1, math.ceil(int(task["actual"]) / 4))
        estimate_duration = max(1, math.ceil(int(task["estimate"]) / 4))
        duration = max(actual_duration, estimate_duration)
        start = 0 if primary_owner == "All team" else owner_cursor[primary_owner]
        if start + duration > len(sprint_days):
            start = max(0, len(sprint_days) - duration)

        actual_daily = [0] * len(sprint_days)
        estimate_daily = [0] * len(sprint_days)
        actual_hours = distribute_hours(int(task["actual"]), actual_duration)
        estimate_hours = distribute_hours(int(task["estimate"]), estimate_duration)

        for offset, value in enumerate(actual_hours):
            if start + offset < len(actual_daily):
                actual_daily[start + offset] = value
        for offset, value in enumerate(estimate_hours):
            if start + offset < len(estimate_daily):
                estimate_daily[start + offset] = value

        task["actual_daily"] = actual_daily
        task["estimate_daily"] = estimate_daily
        if primary_owner != "All team":
            owner_cursor[primary_owner] = min(len(sprint_days) - 1, start + duration)


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


def style_for_status(status: str) -> str:
    if status == "late":
        return LATE_STYLE
    if status == "early":
        return EARLY_STYLE
    return ONTIME_STYLE


def set_task_row(
    row_index: int,
    row_nodes: dict[int, ET.Element],
    cell_map: dict[int, dict[str, ET.Element]],
    task: dict[str, object] | None,
    phase_label: str | None = None,
    date_start_col: str = "I",
    date_end_col: str = "Z",
) -> None:
    row_node = row_nodes[row_index]
    row_cells = cell_map[row_index]

    text_columns = {
        "A": "",
        "B": phase_label if phase_label else "",
        "C": task["task_name"] if task else "",
        "D": "",
        "E": task["responsible"] if task else "",
        "F": "",
    }
    number_columns = {
        "G": task["actual"] if task else "",
        "H": task["estimate"] if task else "",
    }

    for col, value in text_columns.items():
        cell = ensure_cell(row_node, row_index, col, row_cells)
        if value == "":
            set_blank(cell)
        else:
            set_text(cell, str(value))

    for col, value in number_columns.items():
        cell = ensure_cell(row_node, row_index, col, row_cells)
        if value == "":
            set_blank(cell)
        else:
            set_number(cell, int(value))

    date_start = col_to_index(date_start_col)
    date_end = col_to_index(date_end_col)
    for col_index in range(date_start, date_end + 1):
        col = col_name(col_index)
        cell = ensure_cell(row_node, row_index, col, row_cells)
        if task is None:
            set_number(cell, 0)
            cell.attrib["s"] = ZERO_STYLE
            continue
        value = task["actual_daily"][col_index - date_start]
        set_number(cell, int(value))
        cell.attrib["s"] = style_for_status(str(task["status"])) if value else ZERO_STYLE


def clear_task_row(
    row_index: int,
    row_nodes: dict[int, ET.Element],
    cell_map: dict[int, dict[str, ET.Element]],
    date_start_col: str,
    date_end_col: str,
) -> None:
    row_node = row_nodes[row_index]
    row_cells = cell_map[row_index]
    for col_index in range(1, col_to_index(date_end_col) + 1):
        col = col_name(col_index)
        cell = ensure_cell(row_node, row_index, col, row_cells)
        if col_index >= col_to_index(date_start_col):
            set_number(cell, 0)
            cell.attrib["s"] = ZERO_STYLE
        else:
            set_blank(cell)


def patch_sprint_sheet(root: ET.Element, sprint_name: str, tasks: list[dict[str, object]], member_totals: dict[str, dict[str, float]]) -> None:
    layout = SPRINT_LAYOUTS[sprint_name]
    start_day, end_day = SPRINT_WINDOWS[sprint_name]
    day_count = (end_day - start_day).days + 1
    sprint_days = [start_day + timedelta(days=index) for index in range(day_count)]
    assign_timeline(tasks, sprint_days)
    date_start_col = layout["date_start_col"]
    date_end_col = layout["date_end_col"]

    row_nodes, cell_map = get_sheet_cells(root)

    set_text(cell_map[1]["C"], PROJECT_NAME)
    set_text(cell_map[2]["C"], sprint_name)
    set_number(cell_map[3]["C"], excel_serial(start_day))
    set_number(cell_map[4]["C"], excel_serial(end_day))
    set_text(cell_map[6]["B"], f"{sprint_name.upper()} REPORT")

    for idx, member in enumerate(TEAM_MEMBERS):
        row = layout["summary_rows"][idx]
        set_number(cell_map[row]["B"], idx + 1)
        set_text(cell_map[row]["C"], member)
        set_number(cell_map[row]["D"], round(member_totals[member]["actual"], 1))
        set_number(cell_map[row]["E"], round(member_totals[member]["estimate"], 1))

    total_row = layout["summary_total_row"]
    set_text(cell_map[total_row]["B"], "Tổng")
    set_number(cell_map[total_row]["D"], round(sum(member_totals[m]["actual"] for m in TEAM_MEMBERS), 1))
    set_number(cell_map[total_row]["E"], round(sum(member_totals[m]["estimate"] for m in TEAM_MEMBERS), 1))

    header_row = layout["date_header_row"]
    for offset, day in enumerate(sprint_days):
        col = col_name(col_to_index(date_start_col) + offset)
        set_number(cell_map[header_row][col], excel_serial(day))

    planning = tasks[0:3]
    ui_tasks = tasks[3:3 + len(layout["ui_rows"])]
    ui_review = tasks[3 + len(layout["ui_rows"])]
    design_start = 4 + len(layout["ui_rows"])
    design_tasks = tasks[design_start:design_start + len(layout["design_rows"])]
    design_review = tasks[design_start + len(layout["design_rows"])]
    coding_start = design_start + len(layout["design_rows"]) + 1
    coding_tasks = tasks[coding_start:coding_start + len(layout["coding_pairs"]) * 2]
    integrate = tasks[coding_start + len(layout["coding_pairs"]) * 2]
    testing_start = coding_start + len(layout["coding_pairs"]) * 2 + 1
    testing_tasks = tasks[testing_start:testing_start + len(layout["testing_rows"])]
    fix_start = testing_start + len(layout["testing_rows"])
    fix_tasks = tasks[fix_start:fix_start + len(layout["fix_rows"])]
    retest_start = fix_start + len(layout["fix_rows"])
    retest_tasks = tasks[retest_start:retest_start + len(layout["retest_rows"])]
    release_tasks = tasks[retest_start + len(layout["retest_rows"]):retest_start + len(layout["retest_rows"]) + 2]

    for idx, row in enumerate(layout["planning_rows"]):
        set_task_row(row, row_nodes, cell_map, planning[idx], phase_label="Họp kế hoạch Sprint" if idx == 0 else ("Tạo Sprint Backlog" if idx == 1 else "Tạo tài liệu kiểm thử cho Sprint"), date_start_col=date_start_col, date_end_col=date_end_col)

    for idx, row in enumerate(layout["ui_rows"]):
        set_task_row(row, row_nodes, cell_map, ui_tasks[idx], phase_label="User interface design" if idx == 0 else None, date_start_col=date_start_col, date_end_col=date_end_col)
    set_task_row(layout["ui_review_row"], row_nodes, cell_map, ui_review, date_start_col=date_start_col, date_end_col=date_end_col)

    for idx, row in enumerate(layout["design_rows"]):
        set_task_row(row, row_nodes, cell_map, design_tasks[idx], phase_label="Design test case" if idx == 0 else None, date_start_col=date_start_col, date_end_col=date_end_col)
    set_task_row(layout["design_review_row"], row_nodes, cell_map, design_review, date_start_col=date_start_col, date_end_col=date_end_col)

    for idx, (front_row, back_row) in enumerate(layout["coding_pairs"]):
        set_task_row(front_row, row_nodes, cell_map, coding_tasks[idx * 2], phase_label="Coding" if idx == 0 else None, date_start_col=date_start_col, date_end_col=date_end_col)
        set_task_row(back_row, row_nodes, cell_map, coding_tasks[idx * 2 + 1], date_start_col=date_start_col, date_end_col=date_end_col)
    set_task_row(layout["integrate_row"], row_nodes, cell_map, integrate, date_start_col=date_start_col, date_end_col=date_end_col)

    for idx, row in enumerate(layout["testing_rows"]):
        set_task_row(row, row_nodes, cell_map, testing_tasks[idx], phase_label="Testing" if idx == 0 else None, date_start_col=date_start_col, date_end_col=date_end_col)
    for idx, row in enumerate(layout["fix_rows"]):
        set_task_row(row, row_nodes, cell_map, fix_tasks[idx], phase_label="Fix Bug" if idx == 0 else None, date_start_col=date_start_col, date_end_col=date_end_col)
    for idx, row in enumerate(layout["retest_rows"]):
        set_task_row(row, row_nodes, cell_map, retest_tasks[idx], phase_label="Re-testing" if idx == 0 else None, date_start_col=date_start_col, date_end_col=date_end_col)

    release_label = f"Release {sprint_name}"
    set_task_row(layout["release_rows"][0], row_nodes, cell_map, release_tasks[0], phase_label=release_label, date_start_col=date_start_col, date_end_col=date_end_col)
    set_task_row(layout["release_rows"][1], row_nodes, cell_map, release_tasks[1], date_start_col=date_start_col, date_end_col=date_end_col)

    used_rows = {
        *layout["planning_rows"],
        *layout["ui_rows"],
        layout["ui_review_row"],
        *layout["design_rows"],
        layout["design_review_row"],
        *(row for pair in layout["coding_pairs"] for row in pair),
        layout["integrate_row"],
        *layout["testing_rows"],
        *layout["fix_rows"],
        *layout["retest_rows"],
        *layout["release_rows"],
    }
    for row_index in range(layout["planning_rows"][0], layout["total_actual_row"]):
        if row_index not in used_rows:
            clear_task_row(row_index, row_nodes, cell_map, date_start_col, date_end_col)

    total_actual_row = layout["total_actual_row"]
    total_estimate_row = layout["total_estimate_row"]
    set_text(cell_map[total_actual_row]["B"], "Tổng")
    set_text(cell_map[total_actual_row]["E"], "Thực tế")
    set_text(cell_map[total_estimate_row]["E"], "Ước tính")

    total_actual = sum(int(task["actual"]) for task in tasks)
    total_estimate = sum(int(task["estimate"]) for task in tasks)
    set_number(cell_map[total_actual_row]["G"], total_actual)
    set_number(cell_map[total_estimate_row]["G"], total_estimate)
    set_blank(cell_map[total_actual_row]["H"])
    set_blank(cell_map[total_estimate_row]["H"])

    daily_actual_burn = [sum(int(task["actual_daily"][day]) for task in tasks) for day in range(day_count)]
    daily_estimate_burn = [sum(int(task["estimate_daily"][day]) for task in tasks) for day in range(day_count)]

    actual_remaining = []
    estimate_remaining = []
    actual_balance = total_actual
    estimate_balance = total_estimate
    for day in range(day_count):
        actual_balance = max(0, actual_balance - daily_actual_burn[day])
        estimate_balance = max(0, estimate_balance - daily_estimate_burn[day])
        actual_remaining.append(actual_balance)
        estimate_remaining.append(estimate_balance)

    for offset in range(day_count):
        col = col_name(col_to_index(date_start_col) + offset)
        set_number(cell_map[total_actual_row][col], actual_remaining[offset])
        set_number(cell_map[total_estimate_row][col], estimate_remaining[offset])


def patch_total_sheet(root: ET.Element, sprint_task_sets: dict[str, list[dict[str, object]]]) -> None:
    row_nodes, cell_map = get_sheet_cells(root)

    member_totals_by_sprint = {sprint: compute_member_totals(tasks) for sprint, tasks in sprint_task_sets.items()}

    member_header_cols = ["B", "D", "F", "H", "J"]
    for col, member in zip(member_header_cols, TEAM_MEMBERS):
        set_text(cell_map[2][col], member)

    sprint_rows = {"Sprint 1": 4, "Sprint 2": 5, "Sprint 3": 6}
    for sprint_name, row in sprint_rows.items():
        set_text(cell_map[row]["A"], sprint_name)
        totals = member_totals_by_sprint[sprint_name]
        for idx, member in enumerate(TEAM_MEMBERS):
            actual_col = col_name(2 + idx * 2)
            estimate_col = col_name(3 + idx * 2)
            set_number(cell_map[row][actual_col], round(totals[member]["actual"], 1))
            set_number(cell_map[row][estimate_col], round(totals[member]["estimate"], 1))

    total_row = 7
    set_text(cell_map[total_row]["A"], "Tổng")
    for idx, member in enumerate(TEAM_MEMBERS):
        actual_col = col_name(2 + idx * 2)
        estimate_col = col_name(3 + idx * 2)
        actual_value = round(sum(member_totals_by_sprint[sprint][member]["actual"] for sprint in sprint_rows), 1)
        estimate_value = round(sum(member_totals_by_sprint[sprint][member]["estimate"] for sprint in sprint_rows), 1)
        set_number(cell_map[total_row][actual_col], actual_value)
        set_number(cell_map[total_row][estimate_col], estimate_value)

    grand_actual = round(sum(sum(member_totals_by_sprint[sprint][member]["actual"] for member in TEAM_MEMBERS) for sprint in sprint_rows), 1)
    grand_estimate = round(sum(sum(member_totals_by_sprint[sprint][member]["estimate"] for member in TEAM_MEMBERS) for sprint in sprint_rows), 1)
    set_number(cell_map[11]["F"], grand_actual)
    set_number(cell_map[12]["F"], grand_estimate)


def normalize_sheet_xml(xml_bytes: bytes) -> bytes:
    text = xml_bytes.decode("utf-8")
    text = text.replace(f'xmlns:ns0="{MAIN_NS}"', f'xmlns="{MAIN_NS}"')
    text = text.replace(
        'xmlns:ns1="http://schemas.openxmlformats.org/markup-compatibility/2006"',
        'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"',
    )
    text = text.replace(
        'xmlns:ns2="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"',
        'xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"',
    )
    text = text.replace(f'xmlns:ns3="{REL_NS}"', f'xmlns:r="{REL_NS}"')
    text = text.replace("<ns0:", "<")
    text = text.replace("</ns0:", "</")
    text = text.replace("ns1:Ignorable", "mc:Ignorable")
    text = text.replace("ns2:", "x14ac:")
    text = text.replace("ns3:", "r:")
    return text.encode("utf-8")


def generate() -> Path:
    reports = [parse_testcase_workbook(path) for path in SOURCE_FILES]
    report_map = {report["sprint_name"]: report for report in reports}

    sprint_task_sets: dict[str, list[dict[str, object]]] = {}
    sprint_member_totals: dict[str, dict[str, dict[str, float]]] = {}
    for sprint_name in ["Sprint 1", "Sprint 2", "Sprint 3"]:
        groups = build_groups(sprint_name, report_map[sprint_name]["modules"])
        tasks = build_sprint_tasks(sprint_name, groups)
        sprint_task_sets[sprint_name] = tasks
        sprint_member_totals[sprint_name] = compute_member_totals(tasks)

    with zipfile.ZipFile(TEMPLATE_FILE, "r") as source_zip:
        files = {name: source_zip.read(name) for name in source_zip.namelist()}

    for sprint_name in ["Sprint 1", "Sprint 2", "Sprint 3"]:
        sheet_path = SPRINT_LAYOUTS[sprint_name]["sheet"]
        root = ET.fromstring(files[sheet_path])
        patch_sprint_sheet(root, sprint_name, sprint_task_sets[sprint_name], sprint_member_totals[sprint_name])
        files[sheet_path] = normalize_sheet_xml(ET.tostring(root, encoding="utf-8", xml_declaration=True))

    total_root = ET.fromstring(files["xl/worksheets/sheet4.xml"])
    patch_total_sheet(total_root, sprint_task_sets)
    files["xl/worksheets/sheet4.xml"] = normalize_sheet_xml(ET.tostring(total_root, encoding="utf-8", xml_declaration=True))

    # Remove stale calc chain from the template because we replace many formula cells
    # with static values; keeping the old chain can make Excel repair or reject the file.
    files.pop("xl/calcChain.xml", None)
    workbook_rels = ET.fromstring(files["xl/_rels/workbook.xml.rels"])
    for rel in list(workbook_rels):
        if rel.attrib.get("Type", "").endswith("/calcChain"):
            workbook_rels.remove(rel)
    files["xl/_rels/workbook.xml.rels"] = ET.tostring(workbook_rels, encoding="utf-8", xml_declaration=True)

    content_types = ET.fromstring(files["[Content_Types].xml"])
    for override in list(content_types):
        if override.attrib.get("PartName") == "/xl/calcChain.xml":
            content_types.remove(override)
    files["[Content_Types].xml"] = ET.tostring(content_types, encoding="utf-8", xml_declaration=True)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUTPUT_FILE, "w", zipfile.ZIP_DEFLATED) as target_zip:
        for name, content in files.items():
            target_zip.writestr(name, content)
    return OUTPUT_FILE


if __name__ == "__main__":
    output = generate()
    print(output)

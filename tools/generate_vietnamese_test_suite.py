from __future__ import annotations

from copy import deepcopy
from dataclasses import replace
from datetime import datetime
from pathlib import Path
from typing import List
from xml.sax.saxutils import escape
import zipfile

from generate_page_based_testcase_workbooks import SPRINTS as PAGE_SPRINTS
from generate_testcase_workbooks import ModulePlan, SprintPlan, write_workbook


VIETNAMESE_LABELS = {
    "LOGIN_PAGE": ("Đăng nhập", "ĐĂNG NHẬP", "Đăng nhập"),
    "REGISTER_PAGE": ("Đăng ký tài khoản", "ĐĂNG KÝ TÀI KHOẢN", "Đăng ký tài khoản"),
    "VERIFY_EMAIL_OTP": ("Xác thực email OTP", "XÁC THỰC EMAIL OTP", "Xác thực email OTP"),
    "FORGOT_PASSWORD": ("Quên mật khẩu", "QUÊN MẬT KHẨU", "Quên mật khẩu"),
    "VERIFY_RESET_OTP": ("Xác thực OTP đặt lại", "XÁC THỰC OTP ĐẶT LẠI", "Xác thực OTP đặt lại mật khẩu"),
    "RESET_PASSWORD": ("Đặt lại mật khẩu", "ĐẶT LẠI MẬT KHẨU", "Đặt lại mật khẩu"),
    "PROVIDER_APPLY_PAGE": ("Đăng ký provider", "ĐĂNG KÝ PROVIDER", "Gửi đơn đăng ký provider"),
    "PROVIDER_APPROVAL": ("Duyệt provider", "DUYỆT PROVIDER", "Quản lý xét duyệt provider"),
    "PROVIDER_APPROVAL_HISTORY": ("Lịch sử duyệt provider", "LỊCH SỬ DUYỆT", "Lịch sử duyệt provider"),
    "TRAVELER_DASHBOARD": ("Dashboard traveler", "DASHBOARD TRAVELER", "Dashboard khách du lịch"),
    "TOUR_LIST_PAGE": ("Danh sách tour công khai", "DANH SÁCH TOUR", "Xem danh sách tour công khai"),
    "TOUR_DETAIL_PAGE": ("Chi tiết tour công khai", "CHI TIẾT TOUR", "Xem chi tiết tour công khai"),
    "AI_PLANNER_PAGE": ("Tạo hành trình bằng AI", "AI TRAVEL PLANNER", "Tạo hành trình bằng AI Traveler Planner"),
    "AI_HISTORY_PAGE": ("Lịch sử AI Planner", "LỊCH SỬ AI", "Quản lý lịch sử AI Traveler Planner"),
    "MY_BOOKING_PAGE": ("Booking của traveler", "BOOKING TRAVELER", "Quản lý booking của traveler"),
    "PROVIDER_DASHBOARD": ("Dashboard provider", "DASHBOARD PROVIDER", "Dashboard provider"),
    "MANAGE_TOURS_PAGE": ("Quản lý tour", "QUẢN LÝ TOUR", "Quản lý tour"),
    "TOUR_SCHEDULE_PAGE": ("Lịch khởi hành tour", "LỊCH KHỞI HÀNH", "Quản lý lịch khởi hành tour"),
    "SERVICE_MGMT_PAGE": ("Quản lý service", "QUẢN LÝ SERVICE", "Quản lý service"),
    "GUIDE_MGMT_PAGE": ("Quản lý guide", "QUẢN LÝ GUIDE", "Quản lý guide"),
    "PROVIDER_BOOK_PAGE": ("Booking của provider", "BOOKING PROVIDER", "Quản lý booking của provider"),
    "AI_REQUEST_DETAIL": ("AI Tour Request", "AI TOUR REQUEST", "Provider nhận thông báo AI Tour Request"),
    "TRACKING_MGMT_PAGE": ("Tạo tracking link", "TRACKING LINK", "Tạo tracking link"),
    "TOUR_TRACKING_PAGE": ("Theo dõi tour", "TOUR TRACKING", "Theo dõi tour của traveler"),
    "PUBLIC_TRACK_PAGE": ("Tracking công khai", "TRACKING CÔNG KHAI", "Theo dõi tour qua tracking link"),
    "BOOKING_SUCCESS_PAGE": ("Booking success", "BOOKING SUCCESS", "Booking success"),
    "GUIDE_LIVE_TRACK": ("Live tour tracking", "LIVE TOUR TRACKING", "Live tour tracking"),
    "ASSIGNED_TOURS_PAGE": ("Tour được phân công", "TOUR ĐƯỢC PHÂN CÔNG", "Xem tour được phân công"),
    "REVIEW_PAGE": ("Đánh giá tour và guide", "ĐÁNH GIÁ TOUR", "Đánh giá tour và guide"),
    "ADMIN_DASHBOARD_PAGE": ("Dashboard admin", "DASHBOARD ADMIN", "Dashboard admin"),
    "ADMIN_ANALYTICS_PAGE": ("Phân tích admin", "PHÂN TÍCH ADMIN", "Phân tích admin"),
    "PROVIDER_ANALYTICS_PAGE": ("Phân tích provider", "PHÂN TÍCH PROVIDER", "Phân tích provider"),
    "HEADER_SEARCH_PAGE": ("Header và thông báo", "HEADER THÔNG BÁO", "Header, thông báo và tìm kiếm"),
    "CHATBOT_PAGE": ("Chat AI Assistant", "CHAT AI ASSISTANT", "Chat AI Assistant"),
}


def vi_sprints() -> List[SprintPlan]:
    sprints = deepcopy(PAGE_SPRINTS)
    file_names = {
        "Sprint 1": "Sprint_1_Test_Cases_Vietnamese.xlsx",
        "Sprint 2": "Sprint_2_Test_Cases_Vietnamese.xlsx",
        "Sprint 3": "Sprint_3_Test_Cases_Vietnamese.xlsx",
    }
    for sprint in sprints:
        sprint.file_name = file_names[sprint.sprint_name]
        for module in sprint.modules:
            sheet_name, module_code, module_name = VIETNAMESE_LABELS.get(
                module.module_code,
                (module.sheet_name, module.module_code, module.module_name),
            )
            module.sheet_name = sheet_name[:31]
            module.module_code = module_code
            module.module_name = module_name
    return sprints


def module_hours(module: ModulePlan) -> tuple[int, int, int]:
    if module.difficulty == "Khó":
        return (2, 3, 2)
    return (1, 2, 1)


def sprint_phase_rows(sprint_idx: int, sprint: SprintPlan):
    rows = []
    round1_start, round1_end = sprint.round1_dates[0], sprint.round1_dates[-1]
    round2_start, round2_end = sprint.round2_dates[0], sprint.round2_dates[-1]

    if sprint.sprint_name == "Sprint 1":
        plan_doc_date = "23/03/2026"
        design_date = "24/03/2026"
    elif sprint.sprint_name == "Sprint 2":
        plan_doc_date = "15/04/2026"
        design_date = "16/04/2026"
    else:
        plan_doc_date = "06/05/2026"
        design_date = "07/05/2026"

    design_total = sum(module_hours(module)[0] for module in sprint.modules)
    test_total = sum(module_hours(module)[1] for module in sprint.modules)
    retest_total = sum(module_hours(module)[2] for module in sprint.modules)

    rows.append([str(sprint_idx), sprint.sprint_name, plan_doc_date, round2_end, str(4 + design_total + test_total + retest_total), ""])
    rows.append([f"{sprint_idx}.1", f"Tạo tài liệu test plan {sprint.sprint_name}", plan_doc_date, plan_doc_date, "4", "Trí"])
    rows.append([f"{sprint_idx}.2", "Thiết kế test case", design_date, design_date, str(design_total), ""])
    for module in sprint.modules:
        design_hours, _, _ = module_hours(module)
        rows.append(["", f"Thiết kế trường kiểm thử cho {module.module_name}", design_date, design_date, str(design_hours), module.tester])

    rows.append([f"{sprint_idx}.3", "Testing", round1_start, round1_end, str(test_total), ""])
    for module in sprint.modules:
        _, test_hours, _ = module_hours(module)
        rows.append(["", f"Kiểm thử {module.module_name}", round1_start, round1_end, str(test_hours), module.tester])

    rows.append([f"{sprint_idx}.4", "Re-testing", round2_start, round2_end, str(retest_total), ""])
    for module in sprint.modules:
        _, _, retest_hours = module_hours(module)
        rows.append(["", f"Kiểm tra lại {module.module_name}", round2_start, round2_end, str(retest_hours), module.tester])
    return rows


def word_p(text: str, bold: bool = False) -> str:
    if not text:
        return '<w:p/>'
    run_props = "<w:rPr><w:b/></w:rPr>" if bold else ""
    return (
        "<w:p>"
        f"<w:r>{run_props}<w:t xml:space=\"preserve\">{escape(text)}</w:t></w:r>"
        "</w:p>"
    )


def word_table(rows: List[List[str]]) -> str:
    borders = (
        "<w:tblBorders>"
        "<w:top w:val=\"single\" w:sz=\"6\" w:space=\"0\" w:color=\"000000\"/>"
        "<w:left w:val=\"single\" w:sz=\"6\" w:space=\"0\" w:color=\"000000\"/>"
        "<w:bottom w:val=\"single\" w:sz=\"6\" w:space=\"0\" w:color=\"000000\"/>"
        "<w:right w:val=\"single\" w:sz=\"6\" w:space=\"0\" w:color=\"000000\"/>"
        "<w:insideH w:val=\"single\" w:sz=\"6\" w:space=\"0\" w:color=\"000000\"/>"
        "<w:insideV w:val=\"single\" w:sz=\"6\" w:space=\"0\" w:color=\"000000\"/>"
        "</w:tblBorders>"
    )
    tbl_rows = []
    for row_idx, row in enumerate(rows):
        cells = []
        for cell in row:
            content = escape(cell)
            p = (
                "<w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space=\"preserve\">"
                f"{content}</w:t></w:r></w:p>"
                if row_idx == 0
                else "<w:p><w:r><w:t xml:space=\"preserve\">"
                f"{content}</w:t></w:r></w:p>"
            )
            cells.append(f"<w:tc><w:tcPr/><w:p>{''}</w:p>{p}</w:tc>")
        tbl_rows.append(f"<w:tr>{''.join(cells)}</w:tr>")
    return (
        "<w:tbl>"
        f"<w:tblPr>{borders}</w:tblPr>"
        f"{''.join(tbl_rows)}"
        "</w:tbl>"
    )


def build_test_plan_docx(sprints: List[SprintPlan], target: Path):
    sections = []
    sections.append(word_p("TEST PLAN KIỂM THỬ 3 SPRINT", bold=True))
    sections.append(word_p("2. CHI TIẾT", bold=True))

    for idx, sprint in enumerate(sprints, start=1):
        sections.append(word_p(f"2.{idx}. Các chức năng kiểm thử trong {sprint.sprint_name}", bold=True))
        for module in sprint.modules:
            sections.append(word_p(f"- {module.module_name}"))

    sections.append(word_p("2.4. Các chức năng không được kiểm thử", bold=True))
    sections.append(word_p("- Tất cả các chức năng trong Sprint 1, Sprint 2 và Sprint 3 đều được kiểm thử."))
    sections.append(word_p("2.5. Các tài liệu", bold=True))
    sections.append(word_p("- Test plan document."))
    sections.append(word_p("- Test case document."))
    sections.append(word_p("2.6. Lịch trình kiểm thử", bold=True))

    for idx, sprint in enumerate(sprints, start=1):
        sections.append(word_p(f"2.6.{idx}. {sprint.sprint_name}", bold=True))
        table_rows = [["STT", "Tên", "Ngày bắt đầu", "Ngày kết thúc", "Thời gian (giờ)", "Tên thành viên"]]
        table_rows.extend(sprint_phase_rows(idx, sprint))
        sections.append(word_table(table_rows))

    document_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" '
        'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" '
        'xmlns:o="urn:schemas-microsoft-com:office:office" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" '
        'xmlns:v="urn:schemas-microsoft-com:vml" '
        'xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" '
        'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
        'xmlns:w10="urn:schemas-microsoft-com:office:word" '
        'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
        'xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" '
        'xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" '
        'xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" '
        'xmlns:wne="http://schemas.microsoft.com/office/2006/wordml" '
        'xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" '
        'mc:Ignorable="w14 wp14">'
        "<w:body>"
        f"{''.join(sections)}"
        "<w:sectPr><w:pgSz w:w=\"11906\" w:h=\"16838\"/><w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" w:left=\"1440\" w:header=\"708\" w:footer=\"708\" w:gutter=\"0\"/></w:sectPr>"
        "</w:body></w:document>"
    )

    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"""
    root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""
    now = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    core_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:dcmitype="http://purl.org/dc/dcmitype/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Test Plan 3 Sprint</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>
</cp:coreProperties>
"""
    app_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Word</Application>
</Properties>
"""

    target.parent.mkdir(parents=True, exist_ok=True)
    try:
        zf = zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED)
    except PermissionError:
        target = target.with_name(f"{target.stem}_Updated{target.suffix}")
        zf = zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED)

    with zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", root_rels)
        zf.writestr("word/document.xml", document_xml)
        zf.writestr("docProps/core.xml", core_xml)
        zf.writestr("docProps/app.xml", app_xml)


def main():
    sprints = vi_sprints()
    for sprint in sprints:
        write_workbook(sprint)

    build_test_plan_docx(
        sprints,
        Path(__file__).resolve().parents[1] / "docs" / "testcases" / "Sprint_Test_Plan_Vietnamese.docx",
    )


if __name__ == "__main__":
    main()

from __future__ import annotations

from collections import Counter
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape
import zipfile


ASSIGNMENTS = [
    {
        "page": "Trang chủ Landing Page",
        "route": "/",
        "functions": "Hiển thị thương hiệu SmartTravel; tìm kiếm nhanh; điều hướng đăng nhập/đăng ký; mở chatbot; giới thiệu tính năng và tour nổi bật",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Trang đăng ký provider",
        "route": "/apply-provider",
        "functions": "Nhập hồ sơ đối tác; upload file minh chứng; gửi đơn đăng ký; xem trạng thái chờ duyệt",
        "difficulty": "Trung bình",
        "owner": "Ngọc",
    },
    {
        "page": "Trang đăng nhập traveler",
        "route": "/login",
        "functions": "Đăng nhập email/mật khẩu; remember me; điều hướng quên mật khẩu; đăng nhập Google; xử lý lỗi xác thực",
        "difficulty": "Trung bình",
        "owner": "Tính",
    },
    {
        "page": "Trang đăng ký tài khoản",
        "route": "/signup",
        "functions": "Nhập thông tin đăng ký; kiểm tra validate; đăng ký bằng email; đăng ký Google; điều hướng xác thực OTP",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Trang xác thực email OTP",
        "route": "/verify-email-otp",
        "functions": "Nhập OTP xác thực; resend OTP; xử lý OTP sai/hết hạn; xác nhận tài khoản",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Trang quên mật khẩu",
        "route": "/forgot-password",
        "functions": "Nhập email lấy lại mật khẩu; validate email; gửi OTP hoặc mail reset; quay lại đăng nhập",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang xác thực OTP đặt lại mật khẩu",
        "route": "/forgot-password/verify-otp",
        "functions": "Nhập OTP reset; resend OTP; xác thực OTP đúng/sai/hết hạn; chuyển sang trang đổi mật khẩu",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang đặt lại mật khẩu",
        "route": "/reset-password",
        "functions": "Nhập mật khẩu mới; xác nhận mật khẩu; kiểm tra token hợp lệ; lưu mật khẩu mới",
        "difficulty": "Trung bình",
        "owner": "Thành",
    },
    {
        "page": "Trang đăng nhập provider/admin",
        "route": "/provider-login, /admin-login",
        "functions": "Đăng nhập cho provider và admin; hiển thị lỗi sai tài khoản; phân quyền điều hướng đúng dashboard",
        "difficulty": "Trung bình",
        "owner": "Thành",
    },
    {
        "page": "Trang đăng nhập guide",
        "route": "/guide-staff-login",
        "functions": "Đăng nhập guide; hiện/ẩn mật khẩu; hiển thị thông báo lỗi; đọc notice và footer hướng dẫn",
        "difficulty": "Trung bình",
        "owner": "Ngọc",
    },
    {
        "page": "Trang first join password",
        "route": "/first-join-password",
        "functions": "Đặt mật khẩu lần đầu cho provider/guide; xác nhận mật khẩu; kiểm tra token hoặc phiên hợp lệ",
        "difficulty": "Trung bình",
        "owner": "Thành",
    },
    {
        "page": "Dashboard traveler",
        "route": "/traveler",
        "functions": "Hiển thị thống kê booking; gợi ý tour; trip sắp tới; quick actions; dữ liệu thật từ backend",
        "difficulty": "Trung bình",
        "owner": "Tính",
    },
    {
        "page": "Trang hồ sơ traveler",
        "route": "/traveler/profile",
        "functions": "Xem thông tin cá nhân; chỉnh sửa hồ sơ; hiển thị stats traveler; phần security, preferences, payment",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang tour tracking của traveler",
        "route": "/traveler/tour-tracking",
        "functions": "Xem tiến độ tour; bản đồ Google Map; ngày bắt đầu; timeline hoạt động; trạng thái tracking theo booking",
        "difficulty": "Khó",
        "owner": "Tính",
    },
    {
        "page": "Trang My Booking của traveler",
        "route": "/traveler/my-booking-traveler",
        "functions": "Xem danh sách booking; thanh toán lại; hủy booking; xem trạng thái; mở review khi booking completed",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang quản lý tracking link",
        "route": "/traveler/traveler-tracking-link-management",
        "functions": "Tạo và sao chép tracking link; xem QR; regenerate tracking code; chia sẻ public tracking",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang AI Travel Planner",
        "route": "/traveler/ai-travel-planner",
        "functions": "Nhập yêu cầu chuyến đi; generate itinerary bằng AI; kiểm tra min số lượng; save trip; gửi tour cho provider",
        "difficulty": "Khó",
        "owner": "Tính",
    },
    {
        "page": "Trang AI Tour History",
        "route": "/traveler/ai-tour-history",
        "functions": "Xem lịch sử itinerary AI; mở chi tiết; gửi lại cho provider; duyệt hoặc từ chối proposal; mở tour để booking",
        "difficulty": "Khó",
        "owner": "Thành",
    },
    {
        "page": "Trang review của traveler",
        "route": "/traveler/review",
        "functions": "Đánh giá tour và guide; nhập rating, nội dung; xem summary card; submit review; chặn review trùng",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang danh sách tour công khai",
        "route": "/traveler/tour-list",
        "functions": "Xem tour list; tìm kiếm; lọc và sắp xếp; mở chi tiết tour; ẩn tour private",
        "difficulty": "Trung bình",
        "owner": "Tính",
    },
    {
        "page": "Trang chi tiết tour",
        "route": "/traveler/tour-detail/:tourId",
        "functions": "Xem gallery, itinerary, guide theo schedule; chọn số lượng khách; xác nhận booking; xử lý tour private/proposal",
        "difficulty": "Khó",
        "owner": "Tính",
    },
    {
        "page": "Dashboard admin",
        "route": "/admin",
        "functions": "Xem tổng quan người dùng, provider, booking; activity feed; system health; điều hướng nhanh",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Trang hồ sơ admin",
        "route": "/admin/profile",
        "functions": "Xem hồ sơ admin; activity log; security; overview thông tin cá nhân",
        "difficulty": "Trung bình",
        "owner": "Ngọc",
    },
    {
        "page": "Trang duyệt provider",
        "route": "/admin/provider-approval",
        "functions": "Xem hồ sơ đối tác chờ duyệt; approve/reject; nhập lý do từ chối; cập nhật trạng thái provider",
        "difficulty": "Trung bình",
        "owner": "Ngọc",
    },
    {
        "page": "Trang lịch sử duyệt provider",
        "route": "/admin/provider-approval-history",
        "functions": "Xem lịch sử approve/reject; xem lý do từ chối; xem thời gian xử lý; theo dõi processed providers",
        "difficulty": "Trung bình",
        "owner": "Ngọc",
    },
    {
        "page": "Trang quản lý người dùng",
        "route": "/admin/users",
        "functions": "Xem danh sách user; lọc role; tìm kiếm; theo dõi trạng thái tài khoản; quản trị người dùng",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Trang Admin Analytics",
        "route": "/admin/analytics",
        "functions": "Hiển thị KPI, charts, bảng phân tích tĩnh; chia component theo props; responsive analytics",
        "difficulty": "Khó",
        "owner": "Tính",
    },
    {
        "page": "Dashboard provider",
        "route": "/provider",
        "functions": "Xem doanh thu, bookings, AI requests, recent activity; tổng quan vận hành của provider",
        "difficulty": "Trung bình",
        "owner": "Ngọc",
    },
    {
        "page": "Trang Manage Tours",
        "route": "/provider/manage-tours",
        "functions": "Tạo, sửa, xóa tour; hiển thị booking status; ẩn tour private; điều hướng sang schedule",
        "difficulty": "Khó",
        "owner": "Tính",
    },
    {
        "page": "Trang Tour Schedule",
        "route": "/provider/tours/:id/schedule",
        "functions": "Tạo lịch khởi hành; khóa ngày quá khứ; chọn guide khả dụng; kiểm tra trùng lịch; private schedule",
        "difficulty": "Khó",
        "owner": "Thành",
    },
    {
        "page": "Trang Edit Tour",
        "route": "/provider/edit-tour",
        "functions": "Chỉnh sửa thông tin tour; cập nhật itinerary; tối ưu nội dung hiển thị tour; lưu thay đổi",
        "difficulty": "Trung bình",
        "owner": "Ngọc",
    },
    {
        "page": "Trang Guide Management của provider",
        "route": "/provider/guide-management",
        "functions": "Tạo, sửa, xóa guide; bật/tắt trạng thái; kiểm tra guide khả dụng cho tour và schedule",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang Booking Management của provider",
        "route": "/provider/bookings-management",
        "functions": "Xem booking theo tour; hiển thị status theo booking/payment; filter trạng thái; xem guide và payment",
        "difficulty": "Khó",
        "owner": "Tính",
    },
    {
        "page": "Trang Provider Analytics",
        "route": "/provider/analytics",
        "functions": "Hiển thị KPI, charts, bảng phân tích tĩnh cho provider; chia component; responsive analytics",
        "difficulty": "Khó",
        "owner": "Ngọc",
    },
    {
        "page": "Trang quản lý review của provider",
        "route": "/provider/reviews",
        "functions": "Xem review liên quan tour; lọc đánh giá; theo dõi chất lượng tour và guide",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang AI Tour Request Detail",
        "route": "/provider/ai-tour-requests/:id",
        "functions": "Nhận request AI; giữ request 10 phút; tạo service thiếu; match service tương đương; tạo proposal tour",
        "difficulty": "Khó",
        "owner": "Thành",
    },
    {
        "page": "Trang Service Management",
        "route": "/provider/service-management",
        "functions": "Tạo, sửa, xóa service; upload ảnh; quản lý alias; giá người lớn/trẻ em/em bé; filter service",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Trang hồ sơ provider",
        "route": "/provider/profile",
        "functions": "Xem thông tin công ty; bảo mật; payout; thông tin liên hệ; dữ liệu profile provider",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Dashboard guide",
        "route": "/guide",
        "functions": "Xem summary card guide; quick actions; assigned tours; dữ liệu dashboard guide",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Trang hồ sơ guide",
        "route": "/guide/profile",
        "functions": "Xem profile guide; average rating; languages; expertise; certifications; security",
        "difficulty": "Trung bình",
        "owner": "Trí",
    },
    {
        "page": "Trang tour được phân công",
        "route": "/guide/assigned-tours",
        "functions": "Xem danh sách tour được phân công; thông tin lịch đi; số khách; điều hướng live tracking",
        "difficulty": "Trung bình",
        "owner": "Bảo",
    },
    {
        "page": "Trang Guide Live Tour Tracking",
        "route": "/guide/live-tour-tracking",
        "functions": "Start điểm dừng; mark done; cập nhật timeline; đồng bộ sang traveler/public tracking; hoàn tất tour",
        "difficulty": "Khó",
        "owner": "Thành",
    },
    {
        "page": "Trang Public Tour Tracking",
        "route": "/guest",
        "functions": "Theo dõi tour bằng tracking code không cần đăng nhập; xem map, timeline, latest update; xử lý code hết hạn",
        "difficulty": "Khó",
        "owner": "Thành",
    },
    {
        "page": "Trang Booking Success và Tracking Link",
        "route": "/guest/booking-success-and-tracking-link",
        "functions": "Hiển thị xác nhận thanh toán; chi tiết booking; QR/link chia sẻ; điều hướng public tracking",
        "difficulty": "Khó",
        "owner": "Thành",
    },
]


def word_p(text: str, bold: bool = False) -> str:
    if not text:
        return "<w:p/>"
    run_props = "<w:rPr><w:b/></w:rPr>" if bold else ""
    return (
        "<w:p>"
        f"<w:r>{run_props}<w:t xml:space=\"preserve\">{escape(text)}</w:t></w:r>"
        "</w:p>"
    )


def word_table(rows):
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
    xml_rows = []
    for i, row in enumerate(rows):
        cells = []
        for cell in row:
            content = escape(str(cell))
            if i == 0:
                p = (
                    "<w:p><w:r><w:rPr><w:b/></w:rPr>"
                    f"<w:t xml:space=\"preserve\">{content}</w:t></w:r></w:p>"
                )
            else:
                p = f"<w:p><w:r><w:t xml:space=\"preserve\">{content}</w:t></w:r></w:p>"
            cells.append(f"<w:tc><w:tcPr/>{p}</w:tc>")
        xml_rows.append(f"<w:tr>{''.join(cells)}</w:tr>")
    return f"<w:tbl><w:tblPr>{borders}</w:tblPr>{''.join(xml_rows)}</w:tbl>"


def build_docx(target: Path):
    counts = Counter(item["owner"] for item in ASSIGNMENTS)

    body = [
        word_p("PHÂN CÔNG CHỨC NĂNG THEO TỪNG PAGE CHO NHÓM SMARTTRAVEL", bold=True),
        word_p("1. NGUYÊN TẮC PHÂN CÔNG", bold=True),
        word_p("- Phân công theo từng page có trong hệ thống hiện tại."),
        word_p("- Chia tương đối đều cho 5 thành viên: Tính, Thành, Bảo, Trí, Ngọc."),
        word_p("- Các page khó được ưu tiên giao cho Tính và Thành."),
        word_p("- Mỗi page ghi kèm các chức năng chính cần phụ trách phân tích, test hoặc triển khai."),
        word_p("2. TỔNG QUAN KHỐI LƯỢNG", bold=True),
    ]

    for name in ["Tính", "Thành", "Bảo", "Trí", "Ngọc"]:
        body.append(word_p(f"- {name}: {counts[name]} page"))

    body.append(word_p("3. BẢNG PHÂN CÔNG CHI TIẾT", bold=True))

    detail_rows = [[
        "STT",
        "Page",
        "Route",
        "Chức năng chính",
        "Độ khó",
        "Thành viên phụ trách",
    ]]
    for idx, item in enumerate(ASSIGNMENTS, start=1):
        detail_rows.append([
            str(idx),
            item["page"],
            item["route"],
            item["functions"],
            item["difficulty"],
            item["owner"],
        ])
    body.append(word_table(detail_rows))

    body.append(word_p("4. GỢI Ý PHỐI HỢP", bold=True))
    body.append(word_p("- Tính và Thành nên review chéo các page khó liên quan AI, booking, tracking, schedule trước khi chốt."))
    body.append(word_p("- Bảo, Trí, Ngọc có thể hỗ trợ retest chéo cho các page vừa và nhỏ sau khi hoàn tất phần chính."))

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
        f"{''.join(body)}"
        "<w:sectPr><w:pgSz w:w=\"11906\" w:h=\"16838\"/><w:pgMar w:top=\"1440\" w:right=\"1200\" w:bottom=\"1440\" w:left=\"1200\" w:header=\"708\" w:footer=\"708\" w:gutter=\"0\"/></w:sectPr>"
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
  <dc:title>Phan cong page cho nhom SmartTravel</dc:title>
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
    with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", root_rels)
        zf.writestr("word/document.xml", document_xml)
        zf.writestr("docProps/core.xml", core_xml)
        zf.writestr("docProps/app.xml", app_xml)


def main():
    target = Path(__file__).resolve().parents[1] / "docs" / "testcases" / "Phan_Cong_Page_SmartTravel.docx"
    build_docx(target)
    print(f"Created {target}")


if __name__ == "__main__":
    main()

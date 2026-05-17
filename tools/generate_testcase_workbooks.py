from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from xml.sax.saxutils import escape
import zipfile


PROJECT_NAME = "VOYAGER AI TRAVEL PLATFORM"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "docs" / "testcases"


@dataclass
class TestCase:
    description: str
    action: str
    precondition: str
    expected: str
    round1_status: str = "Passed"
    round2_status: Optional[str] = None
    note: str = ""
    kind: str = "FUNC"


@dataclass
class ModulePlan:
    sheet_name: str
    module_code: str
    module_name: str
    tester: str
    difficulty: str
    cases: List[TestCase]
    gui_cases: Optional[List[TestCase]] = None


@dataclass
class SprintPlan:
    sprint_name: str
    file_name: str
    implementation_window: str
    round1_dates: List[str]
    round2_dates: List[str]
    modules: List[ModulePlan]


def tc(description, action, precondition, expected, round1="Passed", round2=None, note=""):
    return TestCase(description, action, precondition, expected, round1, round2, note, "FUNC")


def gui(description, action, precondition, expected, note=""):
    return TestCase(description, action, precondition, expected, "Passed", None, note, "GUI")


PAGE_CONTEXT = {
    "AUTH_ACCESS": ("Khách hoặc Traveler", "/login, /signup, /forgot-password"),
    "PROFILE_PERMISSION": ("Người dùng đã đăng nhập", "/traveler/profile, /provider/profile, /guide/profile, /admin/profile"),
    "PROVIDER_APPROVAL": ("Admin hoặc Guest đăng ký provider", "/apply-provider, /admin/provider-approval"),
    "SERVICE_MANAGEMENT": ("Provider", "/provider/service-management"),
    "GUIDE_MANAGEMENT": ("Provider hoặc Guide", "/provider/guide-management, /guide/profile"),
    "TOUR_MANAGEMENT": ("Provider", "/provider/manage-tours, /provider/edit-tour"),
    "SCHEDULE_GUIDE_ASSIGN": ("Provider", "/provider/tours/:id/schedule"),
    "BOOKING_PAYMENT": ("Traveler hoặc Guest", "/traveler/tour-detail/:tourId, /guest/booking-success-and-tracking-link"),
    "AI_TRAVEL_PLANNER": ("Traveler", "/traveler/ai-travel-planner, /traveler/ai-tour-history"),
    "TOUR_CATALOG_DETAIL": ("Traveler", "/traveler/tour-list, /traveler/tour-detail/:tourId"),
    "DASHBOARD_PROFILE": ("Traveler, Provider, Guide, Admin", "các dashboard và profile theo role"),
    "PROVIDER_BOOKING_VIEW": ("Provider", "/provider/bookings-management"),
    "AI_REQUEST_PROVIDER": ("Provider", "/provider/ai-tour-requests/:id"),
    "PROPOSAL_APPROVAL_FLOW": ("Traveler", "/traveler/ai-tour-history, /traveler/tour-detail/:tourId"),
    "TRACKING_ECOSYSTEM": ("Traveler hoặc Guest", "/traveler/tour-tracking, /guest"),
    "GUIDE_LIVE_TRACKING": ("Guide", "/guide/live-tour-tracking"),
    "REVIEW_ANALYTICS": ("Traveler, Provider, Admin", "/traveler/review, /provider/analytics, /admin/analytics"),
    "HEADER_NOTIFICATION_SEARCH": ("Mọi role phù hợp", "header, bell notification, avatar menu, search"),
    "BOOKING_SUCCESS_QR": ("Guest hoặc Traveler", "/guest/booking-success-and-tracking-link"),
}


GUI_FOCUS = {
    "AUTH_ACCESS": "textbox email, password, OTP input, remember me, forgot password link và nút submit",
    "PROFILE_PERMISSION": "avatar header, thông tin profile, form edit, security tab và toast route protection",
    "PROVIDER_APPROVAL": "form đăng ký provider, upload file, card pending, nút approve/reject và trạng thái hồ sơ",
    "SERVICE_MANAGEMENT": "service card, filter, dialog create/edit/delete, upload ảnh và badge loại service",
    "GUIDE_MANAGEMENT": "bảng guide, dialog create/edit, button active/inactive, login form guide và profile card",
    "TOUR_MANAGEMENT": "hero manage tours, stats, table danh sách, dialog create/edit tour và preview itinerary",
    "SCHEDULE_GUIDE_ASSIGN": "bảng schedule, calendar date picker, select guide, private switch và trạng thái slot",
    "BOOKING_PAYMENT": "panel traveler count, booking summary, nút confirm/pay/cancel, trạng thái thanh toán và toast",
    "AI_TRAVEL_PLANNER": "sidebar planner, form quantity/budget, itinerary result, save/send actions và lịch sử AI",
    "TOUR_CATALOG_DETAIL": "tour cards, search/filter/sort controls, gallery ảnh, guide card và booking widget",
    "DASHBOARD_PROFILE": "summary cards, chart/widget, section dữ liệu gần đây, profile cards và action button",
    "PROVIDER_BOOKING_VIEW": "booking table, filter tabs, status badge, action buttons và cột guide/payment",
    "AI_REQUEST_PROVIDER": "notification bell, request detail card, required services list, match actions và countdown",
    "PROPOSAL_APPROVAL_FLOW": "history list, proposal detail panel, approve/reject buttons và trạng thái private",
    "TRACKING_ECOSYSTEM": "tracking sidebar, timeline, map, tracking link card, QR/link actions và expired message",
    "GUIDE_LIVE_TRACKING": "timeline step card, start/mark done buttons, status badge, footer action và map section",
    "REVIEW_ANALYTICS": "rating cards, review form, analytics cards, chart static data và trạng thái review button",
    "HEADER_NOTIFICATION_SEARCH": "bell badge, dropdown thông báo, search bar, avatar menu, breadcrumb và logout",
    "BOOKING_SUCCESS_QR": "confirmation card, booking detail card, tracking link, QR block và button copy/open",
}


def build_generic_gui_cases(module: ModulePlan) -> List[TestCase]:
    role, route = PAGE_CONTEXT.get(module.module_code, ("Người dùng phù hợp", "route tương ứng của module"))
    focus = GUI_FOCUS.get(module.module_code, "header, form, table, card, button và trạng thái hiển thị")
    return [
        gui(
            f"Hiển thị trang {module.module_name}",
            f"1. Đăng nhập bằng role phù hợp\n2. Truy cập {route}",
            f"{role} đã có quyền truy cập module",
            f"Trang tải thành công, không trắng trang và tiêu đề/section chính của {module.module_name} hiển thị đúng",
        ),
        gui(
            f"Kiểm tra bố cục và điều khiển chính của {module.module_name}",
            f"1. Mở trang {module.module_name}\n2. Quan sát và thao tác nhẹ các control chính",
            f"{role} đã mở được module",
            f"Giao diện hiển thị đầy đủ {focus}; các control enable/disable đúng ngữ cảnh",
        ),
        gui(
            f"Kiểm tra format dữ liệu trên giao diện {module.module_name}",
            f"1. Tải dữ liệu thật hoặc mock của module\n2. Quan sát text, ngày, giá, badge",
            f"Module có dữ liệu mẫu để hiển thị",
            "Text không tràn ô, ngày giờ đúng định dạng, giá tiền có phân tách hợp lý và badge/trạng thái hiển thị thống nhất",
        ),
        gui(
            f"Kiểm tra trạng thái loading, empty và error của {module.module_name}",
            f"1. Tải lại trang\n2. Giả lập trạng thái chưa có dữ liệu hoặc lỗi API",
            f"Module có skeleton hoặc empty state",
            "Skeleton/empty state/toast lỗi hiển thị rõ ràng và không làm vỡ layout trang",
        ),
        gui(
            f"Kiểm tra responsive cơ bản của {module.module_name}",
            f"1. Thu nhỏ viewport\n2. Mở lại module\n3. Kiểm tra các khối chính",
            f"{role} có thể truy cập module ở giao diện desktop/mobile",
            "Các card, bảng, form và nút thao tác không chồng lấp; vẫn có thể thao tác được ở kích thước nhỏ",
        ),
    ]


SPRINTS: List[SprintPlan] = [
    SprintPlan(
        sprint_name="Sprint 1",
        file_name="Sprint_1_Test_Cases.xlsx",
        implementation_window="12/03/2026 - 25/03/2026",
        round1_dates=["26/03/2026", "27/03/2026", "28/03/2026"],
        round2_dates=["30/03/2026", "31/03/2026"],
        modules=[
            ModulePlan(
                "S1_AUTH",
                "AUTH_ACCESS",
                "Đăng ký, xác thực và đăng nhập",
                "Tính",
                "Khó",
                [
                    tc("Đăng ký traveler với email hợp lệ", "1. Mở trang đăng ký\n2. Nhập đủ thông tin hợp lệ\n3. Bấm Register", "Người dùng chưa có tài khoản", "Tạo tài khoản thành công và gửi email xác thực"),
                    tc("Xác thực email bằng liên kết hợp lệ", "1. Mở email xác thực\n2. Bấm Verify", "Tài khoản đã đăng ký và chưa xác thực", "Tài khoản chuyển sang trạng thái đã xác thực"),
                    tc("Đăng nhập đúng email/mật khẩu", "1. Mở trang login\n2. Nhập thông tin đúng\n3. Bấm Sign in", "Tài khoản đã xác thực", "Đăng nhập thành công và điều hướng đúng dashboard"),
                    tc("Đăng nhập sai mật khẩu", "1. Nhập email đúng\n2. Nhập mật khẩu sai\n3. Bấm Sign in", "Tài khoản tồn tại", "Hiển thị thông báo sai email hoặc mật khẩu", "Failed", "Passed", "Round 2 kiểm tra lại sau khi sửa thông báo lỗi login"),
                    tc("Quên mật khẩu gửi mail thành công", "1. Mở Forgot password\n2. Nhập email hợp lệ\n3. Gửi yêu cầu", "Tài khoản tồn tại", "Hệ thống gửi mail đặt lại mật khẩu"),
                    tc("Đổi mật khẩu bằng token hợp lệ", "1. Mở link reset\n2. Nhập mật khẩu mới hợp lệ\n3. Xác nhận", "Người dùng có token reset còn hiệu lực", "Đổi mật khẩu thành công và đăng nhập lại được"),
                ],
            ),
            ModulePlan(
                "S1_PROFILE",
                "PROFILE_PERMISSION",
                "Hồ sơ cá nhân và phân quyền route",
                "Bảo",
                "Trung bình",
                [
                    tc("Traveler mở đúng trang profile của mình", "1. Đăng nhập traveler\n2. Bấm avatar header\n3. Chọn Profile", "Traveler đã đăng nhập", "Điều hướng tới profile traveler và tải đúng dữ liệu"),
                    tc("Provider mở đúng trang profile của mình", "1. Đăng nhập provider\n2. Mở Profile từ avatar", "Provider đã đăng nhập", "Hiển thị profile provider đúng dữ liệu backend"),
                    tc("Cập nhật thông tin hồ sơ cơ bản", "1. Mở profile\n2. Sửa tên, số điện thoại\n3. Lưu", "Người dùng đã đăng nhập", "Lưu thành công và hiển thị dữ liệu mới"),
                    tc("Protected route chặn khi chưa đăng nhập", "1. Truy cập thẳng URL protected", "Không có token đăng nhập", "Bị chuyển tới login và có thông báo"),
                    tc("Protected route chặn sai role", "1. Đăng nhập traveler\n2. Truy cập URL admin", "Traveler đã đăng nhập", "Hiển thị thông báo không có quyền và điều hướng an toàn"),
                    tc("Nút profile không còn hiển thị trùng ở sidebar", "1. Mở dashboard từng role\n2. Kiểm tra sidebar", "Đã đăng nhập", "Sidebar không còn mục Profile trùng với avatar header"),
                ],
            ),
            ModulePlan(
                "S1_PROVIDER_APV",
                "PROVIDER_APPROVAL",
                "Đăng ký provider và duyệt hồ sơ",
                "Thành",
                "Khó",
                [
                    tc("Traveler gửi hồ sơ đăng ký provider", "1. Mở form đăng ký provider\n2. Nhập thông tin + file minh chứng\n3. Gửi", "Người dùng đã đăng nhập", "Tạo hồ sơ chờ duyệt thành công"),
                    tc("Admin xem danh sách provider pending", "1. Đăng nhập admin\n2. Mở Provider Approval", "Có ít nhất 1 hồ sơ chờ duyệt", "Hiển thị đúng danh sách hồ sơ pending"),
                    tc("Admin duyệt hồ sơ provider", "1. Chọn hồ sơ pending\n2. Bấm Approve", "Admin đang ở trang duyệt", "Hồ sơ chuyển Approved và provider được phép đăng nhập"),
                    tc("Admin từ chối hồ sơ provider", "1. Chọn hồ sơ pending\n2. Bấm Reject\n3. Nhập lý do", "Admin đang ở trang duyệt", "Hồ sơ chuyển Rejected và lưu lý do từ chối"),
                    tc("Provider chưa duyệt không được đăng nhập role provider", "1. Dùng tài khoản chưa duyệt để login provider", "Tài khoản provider đang pending", "Đăng nhập bị chặn và thông báo đúng", "Failed", "Passed", "Kiểm tra lại sau khi sửa validate accountStatus"),
                    tc("Lịch sử duyệt provider hiển thị đúng trạng thái", "1. Mở Provider Approval History", "Đã có hồ sơ approve / reject", "Hiển thị đúng trạng thái và thời gian xử lý"),
                ],
            ),
            ModulePlan(
                "S1_SERVICE",
                "SERVICE_MANAGEMENT",
                "Quản lý service của provider",
                "Ngọc",
                "Trung bình",
                [
                    tc("Tạo service với giá người lớn/trẻ em/em bé", "1. Mở Service Management\n2. Nhập form service\n3. Lưu", "Provider đã đăng nhập", "Tạo service thành công và hiển thị trong bảng"),
                    tc("Chuẩn hóa alias khi tạo service", "1. Tạo service có nhiều alias cách nhau bằng dấu phẩy", "Provider đã đăng nhập", "Alias được lưu dạng danh sách đã trim và loại trùng"),
                    tc("Chỉnh sửa thông tin service", "1. Mở dialog edit\n2. Sửa mô tả / địa chỉ / giá\n3. Lưu", "Service đã tồn tại", "Cập nhật thành công"),
                    tc("Upload ảnh cho service", "1. Chọn Upload image\n2. Tải tệp hợp lệ", "Service đã tồn tại", "Ảnh được lưu và render đúng"),
                    tc("Xóa service không còn dùng", "1. Chọn Delete service\n2. Xác nhận", "Service tồn tại", "Service bị xóa khỏi danh sách"),
                    tc("Chỉ provider sở hữu mới sửa được service", "1. Dùng provider khác gọi API edit service", "Có service của provider A", "API trả forbidden / not found an toàn"),
                ],
            ),
            ModulePlan(
                "S1_GUIDE",
                "GUIDE_MANAGEMENT",
                "Quản lý hướng dẫn viên",
                "Trí",
                "Trung bình",
                [
                    tc("Tạo mới tài khoản guide", "1. Mở Guide Management\n2. Nhập thông tin guide\n3. Lưu", "Provider đã đăng nhập", "Guide được tạo thành công"),
                    tc("Guide login đúng thông tin", "1. Mở guide login\n2. Nhập email / mật khẩu đúng", "Guide đã được tạo", "Đăng nhập thành công"),
                    tc("Guide login sai thông tin hiển thị lỗi đúng", "1. Nhập sai email hoặc mật khẩu\n2. Login", "Guide login page sẵn sàng", "Hiển thị thông báo sai email hoặc mật khẩu"),
                    tc("Cập nhật thông tin guide", "1. Edit guide\n2. Sửa phone / specialty\n3. Lưu", "Guide tồn tại", "Dữ liệu guide cập nhật đúng"),
                    tc("Ẩn guide không còn hoạt động", "1. Chuyển guide sang inactive", "Guide tồn tại", "Guide không còn hiện ở danh sách chọn lịch khởi hành"),
                    tc("Guide profile tải đúng số liệu cơ bản", "1. Đăng nhập guide\n2. Mở profile", "Guide có dữ liệu demo", "Hiển thị đúng average rating / total tours / languages"),
                ],
            ),
        ],
    ),
    SprintPlan(
        sprint_name="Sprint 2",
        file_name="Sprint_2_Test_Cases.xlsx",
        implementation_window="26/03/2026 - 17/04/2026",
        round1_dates=["18/04/2026", "19/04/2026", "20/04/2026", "21/04/2026"],
        round2_dates=["22/04/2026", "23/04/2026", "24/04/2026"],
        modules=[
            ModulePlan(
                "S2_TOUR",
                "TOUR_MANAGEMENT",
                "Tạo, sửa, xóa tour",
                "Tính",
                "Khó",
                [
                    tc("Tạo tour công khai với itinerary hợp lệ", "1. Mở Create Tour\n2. Nhập đầy đủ thông tin\n3. Lưu", "Provider đã đăng nhập", "Tạo tour thành công"),
                    tc("Sửa tour và cập nhật itinerary", "1. Mở Edit Tour\n2. Thay đổi lịch trình\n3. Lưu", "Tour đã tồn tại", "Tour cập nhật thành công"),
                    tc("Không còn lưu leadGuide ở Tour model", "1. Tạo/sửa tour\n2. Kiểm tra payload", "Đã mở DevTools hoặc log API", "Payload tour không chứa leadGuideServiceId"),
                    tc("Tạo tour từ AI request sẽ có type private", "1. Convert AI request hợp lệ", "AI request đã sẵn sàng", "Tour mới tạo có type = PRIVATE"),
                    tc("Tour target traveler only không hiện trong danh sách public", "1. Mở Tour List công khai", "Có tour tạo từ AI request", "Tour riêng không hiển thị ở list public"),
                    tc("Xóa tour đã tạo", "1. Chọn delete tour\n2. Xác nhận", "Tour không bị ràng buộc dữ liệu khác", "Tour bị xóa thành công"),
                ],
            ),
            ModulePlan(
                "S2_SCHEDULE",
                "SCHEDULE_GUIDE_ASSIGN",
                "Lịch khởi hành và gán guide",
                "Thành",
                "Khó",
                [
                    tc("Tạo schedule với ngày tương lai", "1. Mở Add Schedule\n2. Chọn ngày tương lai\n3. Lưu", "Tour đã tồn tại", "Schedule được tạo thành công"),
                    tc("Không cho chọn ngày quá khứ", "1. Chọn ngày nhỏ hơn hôm nay", "Mở dialog schedule", "Hiển thị lỗi ngày khởi hành không hợp lệ"),
                    tc("Guide bận tour khác không được hiện để chọn", "1. Mở chọn guide trên ngày trùng", "Guide đã có tour khác trong cùng khoảng thời gian", "Guide không xuất hiện trong danh sách khả dụng"),
                    tc("Không cho trùng guide ở 2 schedule cùng tour", "1. Tạo schedule thứ hai cùng guide", "Tour đã có 1 schedule với guide đó", "API chặn với message rõ ràng", "Failed", "Passed", "Retest sau khi sửa xung đột guide trong cùng tour"),
                    tc("Tour proposal private sẽ khóa switch private schedule", "1. Mở create schedule của tour target traveler", "Tour là AI proposal", "Switch private bị khóa và lưu luôn isPrivate=true"),
                    tc("Tự prefill ngày từ traveler khi vào trang schedule từ AI request", "1. Convert AI request\n2. Theo dõi dialog create schedule", "AI request có startDay", "Ngày khởi hành được điền sẵn theo startDay của traveler"),
                ],
            ),
            ModulePlan(
                "S2_BOOKING",
                "BOOKING_PAYMENT",
                "Booking tour và thanh toán PayOS",
                "Tính",
                "Khó",
                [
                    tc("Tạo booking group với schedule còn chỗ", "1. Chọn tour group\n2. Chọn schedule\n3. Confirm Booking", "Tour công khai có schedule còn chỗ", "Tạo booking và sinh link thanh toán thành công"),
                    tc("Tạo booking private cho tour proposal", "1. Mở tour proposal approved\n2. Confirm Booking", "Traveler là chủ sở hữu tour đề xuất", "Booking được tạo với isPrivate=true"),
                    tc("Hóa đơn chưa thanh toán quá 5 phút tự hủy", "1. Tạo booking\n2. Không thanh toán trong 5 phút", "Booking vừa tạo", "Booking chuyển CANCELLED và không giữ slot"),
                    tc("Chỉ booking PAID mới hiện ở My Booking", "1. Tạo booking rồi hủy / để timeout", "Traveler có booking unpaid", "Booking unpaid không xuất hiện trong My Booking"),
                    tc("Thanh toán thành công chỉ cộng tiền một lần", "1. Tạo booking cho 2 người\n2. Thanh toán PayOS thành công", "PayOS callback hoạt động", "Số tiền/slot không bị nhân đôi"),
                    tc("Guest booking success hiển thị đúng orderCode", "1. Thanh toán thành công\n2. Mở booking success", "Booking đã PAID", "Trang success hiển thị đúng tour, guide, tracking"),
                ],
            ),
            ModulePlan(
                "S2_AI_PLAN",
                "AI_TRAVEL_PLANNER",
                "AI Travel Planner core flow",
                "Thành",
                "Khó",
                [
                    tc("Generate itinerary trả JSON hợp lệ", "1. Nhập dữ liệu planner\n2. Bấm Generate", "Traveler đã đăng nhập", "Nhận JSON hợp lệ và render được"),
                    tc("Min adult + child phải >= 5", "1. Nhập số lượng dưới 5 người lớn/trẻ em\n2. Generate", "Mở planner", "Toast tiếng Việt cảnh báo tổng tối thiểu 5 người"),
                    tc("Save Trip lưu được vào AI Tour History", "1. Generate itinerary\n2. Bấm Save Trip", "Itinerary vừa generate", "Tạo history item thành công"),
                    tc("Send to Providers publish thành công", "1. Chọn trip đã save\n2. Bấm Send to Providers", "History item đang DRAFT", "History item chuyển PUBLISHED"),
                    tc("AI Tour History tải đúng detail và proposal", "1. Mở AI Tour History\n2. Chọn từng item", "Traveler có dữ liệu history", "Chi tiết render đúng và load proposal nếu có"),
                    tc("Tên địa điểm trong service đủ cụ thể", "1. Generate tour với destination phổ biến", "Prompt AI đang hoạt động", "Tên service không dùng generic name kiểu local hotel / city tour"),
                ],
            ),
            ModulePlan(
                "S2_CATALOG",
                "TOUR_CATALOG_DETAIL",
                "Tour list, tìm kiếm và tour detail",
                "Bảo",
                "Trung bình",
                [
                    tc("Danh sách tour public hiển thị đúng", "1. Mở Tour List", "Có dữ liệu tour public", "Chỉ tour public approved hiển thị"),
                    tc("Search tour theo location/name", "1. Nhập từ khóa tìm kiếm", "Tour list đã load", "Danh sách lọc đúng theo từ khóa"),
                    tc("Sort tour theo popular / rating / price", "1. Chọn từng sort option", "Tour list có nhiều item", "Thứ tự tour thay đổi đúng"),
                    tc("Tour detail tải images + itinerary", "1. Mở 1 tour detail", "Tour tồn tại", "Hiển thị đầy đủ ảnh và lịch trình"),
                    tc("Guide trên tour detail bám theo schedule", "1. Mở tour detail có schedule và guide", "Schedule đã gán guide", "Guide hiển thị đúng theo schedule"),
                    tc("Tour proposal private khóa switch group/private", "1. Mở tour detail proposal approved", "Tour là TARGET_TRAVELER_ONLY", "Switch chỉ hiển thị private và không đổi được"),
                ],
            ),
            ModulePlan(
                "S2_DASH",
                "DASHBOARD_PROFILE",
                "Dashboard và profile role-based",
                "Ngọc",
                "Trung bình",
                [
                    tc("Traveler dashboard lấy dữ liệu thật", "1. Đăng nhập traveler\n2. Mở dashboard", "Traveler có booking/reward data", "Card và danh sách dùng dữ liệu thật"),
                    tc("Provider dashboard hiển thị booking/revenue", "1. Đăng nhập provider\n2. Mở dashboard", "Provider có dữ liệu demo", "Revenue, AI request, booking hiển thị đúng"),
                    tc("Guide dashboard hiển thị assigned tours", "1. Đăng nhập guide", "Guide có tour được phân công", "Summary cards và assigned tours đúng"),
                    tc("Admin dashboard hiển thị user/provider stats", "1. Đăng nhập admin", "Có dữ liệu user/provider", "Cards và activity feed hiển thị đúng"),
                    tc("Traveler profile cards khớp backend", "1. Mở traveler profile", "Traveler có booking/reward data", "Cities visited / upcoming / completed / points đúng"),
                    tc("Guide profile cards khớp review/tour stats", "1. Mở guide profile", "Guide có review data", "Average rating / total tours / languages khớp backend"),
                ],
            ),
            ModulePlan(
                "S2_PRV_BOOK",
                "PROVIDER_BOOKING_VIEW",
                "Provider booking management",
                "Trí",
                "Trung bình",
                [
                    tc("Provider xem được booking thuộc tour của mình", "1. Đăng nhập provider\n2. Mở Bookings Management", "Provider có booking", "Chỉ booking của provider hiện ra"),
                    tc("Status hiển thị theo Booking.status + payment", "1. Mở danh sách booking", "Có booking đủ trạng thái", "Pending payment / Confirmed / Completed hiển thị đúng"),
                    tc("Guide hiển thị theo tourSchedule.leadGuideServiceId", "1. Xem 1 booking có schedule", "Schedule đã gán guide", "Tên guide khớp tour schedule"),
                    tc("Booking private hiển thị đúng badge", "1. Xem booking proposal tour", "Có booking private", "Table hiển thị private đúng"),
                    tc("Filter trạng thái booking hoạt động", "1. Chọn tab filter trạng thái", "Danh sách booking đã load", "Bảng lọc đúng dữ liệu"),
                    tc("Provider không thấy booking unpaid timeout", "1. Tạo booking rồi để quá 5 phút", "Booking chưa thanh toán", "Booking timeout không hiện trong danh sách đang hiệu lực"),
                ],
            ),
        ],
    ),
    SprintPlan(
        sprint_name="Sprint 3",
        file_name="Sprint_3_Test_Cases.xlsx",
        implementation_window="18/04/2026 - 08/05/2026",
        round1_dates=["09/05/2026", "10/05/2026", "11/05/2026", "12/05/2026"],
        round2_dates=["13/05/2026", "14/05/2026", "15/05/2026"],
        modules=[
            ModulePlan(
                "S3_AI_REQ",
                "AI_REQUEST_PROVIDER",
                "AI Tour Request phía provider",
                "Tính",
                "Khó",
                [
                    tc("Thông báo AI request hiển thị ở header provider", "1. Traveler publish AI request\n2. Provider reload header", "Có request PUBLISHED hợp lệ", "Bell badge và dropdown hiển thị đúng"),
                    tc("Request quá 24h tự ẩn khỏi thông báo provider", "1. Tạo request quá hạn 24h", "Có request PUBLISHED cũ", "Request chuyển EXPIRED và không còn ở notification list"),
                    tc("Provider mở request trước sẽ giữ trong 10 phút", "1. Provider A mở request detail", "Request đang PUBLISHED", "Request chuyển CLAIMED cho Provider A"),
                    tc("Provider khác không lấy được request đang bị giữ", "1. Provider B mở cùng request trong lúc A đang giữ", "Request đang CLAIMED bởi A", "API trả lỗi đang được provider khác giữ", "Failed", "Passed", "Retest sau khi sửa so sánh claimedBy đã populate"),
                    tc("Hết 10 phút chưa tạo xong thì request nhả lại", "1. Claim request\n2. Không thao tác cho đến khi hết thời gian", "Request đang CLAIMED", "Request quay về PUBLISHED và hiện lại ở thông báo"),
                    tc("Provider chỉ tạo tour khi đã xử lý đủ service", "1. Vào detail request còn thiếu service\n2. Bấm Create Tour Proposal", "Còn missing / possible services", "Nút bị khóa hoặc API chặn với message rõ ràng"),
                ],
            ),
            ModulePlan(
                "S3_PROP_FLOW",
                "PROPOSAL_APPROVAL_FLOW",
                "Approve/reject proposal và booking riêng",
                "Thành",
                "Khó",
                [
                    tc("Traveler thấy proposal card trong AI Tour History", "1. Provider tạo proposal\n2. Traveler mở AI Tour History", "Request đã PROPOSED", "Hiển thị card proposal và nút xem"),
                    tc("Traveler đồng ý proposal", "1. Bấm Đồng ý tour này", "Request đang PROPOSED", "Request chuyển APPROVED và tour chuyển travelerApprovalStatus APPROVED"),
                    tc("Traveler từ chối proposal", "1. Bấm Từ chối", "Request đang PROPOSED", "Request chuyển REJECTED và tour không booking được"),
                    tc("Proposal quá 2 ngày không xác nhận sẽ tự hủy", "1. Để request PROPOSED quá 2 ngày", "Request có convertedTourId", "Request chuyển EXPIRED với reason PROPOSAL_TIMEOUT"),
                    tc("Tour proposal sau khi approved luôn private", "1. Mở tour detail proposal approved", "Tour là TARGET_TRAVELER_ONLY", "Switch private bị khóa và booking tạo với isPrivate=true"),
                    tc("Số lượng traveler trên tour detail khớp AI request ban đầu", "1. Mở tour detail từ AI History", "Tour sinh từ AI request có quantity", "Adults/children/infants được prefill đúng"),
                ],
            ),
            ModulePlan(
                "S3_TRACKING",
                "TRACKING_ECOSYSTEM",
                "Traveler tracking, public tracking và guest flow",
                "Tính",
                "Khó",
                [
                    tc("Traveler Tracking Management tải đúng booking đang CONFIRMED", "1. Traveler mở trang quản lý tracking", "Có booking CONFIRMED", "Chỉ booking đủ điều kiện tracking hiển thị"),
                    tc("Tour Tracking hiển thị ngày bắt đầu và map", "1. Mở Tour Tracking", "Booking có tracking code hợp lệ", "Hiển thị start date, timeline và Google Map"),
                    tc("Guest Public Tour Tracking không cần đăng nhập", "1. Mở link public tracking ở chế độ guest", "Tracking code hợp lệ", "Xem được dữ liệu công khai mà không cần token"),
                    tc("QR code mở đúng link tracking", "1. Quét QR trên booking success / tracking link", "Có QR hợp lệ", "Mở đúng URL public tracking"),
                    tc("Tracking code hết hiệu lực khi tour COMPLETED", "1. Đánh dấu booking COMPLETED\n2. Mở lại public tracking", "Tour đã hoàn tất", "Tracking trả expired / invalid"),
                    tc("Booking success page giữ được tracking code khi chuyển tab header", "1. Mở booking success\n2. Bấm qua lại tab public tracking", "Tracking code có trên URL", "Code vẫn được giữ để chuyển trang qua lại"),
                ],
            ),
            ModulePlan(
                "S3_GUIDE_LIVE",
                "GUIDE_LIVE_TRACKING",
                "Guide live tour tracking",
                "Thành",
                "Khó",
                [
                    tc("Guide thấy danh sách live tour được phân công", "1. Đăng nhập guide\n2. Mở live tracking", "Guide có booking/tour đang CONFIRMED", "Danh sách live tour hiển thị đúng"),
                    tc("Guide mark done một điểm dừng", "1. Chọn điểm trong timeline\n2. Bấm Mark done", "Timeline đang IN PROGRESS", "Điểm chuyển DONE và lưu thời gian xác nhận"),
                    tc("Traveler/public tracking cập nhật sau khi guide mark done", "1. Guide mark done\n2. F5 trang traveler/public tracking", "Cùng booking tracking", "Điểm tương ứng hiển thị hoàn thành"),
                    tc("Hoàn thành hết điểm sẽ chuyển booking COMPLETED", "1. Mark done toàn bộ hoạt động", "Booking còn hoạt động cuối cùng", "Booking tự chuyển COMPLETED"),
                    tc("Card trạng thái PENDING / COMPLETE được làm mờ", "1. Mở timeline có nhiều trạng thái", "Có item pending / complete", "Card pending / complete có background mờ hơn item in-progress"),
                    tc("Nút Start tạo thay đổi trạng thái đúng", "1. Bấm Start ở điểm hiện tại", "Điểm đang pending", "Trạng thái chuyển IN PROGRESS và các trang tracking phản ánh đúng"),
                ],
            ),
            ModulePlan(
                "S3_REVIEW",
                "REVIEW_ANALYTICS",
                "Review, rating và analytics",
                "Ngọc",
                "Trung bình",
                [
                    tc("Chỉ booking COMPLETED mới hiện nút Review", "1. Mở My Booking", "Có booking CONFIRMED và COMPLETED", "Chỉ booking COMPLETED có nút Review"),
                    tc("Traveler gửi review tour + guide thành công", "1. Mở form review\n2. Nhập rating + nội dung\n3. Submit", "Booking COMPLETED chưa review", "Review được lưu thành công"),
                    tc("Guide rating tổng hợp đúng từ review", "1. Mở guide profile / dashboard", "Có review guide", "Average rating phản ánh đúng ratingGuide"),
                    tc("Admin Analytics hiển thị số liệu tĩnh đúng module", "1. Mở Admin Analytics", "Admin đã đăng nhập", "Trang analytics render đúng component và props"),
                    tc("Provider Analytics hiển thị số liệu tĩnh đúng module", "1. Mở Provider Analytics", "Provider đã đăng nhập", "Trang analytics render đúng component và props"),
                    tc("Sheet/report review không hiển thị booking chưa hoàn tất", "1. Lọc review theo booking", "Có booking chưa completed", "Không cho review hoặc tính rating từ booking chưa hoàn thành"),
                ],
            ),
            ModulePlan(
                "S3_HEADER",
                "HEADER_NOTIFICATION_SEARCH",
                "Header, thông báo và tìm kiếm",
                "Bảo",
                "Trung bình",
                [
                    tc("Header breadcrumb đổi theo route", "1. Điều hướng qua các page role", "Đã đăng nhập", "Title route hiển thị đúng"),
                    tc("Bell badge đếm đúng số AI request đang available", "1. Traveler publish nhiều request\n2. Mở header provider", "Provider ở dashboard", "Badge bằng số request đang PUBLISHED"),
                    tc("Click item trong dropdown mở đúng AI request detail", "1. Bấm 1 item trong dropdown bell", "Có ít nhất 1 item", "Điều hướng đúng trang detail request"),
                    tc("Global search điều hướng theo intent", "1. Gõ từ khóa booking / tracking / planner\n2. Enter", "Header có ô search", "Điều hướng tới module phù hợp"),
                    tc("Avatar dropdown mở đúng profile role", "1. Bấm avatar\n2. Chọn Profile", "Người dùng đã đăng nhập", "Đi tới đúng trang profile role hiện tại"),
                    tc("Logout từ header xóa session", "1. Mở dropdown avatar\n2. Bấm Logout", "Người dùng đã đăng nhập", "Đăng xuất thành công và quay về login/home"),
                ],
            ),
            ModulePlan(
                "S3_SUCCESS",
                "BOOKING_SUCCESS_QR",
                "Booking success, QR và liên kết chia sẻ",
                "Trí",
                "Trung bình",
                [
                    tc("Booking success hiển thị đúng tour / số khách / tổng tiền", "1. Thanh toán booking thành công\n2. Mở booking success", "Booking đã PAID", "Thông tin booking render chính xác"),
                    tc("Copy link tracking thành công", "1. Bấm Copy Link", "Trang có tracking URL", "Clipboard nhận đúng link public tracking"),
                    tc("Open public tracking từ booking success", "1. Bấm Open public tracking", "Tracking code còn hiệu lực", "Mở đúng page public tracking"),
                    tc("QR code scan ra link đúng", "1. Dùng điện thoại quét QR", "QR đã render", "Đi tới đúng URL public tracking"),
                    tc("Khi booking/tour complete, guest page không còn hiệu lực", "1. Chuyển booking sang COMPLETED\n2. Mở lại link guest", "Tracking code cũ", "Trang trả expired / invalid"),
                    tc("Hai tab header guest giữ được cùng tracking code", "1. Bấm chuyển giữa Booking Success và Public Tour Tracking", "URL đang có trackingCode", "Tracking code không bị mất khi chuyển tab"),
                ],
            ),
        ],
    ),
]


def excel_col(index: int) -> str:
    result = ""
    while index:
        index, rem = divmod(index - 1, 26)
        result = chr(65 + rem) + result
    return result


def style_for_status(value: Optional[str]) -> int:
    if value == "Passed":
        return 8
    if value == "Failed":
        return 9
    if value == "Blocked":
        return 10
    return 11


def build_sheet_rows(sprint: SprintPlan, module: ModulePlan):
    gui_cases = module.gui_cases if module.gui_cases is not None else build_generic_gui_cases(module)
    all_cases = [*gui_cases, *module.cases]
    cases = []
    kind_counters = {"GUI": 0, "FUNC": 0}
    for index, case in enumerate(all_cases, start=1):
        kind_counters[case.kind] = kind_counters.get(case.kind, 0) + 1
        round1_date = sprint.round1_dates[(index - 1) % len(sprint.round1_dates)]
        round2_date = sprint.round2_dates[(index - 1) % len(sprint.round2_dates)] if case.round2_status else ""
        expected = case.expected
        actual_round1 = expected if case.round1_status == "Passed" else "Kết quả lệch mong đợi, đã ghi nhận bug / issue."
        actual_round2 = "Đã retest sau khi fix, kết quả đạt đúng mong đợi." if case.round2_status == "Passed" else ""
        case_prefix = "GUI" if case.kind == "GUI" else "FUNC"
        cases.append(
            {
                "id": f"{case_prefix}-{module.module_code}-{kind_counters[case.kind]:03d}",
                "description": case.description,
                "action": case.action,
                "precondition": case.precondition,
                "expected": expected,
                "actual": actual_round2 or actual_round1,
                "round1_status": case.round1_status,
                "round1_date": round1_date,
                "round1_tester": module.tester,
                "round2_status": case.round2_status or "",
                "round2_date": round2_date,
                "round2_tester": module.tester if case.round2_status else "",
                "note": case.note,
                "kind": case.kind,
            }
        )

    round1_fail = sum(1 for item in cases if item["round1_status"] == "Failed")
    round1_blocked = sum(1 for item in cases if item["round1_status"] == "Blocked")
    round1_total = len(cases)
    round2_cases = [item for item in cases if item["round2_status"]]
    round2_pass = sum(1 for item in round2_cases if item["round2_status"] == "Passed")
    round2_fail = sum(1 for item in round2_cases if item["round2_status"] == "Failed")
    round2_blocked = sum(1 for item in round2_cases if item["round2_status"] == "Blocked")

    rows = []
    rows.append([(None, 0)] * 13)
    rows[0][0] = ("Project Name", 1)
    rows[0][1] = (PROJECT_NAME, 2)
    rows[0][6] = ("Sprint", 1)
    rows[0][7] = (sprint.sprint_name, 2)

    rows.append([(None, 0)] * 13)
    rows[1][0] = ("Module Code", 1)
    rows[1][1] = (module.module_code, 2)
    rows[1][3] = ("Phụ trách", 1)
    rows[1][4] = (module.tester, 2)
    rows[1][6] = ("Độ khó", 1)
    rows[1][7] = (module.difficulty, 2)

    rows.append([(None, 0)] * 13)
    rows[2][0] = ("Triển khai", 1)
    rows[2][1] = (sprint.implementation_window, 2)
    rows[2][6] = ("Thời gian test", 1)
    rows[2][7] = (f"Round 1: {sprint.round1_dates[0]} - {sprint.round1_dates[-1]} | Round 2: {sprint.round2_dates[0]} - {sprint.round2_dates[-1]}", 2)

    rows.append([(None, 0)] * 13)
    rows[3][0] = ("Module Name", 1)
    rows[3][1] = (module.module_name, 2)

    rows.append([("Tổng quan vòng kiểm thử", 5)] + [(None, 0)] * 12)
    rows.append([
        ("Vòng kiểm thử", 3),
        ("Hoàn thành", 3),
        ("Lỗi", 3),
        ("Chưa kiểm tra", 3),
        ("Bị chặn", 3),
        ("Tổng số test case", 3),
    ] + [(None, 0)] * 7)
    rows.append([
        ("Round 1", 4),
        (round1_total - round1_fail - round1_blocked, 4),
        (round1_fail, 4),
        (0, 4),
        (round1_blocked, 4),
        (round1_total, 4),
    ] + [(None, 0)] * 7)
    rows.append([
        ("Round 2", 4),
        (round2_pass, 4),
        (round2_fail, 4),
        (0, 4),
        (round2_blocked, 4),
        (len(round2_cases), 4),
    ] + [(None, 0)] * 7)

    rows.append([("Danh sách test case", 5)] + [(None, 0)] * 12)
    rows.append([
        ("Test Case ID", 6),
        ("Mô tả", 6),
        ("Hành động", 6),
        ("Điều kiện tiên quyết", 6),
        ("Kết quả mong đợi", 6),
        ("Kết quả thực tế", 6),
        ("Trạng thái Vòng 1", 6),
        ("Ngày kiểm tra Vòng 1", 6),
        ("Người kiểm tra Vòng 1", 6),
        ("Trạng thái Vòng 2", 6),
        ("Ngày kiểm tra Vòng 2", 6),
        ("Người kiểm tra Vòng 2", 6),
        ("Chú thích", 6),
    ])

    merges = [
        "B1:F1",
        "H1:I1",
        "B2:C2",
        "E2:F2",
        "H2:I2",
        "B3:F3",
        "H3:M3",
        "B4:M4",
        "A5:F5",
        "A9:M9",
    ]

    current_row = len(rows) + 1
    for section_title, section_kind in [("GUI TEST CASES", "GUI"), ("FUNCTION TEST CASES", "FUNC")]:
        section_cases = [case for case in cases if case["kind"] == section_kind]
        if not section_cases:
            continue
        rows.append([(section_title, 5)] + [(None, 0)] * 12)
        merges.append(f"A{current_row}:M{current_row}")
        current_row += 1
        for case in section_cases:
            rows.append([
                (case["id"], 7),
                (case["description"], 7),
                (case["action"], 7),
                (case["precondition"], 7),
                (case["expected"], 7),
                (case["actual"], 7),
                (case["round1_status"], style_for_status(case["round1_status"])),
                (case["round1_date"], 7),
                (case["round1_tester"], 7),
                (case["round2_status"], style_for_status(case["round2_status"])),
                (case["round2_date"], 7),
                (case["round2_tester"], 7),
                (case["note"], 7),
            ])
            current_row += 1

    widths = {
        1: 18,
        2: 28,
        3: 30,
        4: 24,
        5: 32,
        6: 30,
        7: 16,
        8: 16,
        9: 18,
        10: 16,
        11: 16,
        12: 18,
        13: 24,
    }
    return rows, merges, widths


def xml_cell(row_idx: int, col_idx: int, value, style: int) -> str:
    ref = f"{excel_col(col_idx)}{row_idx}"
    if value is None or value == "":
        return f'<c r="{ref}" s="{style}"/>'
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return f'<c r="{ref}" s="{style}"><v>{value}</v></c>'
    text = escape(str(value)).replace("\n", "&#10;")
    return f'<c r="{ref}" s="{style}" t="inlineStr"><is><t xml:space="preserve">{text}</t></is></c>'


def build_sheet_xml(rows, merges, widths):
    max_row = len(rows)
    max_col = max(len(row) for row in rows)
    cols_xml = "".join(
        f'<col min="{idx}" max="{idx}" width="{width}" customWidth="1"/>'
        for idx, width in widths.items()
    )
    row_xml_parts = []
    for r_idx, row in enumerate(rows, start=1):
        cells = "".join(
            xml_cell(r_idx, c_idx, value, style)
            for c_idx, (value, style) in enumerate(row, start=1)
            if value is not None or style
        )
        row_xml_parts.append(f'<row r="{r_idx}" spans="1:{max_col}">{cells}</row>')
    merge_xml = ""
    if merges:
        merge_xml = f'<mergeCells count="{len(merges)}">' + "".join(
            f'<mergeCell ref="{ref}"/>' for ref in merges
        ) + "</mergeCells>"
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f'<dimension ref="A1:{excel_col(max_col)}{max_row}"/>'
        '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'
        '<sheetFormatPr defaultRowHeight="18"/>'
        f'<cols>{cols_xml}</cols>'
        f'<sheetData>{"".join(row_xml_parts)}</sheetData>'
        f'{merge_xml}'
        '<pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>'
        '</worksheet>'
    )


STYLES_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="4">
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><color rgb="FF0F172A"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="12"/><color rgb="FF0F172A"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="8">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0F766E"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE2F7F5"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFEE2E2"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FF94A3B8"/></left>
      <right style="thin"><color rgb="FF94A3B8"/></right>
      <top style="thin"><color rgb="FF94A3B8"/></top>
      <bottom style="thin"><color rgb="FF94A3B8"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="12">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="7" borderId="1" xfId="0" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="2" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="7" borderId="1" xfId="0" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>
"""


def write_workbook(sprint: SprintPlan):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    target = OUTPUT_DIR / sprint.file_name
    sheets = []
    for module in sprint.modules:
        rows, merges, widths = build_sheet_rows(sprint, module)
        sheets.append({
            "name": module.sheet_name[:31],
            "xml": build_sheet_xml(rows, merges, widths),
        })

    workbook_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        '<sheets>' +
        "".join(
            f'<sheet name="{escape(sheet["name"])}" sheetId="{idx}" r:id="rId{idx}"/>'
            for idx, sheet in enumerate(sheets, start=1)
        ) +
        '</sheets></workbook>'
    )

    workbook_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        "".join(
            f'<Relationship Id="rId{idx}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{idx}.xml"/>'
            for idx, _ in enumerate(sheets, start=1)
        ) +
        f'<Relationship Id="rId{len(sheets) + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        '</Relationships>'
    )

    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        + "".join(
            f'<Override PartName="/xl/worksheets/sheet{idx}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            for idx, _ in enumerate(sheets, start=1)
        ) +
        '</Types>'
    )

    root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
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
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>
</cp:coreProperties>
"""

    app_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Excel</Application>
  <TitlesOfParts>
    <vt:vector size="{len(sheets)}" baseType="lpstr">
      {''.join(f'<vt:lpstr>{escape(sheet["name"])}</vt:lpstr>' for sheet in sheets)}
    </vt:vector>
  </TitlesOfParts>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>{len(sheets)}</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
</Properties>
"""

    with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", root_rels)
        zf.writestr("docProps/core.xml", core_xml)
        zf.writestr("docProps/app.xml", app_xml)
        zf.writestr("xl/workbook.xml", workbook_xml)
        zf.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
        zf.writestr("xl/styles.xml", STYLES_XML)
        for idx, sheet in enumerate(sheets, start=1):
            zf.writestr(f"xl/worksheets/sheet{idx}.xml", sheet["xml"])

    print(f"Created {target}")


def main():
    for sprint in SPRINTS:
        write_workbook(sprint)


if __name__ == "__main__":
    main()

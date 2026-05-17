from generate_testcase_workbooks import ModulePlan, SprintPlan, tc, gui, write_workbook


def page(sheet_name, module_code, module_name, tester, difficulty, cases):
    return ModulePlan(sheet_name, module_code, module_name, tester, difficulty, cases)


SPRINTS = [
    SprintPlan(
        sprint_name="Sprint 1",
        file_name="Sprint_1_Page_Based_Test_Cases.xlsx",
        implementation_window="12/03/2026 - 25/03/2026",
        round1_dates=["26/03/2026", "27/03/2026", "28/03/2026"],
        round2_dates=["30/03/2026", "31/03/2026"],
        modules=[
            page("LoginPage", "LOGIN_PAGE", "Trang đăng nhập Traveler", "Tính", "Khó", [
                tc("Đăng nhập đúng email/mật khẩu", "1. Mở /login\n2. Nhập email và mật khẩu đúng\n3. Bấm Sign in", "Tài khoản traveler đã xác thực", "Đăng nhập thành công và điều hướng tới dashboard traveler"),
                tc("Đăng nhập sai mật khẩu", "1. Nhập email đúng\n2. Nhập mật khẩu sai\n3. Bấm Sign in", "Tài khoản traveler tồn tại", "Hiển thị thông báo sai email hoặc mật khẩu"),
                tc("Bỏ trống email khi đăng nhập", "1. Chỉ nhập mật khẩu\n2. Bấm Sign in", "Trang login đã mở", "Validate yêu cầu nhập email"),
                tc("Bỏ trống mật khẩu khi đăng nhập", "1. Chỉ nhập email\n2. Bấm Sign in", "Trang login đã mở", "Validate yêu cầu nhập mật khẩu"),
                tc("Remember me hoạt động đúng", "1. Tick remember me\n2. Login thành công\n3. Tải lại trình duyệt", "Tài khoản đăng nhập hợp lệ", "Phiên đăng nhập được duy trì theo đúng thiết kế"),
                tc("Điều hướng tới quên mật khẩu", "1. Bấm Forgot password?", "Trang login đã mở", "Chuyển tới trang forgot password đúng route"),
            ]),
            page("RegisterPage", "REGISTER_PAGE", "Trang đăng ký tài khoản", "Bảo", "Trung bình", [
                tc("Đăng ký traveler với dữ liệu hợp lệ", "1. Mở /signup\n2. Nhập đủ thông tin hợp lệ\n3. Bấm Register", "Email chưa tồn tại", "Tạo tài khoản thành công và chuyển tới bước xác thực email"),
                tc("Đăng ký với email đã tồn tại", "1. Nhập email đã tồn tại\n2. Gửi form", "Email đã được dùng", "Hiển thị lỗi email đã tồn tại"),
                tc("Mật khẩu và xác nhận mật khẩu không khớp", "1. Nhập password khác confirm password\n2. Gửi form", "Trang đăng ký đã mở", "Hiển thị validate không khớp"),
                tc("Validate định dạng email khi đăng ký", "1. Nhập email sai định dạng\n2. Gửi form", "Trang đăng ký đã mở", "Hiển thị lỗi định dạng email"),
                tc("Validate password yếu", "1. Nhập mật khẩu không đạt rule\n2. Gửi form", "Trang đăng ký đã mở", "Hiển thị rule password rõ ràng"),
                tc("Chuyển về login từ trang đăng ký", "1. Bấm liên kết Login", "Trang đăng ký đã mở", "Điều hướng đúng trang login"),
            ]),
            page("VerifyEmailOtp", "VERIFY_EMAIL_OTP", "Trang xác thực email OTP", "Ngọc", "Trung bình", [
                tc("Nhập OTP đúng để xác thực email", "1. Mở /verify-email-otp\n2. Nhập OTP đúng\n3. Submit", "Người dùng vừa đăng ký và có OTP hợp lệ", "Xác thực email thành công"),
                tc("Nhập OTP sai", "1. Nhập OTP sai\n2. Submit", "Có OTP đang chờ", "Hiển thị lỗi OTP không hợp lệ"),
                tc("OTP hết hạn", "1. Nhập OTP đã hết hạn\n2. Submit", "OTP cũ đã quá hạn", "Hiển thị lỗi OTP hết hạn"),
                tc("Gửi lại OTP", "1. Bấm Resend OTP", "Tài khoản đang chờ xác thực", "OTP mới được gửi thành công"),
                tc("Không cho submit khi thiếu ký tự OTP", "1. Nhập thiếu số OTP\n2. Submit", "Trang OTP đã mở", "Nút submit bị chặn hoặc hiển thị validate"),
            ]),
            page("ForgotPassword", "FORGOT_PASSWORD", "Trang quên mật khẩu", "Trí", "Trung bình", [
                tc("Gửi yêu cầu reset với email hợp lệ", "1. Mở /forgot-password\n2. Nhập email hợp lệ\n3. Submit", "Email đã đăng ký", "Hệ thống gửi OTP hoặc email reset thành công"),
                tc("Nhập email không tồn tại", "1. Nhập email không tồn tại\n2. Submit", "Trang quên mật khẩu đã mở", "Hiển thị thông báo phù hợp, an toàn dữ liệu"),
                tc("Validate email rỗng", "1. Bỏ trống email\n2. Submit", "Trang đã mở", "Yêu cầu nhập email"),
                tc("Validate email sai định dạng", "1. Nhập email sai format\n2. Submit", "Trang đã mở", "Hiển thị lỗi định dạng email"),
                tc("Quay lại login từ forgot password", "1. Bấm Back to login", "Trang đã mở", "Điều hướng về login"),
            ]),
            page("VerifyResetOtp", "VERIFY_RESET_OTP", "Trang xác thực OTP reset mật khẩu", "Trí", "Trung bình", [
                tc("Nhập OTP reset đúng", "1. Mở /forgot-password/verify-otp\n2. Nhập OTP đúng\n3. Submit", "Đã yêu cầu reset password", "Xác nhận OTP thành công và sang bước reset mật khẩu"),
                tc("Nhập OTP reset sai", "1. Nhập OTP sai\n2. Submit", "Có OTP chờ", "Hiển thị lỗi OTP không đúng"),
                tc("OTP reset hết hạn", "1. Nhập OTP đã quá hạn", "Có OTP cũ", "Hiển thị lỗi hết hạn"),
                tc("Gửi lại OTP reset", "1. Bấm resend", "Email reset hợp lệ", "Gửi lại OTP thành công"),
                tc("Không cho submit khi chưa điền đủ OTP", "1. Nhập thiếu ký tự\n2. Submit", "Trang OTP đã mở", "Validate hiển thị đúng"),
            ]),
            page("ResetPassword", "RESET_PASSWORD", "Trang đặt lại mật khẩu", "Thành", "Khó", [
                tc("Đặt lại mật khẩu với token hợp lệ", "1. Mở /reset-password\n2. Nhập mật khẩu mới hợp lệ\n3. Submit", "Có token reset hợp lệ", "Đổi mật khẩu thành công và có thể login lại"),
                tc("Token reset không hợp lệ", "1. Mở link reset sai token", "Token sai hoặc thiếu", "Hiển thị lỗi token không hợp lệ"),
                tc("Mật khẩu mới không đạt rule", "1. Nhập mật khẩu yếu\n2. Submit", "Có token hợp lệ", "Hiển thị rule mật khẩu"),
                tc("Confirm password không khớp", "1. Nhập confirm khác password\n2. Submit", "Có token hợp lệ", "Hiển thị validate không khớp"),
                tc("Login được với mật khẩu mới", "1. Reset thành công\n2. Quay lại login\n3. Dùng password mới", "Đã đổi mật khẩu", "Đăng nhập thành công"),
            ]),
            page("ProviderApply", "PROVIDER_APPLY_PAGE", "Trang đăng ký provider cho guest", "Bảo", "Trung bình", [
                tc("Gửi hồ sơ provider hợp lệ", "1. Mở /apply-provider\n2. Nhập thông tin + upload file\n3. Submit", "Guest truy cập được form", "Tạo hồ sơ pending thành công"),
                tc("Upload file minh chứng đúng định dạng", "1. Chọn file PDF hợp lệ", "Trang form đã mở", "Upload thành công và hiển thị tên file"),
                tc("Thiếu thông tin bắt buộc", "1. Bỏ trống vài field\n2. Submit", "Trang form đã mở", "Hiển thị validate rõ ràng"),
                tc("File upload sai định dạng", "1. Upload file không hợp lệ", "Trang form đã mở", "Hiển thị lỗi định dạng file"),
                tc("Sau submit thành công hiển thị waiting state", "1. Gửi form thành công", "Form hợp lệ", "Chuyển sang màn hình chờ xét duyệt"),
            ]),
            page("ProviderApproval", "PROVIDER_APPROVAL", "Trang duyệt provider của admin", "Thành", "Khó", [
                tc("Admin xem danh sách hồ sơ pending", "1. Đăng nhập admin\n2. Mở /admin/provider-approval", "Có hồ sơ pending", "Danh sách hồ sơ chờ duyệt hiển thị đúng"),
                tc("Admin approve hồ sơ provider", "1. Chọn hồ sơ\n2. Bấm Approve", "Admin có quyền", "Hồ sơ chuyển approved"),
                tc("Admin reject hồ sơ provider", "1. Chọn hồ sơ\n2. Bấm Reject\n3. Nhập lý do", "Admin có quyền", "Hồ sơ chuyển rejected và lưu lý do"),
                tc("Provider chưa approved không login được", "1. Dùng tài khoản pending login provider", "Tài khoản provider pending", "Bị chặn login với thông báo đúng", "Failed", "Passed", "Retest sau khi sửa validate trạng thái provider"),
                tc("Danh sách pending giảm sau khi xử lý", "1. Approve hoặc reject một hồ sơ", "Có hồ sơ pending", "Hồ sơ bị loại khỏi danh sách pending hiện tại"),
            ]),
            page("ProviderHistory", "PROVIDER_APPROVAL_HISTORY", "Trang lịch sử duyệt provider", "Ngọc", "Trung bình", [
                tc("Hiển thị lịch sử approve và reject", "1. Mở /admin/provider-approval-history", "Đã có hồ sơ đã xử lý", "Hiển thị đủ hồ sơ processed"),
                tc("Hiển thị đúng lý do reject", "1. Xem một hồ sơ bị reject", "Có hồ sơ rejected", "Lý do reject hiển thị đúng"),
                tc("Hiển thị đúng thời gian xử lý", "1. Quan sát cột processed time", "Có dữ liệu history", "Ngày giờ xử lý đúng định dạng"),
                tc("Phân biệt rõ trạng thái approved/rejected", "1. Quan sát badge trạng thái", "Có dữ liệu history", "Badge trạng thái hiển thị rõ ràng"),
            ]),
        ],
    ),
    SprintPlan(
        sprint_name="Sprint 2",
        file_name="Sprint_2_Page_Based_Test_Cases.xlsx",
        implementation_window="26/03/2026 - 17/04/2026",
        round1_dates=["18/04/2026", "19/04/2026", "20/04/2026", "21/04/2026"],
        round2_dates=["22/04/2026", "23/04/2026", "24/04/2026"],
        modules=[
            page("TravelerDash", "TRAVELER_DASHBOARD", "Traveler Dashboard", "Ngọc", "Trung bình", [
                tc("Dashboard traveler tải dữ liệu thật", "1. Đăng nhập traveler\n2. Mở dashboard", "Traveler có dữ liệu booking", "Các card và section hiển thị đúng dữ liệu backend"),
                tc("Quick action điều hướng đúng trang", "1. Bấm các quick action trên dashboard", "Traveler đã đăng nhập", "Điều hướng đúng module đích"),
                tc("Upcoming trip hiển thị đúng booking gần nhất", "1. Mở dashboard", "Traveler có booking sắp tới", "Thẻ upcoming hiển thị đúng thông tin"),
                tc("Recommended tours hiển thị danh sách hợp lệ", "1. Tải dashboard", "Có dữ liệu tour", "Danh sách gợi ý hiển thị đúng"),
                tc("Reward / stats khớp dữ liệu hồ sơ", "1. So sánh card stats với backend", "Có reward data", "Số liệu hiển thị chính xác"),
            ]),
            page("TourList", "TOUR_LIST_PAGE", "Trang danh sách tour", "Bảo", "Trung bình", [
                tc("Hiển thị danh sách tour công khai", "1. Mở /traveler/tour-list", "Có tour public", "Chỉ tour public hiển thị"),
                tc("Search theo tên hoặc địa điểm", "1. Nhập từ khóa tìm kiếm", "Danh sách đã tải", "Kết quả lọc đúng"),
                tc("Sort theo giá/rating/popular", "1. Chọn từng sort option", "Danh sách đã tải", "Thứ tự danh sách đổi đúng"),
                tc("Phân trang hoặc load thêm hoạt động đúng", "1. Cuộn hoặc chuyển trang", "Danh sách có nhiều dữ liệu", "Danh sách tải thêm đúng"),
                tc("Tour riêng không xuất hiện ở list public", "1. Tạo tour proposal private\n2. Mở tour list", "Có tour private", "Tour private bị ẩn khỏi danh sách"),
            ]),
            page("TourDetail", "TOUR_DETAIL_PAGE", "Trang chi tiết tour", "Tính", "Khó", [
                tc("Tour detail tải đủ thông tin tour", "1. Mở /traveler/tour-detail/:tourId", "Tour tồn tại", "Hiển thị ảnh, mô tả, itinerary, guide và booking widget"),
                tc("Guide hiển thị đúng theo schedule", "1. Chọn schedule khác nhau", "Tour có nhiều schedule với guide", "Guide card đổi đúng theo schedule đang chọn"),
                tc("Traveler count khớp AI request gốc", "1. Mở tour tạo từ AI request", "Tour có sourceAiTourRequestId", "Số lượng adults/children/infants được prefill đúng"),
                tc("Tour proposal luôn ở private và không đổi được", "1. Mở tour proposal approved", "Tour là target traveler only", "Switch private bị khóa và giữ đúng trạng thái"),
                tc("Confirm booking tạo booking hợp lệ", "1. Chọn schedule\n2. Bấm Confirm Booking", "Tour còn chỗ và traveler hợp lệ", "Tạo booking thành công"),
                tc("Tour không tồn tại hiển thị trạng thái an toàn", "1. Mở tourId sai", "ID không hợp lệ", "Hiển thị not found hoặc thông báo phù hợp"),
            ]),
            page("AIPlanner", "AI_PLANNER_PAGE", "Trang AI Travel Planner", "Thành", "Khó", [
                tc("Generate itinerary thành công", "1. Nhập dữ liệu planner\n2. Bấm Generate", "Traveler đã đăng nhập", "Hiển thị itinerary hợp lệ"),
                tc("Tổng adult + child phải tối thiểu 5", "1. Nhập tổng dưới 5\n2. Generate", "Trang planner đã mở", "Toast tiếng Việt cảnh báo tối thiểu 5 người"),
                tc("Prompt trả địa điểm có tên đủ cụ thể", "1. Generate lịch trình điểm đến phổ biến", "Model AI hoạt động", "Tên địa điểm không quá chung chung"),
                tc("Save Trip lưu thành công", "1. Generate xong\n2. Bấm Save Trip", "Có itinerary hiện tại", "Lưu vào AI Tour History thành công"),
                tc("Generate lỗi thì hiển thị toast phù hợp", "1. Gây lỗi generate\n2. Theo dõi UI", "API hoặc mạng lỗi", "Hiển thị toast lỗi rõ ràng"),
            ]),
            page("AIHistory", "AI_HISTORY_PAGE", "Trang AI Tour History", "Ngọc", "Trung bình", [
                tc("Hiển thị danh sách lịch sử AI đã lưu", "1. Mở /traveler/ai-tour-history", "Traveler có lịch sử đã lưu", "Danh sách card hiển thị đúng"),
                tc("Mở chi tiết một trip lịch sử", "1. Chọn một item trong list", "History có dữ liệu", "Detail panel hiển thị đúng itinerary"),
                tc("Nút gửi tour cho provider chỉ hiện ở DRAFT", "1. Chọn item DRAFT và item khác trạng thái", "Có nhiều trạng thái", "Chỉ DRAFT có nút gửi"),
                tc("Publish lại request đã EXPIRED do quá 24h", "1. Chọn request expired bởi publish timeout\n2. Bấm gửi lại", "Request còn trong history", "Publish lại thành công"),
                tc("Mở tour đề xuất để booking", "1. Chọn item APPROVED có proposal", "Request đã có convertedTourId", "Có nút mở tour để booking"),
            ]),
            page("MyBooking", "MY_BOOKING_PAGE", "Trang My Booking của traveler", "Trí", "Trung bình", [
                tc("Danh sách booking PAID hiển thị đúng", "1. Mở /traveler/my-booking-traveler", "Traveler có booking đã thanh toán", "Hiển thị đúng các booking hiệu lực"),
                tc("Booking unpaid timeout không xuất hiện", "1. Tạo booking rồi để timeout", "Có booking timeout", "Booking đó không hiện ở My Booking"),
                tc("Nút Review chỉ hiện khi booking COMPLETED", "1. So sánh booking CONFIRMED và COMPLETED", "Có đủ loại booking", "Chỉ COMPLETED có nút Review"),
                tc("Nút Pay hiện cho booking chưa thanh toán", "1. Mở danh sách booking unpaid", "Có booking pending payment", "Hiển thị nút Pay"),
                tc("Cancel booking cập nhật trạng thái đúng", "1. Bấm cancel booking", "Booking còn được phép hủy", "Booking chuyển CANCELLED"),
            ]),
            page("ProviderDash", "PROVIDER_DASHBOARD", "Provider Dashboard", "Ngọc", "Trung bình", [
                tc("Dashboard provider tải đúng số liệu booking/revenue", "1. Đăng nhập provider\n2. Mở dashboard", "Provider có dữ liệu demo", "Các thẻ số liệu hiển thị đúng"),
                tc("Biểu đồ revenue hiển thị đúng 6 tháng", "1. Quan sát chart revenue", "Có dữ liệu doanh thu", "Chart và nhãn trục hiển thị hợp lý"),
                tc("AI requests card hiển thị số request đang có", "1. Publish một số AI request\n2. Mở dashboard provider", "Provider có quyền truy cập", "Card AI request cập nhật số đúng"),
                tc("Recent bookings/activity hiển thị đúng", "1. Xem khu vực recent activity", "Có booking gần đây", "Danh sách hiển thị đúng thứ tự"),
            ]),
            page("ManageTours", "MANAGE_TOURS_PAGE", "Trang Manage Tours", "Tính", "Khó", [
                tc("Tạo tour công khai thành công", "1. Mở create tour\n2. Nhập dữ liệu hợp lệ\n3. Lưu", "Provider đã đăng nhập", "Tour được tạo thành công"),
                tc("Sửa tour và lưu thành công", "1. Chọn edit tour\n2. Thay đổi dữ liệu\n3. Lưu", "Tour tồn tại", "Tour cập nhật thành công"),
                tc("Booking status trong bảng không lấy từ Tour.status", "1. Mở bảng tour có booking", "Có tour có booking", "Cột booking status phản ánh booking thực tế thay vì DRAFT"),
                tc("Tour tạo từ AI request không cho set group/public", "1. Mở tour proposal", "Tour là private proposal", "Trạng thái private được giữ chặt"),
                tc("Xóa tour hoạt động đúng", "1. Chọn delete tour", "Tour phù hợp để xóa", "Tour bị loại khỏi danh sách"),
            ]),
            page("TourSchedule", "TOUR_SCHEDULE_PAGE", "Trang Tour Schedule", "Thành", "Khó", [
                tc("Tạo schedule ngày tương lai", "1. Mở add schedule\n2. Chọn ngày tương lai\n3. Lưu", "Tour đã tồn tại", "Schedule tạo thành công"),
                tc("Không cho chọn ngày quá khứ", "1. Chọn ngày quá khứ", "Dialog mở", "Hiển thị lỗi ngày không hợp lệ"),
                tc("Không cho chọn guide bận lịch trùng", "1. Chọn guide có tour trùng ngày", "Guide đã có lịch khác", "Guide không xuất hiện hoặc bị chặn"),
                tc("Schedule proposal private khóa switch private", "1. Mở schedule của tour proposal", "Tour là private proposal", "Switch private bị khóa"),
                tc("Prefill ngày khởi hành từ AI request", "1. Convert AI request\n2. Vào schedule", "AI request có startDay", "Ngày khởi hành mặc định đúng"),
                tc("TourSchedule is not defined không còn tái diễn khi edit", "1. Edit schedule có đổi guide", "Schedule tồn tại", "Lưu thành công không phát sinh lỗi runtime"),
            ]),
            page("ServiceMgmt", "SERVICE_MGMT_PAGE", "Trang Service Management", "Ngọc", "Trung bình", [
                tc("Tạo service mới thành công", "1. Mở dialog create service\n2. Nhập đủ thông tin\n3. Lưu", "Provider đã đăng nhập", "Service xuất hiện trong danh sách"),
                tc("Sửa service thành công", "1. Edit service\n2. Cập nhật giá và mô tả\n3. Lưu", "Service tồn tại", "Service cập nhật đúng"),
                tc("Alias được lưu khi tạo/chỉnh service", "1. Nhập aliases\n2. Lưu", "Dialog create/edit đã mở", "Alias được chuẩn hóa và lưu"),
                tc("Xóa service thành công", "1. Chọn delete\n2. Confirm", "Service tồn tại", "Service bị xóa khỏi danh sách"),
                tc("Không reload nguyên trang khi tạo service trong AI request", "1. Tạo service từ context AI request", "Đang ở AI request detail", "Chỉ refresh dữ liệu nền, không nháy trang"),
            ]),
            page("GuideMgmt", "GUIDE_MGMT_PAGE", "Trang Guide Management", "Trí", "Trung bình", [
                tc("Tạo guide mới thành công", "1. Mở create guide\n2. Nhập thông tin\n3. Lưu", "Provider đã đăng nhập", "Guide mới xuất hiện trong bảng"),
                tc("Sửa thông tin guide thành công", "1. Edit guide\n2. Thay đổi specialty/phone\n3. Lưu", "Guide tồn tại", "Thông tin guide cập nhật đúng"),
                tc("Guide inactive không còn được gán schedule", "1. Chuyển guide sang inactive", "Guide có trong hệ thống", "Guide không hiện trong select assign"),
                tc("Xóa guide hoạt động đúng", "1. Delete guide\n2. Confirm", "Guide phù hợp để xóa", "Guide bị loại khỏi bảng"),
                tc("Login guide sai thông tin hiện lỗi đúng", "1. Đăng nhập sai email/mật khẩu", "Guide login form sẵn sàng", "Hiển thị sai email hoặc mật khẩu"),
            ]),
            page("ProviderBook", "PROVIDER_BOOK_PAGE", "Trang Provider Booking Management", "Trí", "Trung bình", [
                tc("Hiển thị booking thuộc provider hiện tại", "1. Đăng nhập provider\n2. Mở bookings management", "Provider có booking", "Chỉ booking của provider đó hiển thị"),
                tc("Status hiển thị theo Booking.status và payment", "1. Quan sát nhiều booking trạng thái khác nhau", "Có đủ loại booking", "Hiển thị Pending payment/Confirmed/Completed/Cancelled đúng"),
                tc("Guide hiển thị theo schedule", "1. Xem booking đã gán guide", "Booking có tourScheduleId", "Tên guide khớp tourSchedule.leadGuideServiceId"),
                tc("Filter booking theo trạng thái", "1. Chọn từng filter", "Danh sách đã tải", "Kết quả lọc đúng"),
                tc("Booking private hiển thị nhận diện rõ", "1. Xem booking proposal private", "Có booking private", "Bảng hiển thị loại private đúng"),
            ]),
        ],
    ),
    SprintPlan(
        sprint_name="Sprint 3",
        file_name="Sprint_3_Page_Based_Test_Cases.xlsx",
        implementation_window="18/04/2026 - 08/05/2026",
        round1_dates=["09/05/2026", "10/05/2026", "11/05/2026", "12/05/2026"],
        round2_dates=["13/05/2026", "14/05/2026", "15/05/2026"],
        modules=[
            page("AITourReqDtl", "AI_REQUEST_DETAIL", "Trang AI Tour Request Detail", "Tính", "Khó", [
                tc("Provider mở request từ notification", "1. Bấm item trong bell dropdown", "Có request PUBLISHED", "Đi tới trang detail đúng request"),
                tc("Request bị provider khác giữ sẽ báo đúng", "1. Provider B mở request đang bị A giữ", "Request đang CLAIMED bởi A", "Hiển thị thông báo request đang được giữ bởi provider khác"),
                tc("Provider hiện tại mở request mình đang giữ không bị báo sai", "1. Provider A mở lại request đang do mình giữ", "Request đang CLAIMED bởi chính provider A", "Trang detail mở bình thường"),
                tc("Tạo service còn thiếu ngay trong request", "1. Bấm Tạo service này\n2. Nhập form\n3. Lưu", "Request có service missing", "Service tạo thành công và request refresh nền"),
                tc("Match service tương đương và dùng existing", "1. Chọn Use existing", "Hệ thống tìm thấy possible match", "Xác nhận match thành công và lưu alias"),
                tc("Case lệch giá hiển thị quyết định rõ", "1. Chọn service possible match có price mismatch", "Request có price mismatch", "Hiển thị AI price / existing price và hành động xử lý"),
                tc("Không tạo proposal khi còn missing service", "1. Bấm Create Tour Proposal khi chưa xử lý xong service", "Còn item missing/price mismatch chưa xác nhận", "API hoặc UI chặn tạo proposal"),
            ]),
            page("TrackingMgmt", "TRACKING_MGMT_PAGE", "Trang Traveler Tracking Management", "Bảo", "Trung bình", [
                tc("Chỉ booking CONFIRMED mới xuất hiện", "1. Mở trang tracking management", "Traveler có booking nhiều trạng thái", "Chỉ booking đủ điều kiện tracking hiển thị"),
                tc("Regenerate tracking link thành công", "1. Bấm regenerate link", "Booking hợp lệ", "Tracking code mới được tạo"),
                tc("Copy link hoạt động đúng", "1. Bấm copy link", "Có tracking code", "Link được copy thành công"),
                tc("QR/link mở đúng public tracking", "1. Mở link public từ tracking management", "Tracking code hợp lệ", "Đi tới đúng trang public tracking"),
                tc("Booking COMPLETED không còn tracking hiệu lực", "1. Hoàn tất booking\n2. Mở lại link", "Booking đã COMPLETED", "Link hết hiệu lực"),
            ]),
            page("TourTracking", "TOUR_TRACKING_PAGE", "Trang Tour Tracking của traveler", "Tính", "Khó", [
                tc("Hiển thị start date của tour", "1. Mở tour tracking", "Booking có schedule", "Ngày bắt đầu hiển thị đúng"),
                tc("Map hiển thị đúng dữ liệu mock/google map", "1. Mở map section", "Tracking có location data", "Map render đúng, không có button che map"),
                tc("Timeline phản ánh trạng thái guide cập nhật", "1. Guide mark done một điểm\n2. Refresh tour tracking", "Có guide live tracking hoạt động", "Timeline cập nhật trạng thái hoàn thành"),
                tc("Card PENDING và COMPLETE có nền mờ", "1. Quan sát timeline nhiều trạng thái", "Có item pending/complete", "Background mờ đúng thiết kế"),
                tc("Tracking không mở được khi booking không ở CONFIRMED/COMPLETED phù hợp", "1. Mở tracking với booking không hợp lệ", "Booking không đủ điều kiện", "Hệ thống chặn hoặc báo phù hợp"),
            ]),
            page("PublicTrack", "PUBLIC_TRACK_PAGE", "Trang Public Tour Tracking", "Tính", "Khó", [
                tc("Guest vào public tracking không cần đăng nhập", "1. Mở /guest với trackingCode hợp lệ", "Có tracking code hợp lệ", "Xem được dữ liệu công khai không cần token"),
                tc("Timeline public cập nhật sau guide mark done", "1. Guide mark done\n2. Refresh public page", "Cùng booking tracking", "Timeline public cập nhật đúng"),
                tc("Khi booking COMPLETED thì tracking hết hiệu lực", "1. Chuyển booking COMPLETED\n2. Mở lại public tracking", "Tracking code cũ", "Trang báo expired/invalid"),
                tc("Header tab giữ được tracking code", "1. Chuyển qua lại tab guest", "URL có trackingCode", "trackingCode vẫn được giữ"),
                tc("Map public không có button che nội dung", "1. Mở map", "Public map đã render", "Các nút che map đã bị loại bỏ"),
            ]),
            page("BookingSuccess", "BOOKING_SUCCESS_PAGE", "Trang Booking Success", "Trí", "Trung bình", [
                tc("Hiển thị đúng tour/số khách/tổng tiền", "1. Mở booking success của orderCode hợp lệ", "Booking đã PAID", "Thông tin render đúng"),
                tc("Hiển thị tracking link và QR đúng", "1. Mở booking success", "Booking có tracking code", "Link và QR khớp đúng URL public tracking"),
                tc("Copy link thành công", "1. Bấm Copy Link", "Có tracking URL", "Clipboard nhận đúng link"),
                tc("Open public tracking từ success page", "1. Bấm Open public tracking", "Tracking còn hiệu lực", "Đi tới public tracking"),
                tc("Tab header guest giữ tracking code khi chuyển trang", "1. Chuyển tab trên header guest", "Đang ở booking success có code", "Không mất trackingCode"),
            ]),
            page("GuideLiveTrack", "GUIDE_LIVE_TRACK", "Trang Guide Live Tour Tracking", "Thành", "Khó", [
                tc("Guide xem được live tours được phân công", "1. Đăng nhập guide\n2. Mở live tour tracking", "Guide có tour được phân công", "Danh sách live tours hiển thị đúng"),
                tc("Nút Start chuyển trạng thái sang IN_PROGRESS", "1. Bấm Start ở item pending", "Có item pending", "Item chuyển IN_PROGRESS"),
                tc("Mark done hoàn tất điểm dừng", "1. Bấm Mark done", "Item đang IN_PROGRESS", "Item chuyển COMPLETE"),
                tc("Hoàn tất hết item sẽ chuyển booking COMPLETED", "1. Mark done toàn bộ timeline", "Đang ở điểm cuối cùng", "Booking tự chuyển COMPLETED"),
                tc("Traveler/public tracking cập nhật theo tiến độ mới", "1. Guide cập nhật timeline\n2. Kiểm tra trang traveler/public", "Cùng booking tracking", "Các trang kia phản ánh đúng trạng thái"),
                tc("Card pending/complete có nền mờ đúng thiết kế", "1. Quan sát timeline", "Có nhiều trạng thái", "UI phản ánh rõ pending, in-progress, complete"),
            ]),
            page("AssignedTours", "ASSIGNED_TOURS_PAGE", "Trang Assigned Tours List", "Ngọc", "Trung bình", [
                tc("Guide xem danh sách tour được phân công", "1. Đăng nhập guide\n2. Mở assigned tours", "Guide có tour", "Danh sách tour hiển thị đúng"),
                tc("Thông tin guide/schedule trên card đúng", "1. Xem chi tiết card tour", "Có assigned tours", "Ngày đi, tour name, traveler count hiển thị đúng"),
                tc("Chỉ tour của guide hiện tại được hiển thị", "1. So sánh với guide khác", "Có dữ liệu nhiều guide", "Guide không thấy tour của người khác"),
                tc("Điều hướng từ assigned tours sang live tracking", "1. Bấm action phù hợp trên card", "Tour đang CONFIRMED", "Đi tới live tracking đúng tour"),
            ]),
            page("ReviewPage", "REVIEW_PAGE", "Trang Review của traveler", "Ngọc", "Trung bình", [
                tc("Chỉ booking COMPLETED mới truy cập review hợp lệ", "1. Mở review từ booking khác trạng thái", "Có booking CONFIRMED và COMPLETED", "Chỉ booking COMPLETED cho phép review"),
                tc("Gửi review tour + guide thành công", "1. Chọn rating\n2. Nhập nội dung\n3. Submit", "Booking COMPLETED chưa review", "Review lưu thành công"),
                tc("Không cho review lần hai cùng booking", "1. Review xong\n2. Mở lại form", "Booking đã có review", "Hệ thống chặn review trùng"),
                tc("Hiển thị summary card đúng dữ liệu booking", "1. Mở trang review", "Booking hợp lệ", "Tour summary card đúng dữ liệu"),
                tc("Guide rating cập nhật sau khi review", "1. Submit review guide\n2. Kiểm tra profile guide", "Có review mới", "Average rating được cập nhật"),
            ]),
            page("AdminDash", "ADMIN_DASHBOARD_PAGE", "Trang Admin Dashboard", "Ngọc", "Trung bình", [
                tc("Admin dashboard hiển thị stats chính", "1. Đăng nhập admin\n2. Mở dashboard", "Admin có dữ liệu hệ thống", "Card users/providers/bookings hiển thị đúng"),
                tc("Activity feed tải đúng", "1. Xem activity feed", "Có dữ liệu", "Danh sách hoạt động hiển thị hợp lý"),
                tc("System health hiển thị trạng thái đúng", "1. Quan sát section system health", "Dashboard đã tải", "Trạng thái hiển thị đúng thiết kế"),
                tc("Card moderation/pending điều hướng đúng", "1. Bấm card có action", "Dashboard có link nội bộ", "Điều hướng đúng module đích"),
            ]),
            page("AdminAnalytics", "ADMIN_ANALYTICS_PAGE", "Trang Admin Analytics", "Tính", "Khó", [
                tc("Trang analytics admin render bằng component tách props", "1. Mở /admin/analytics", "Admin đã đăng nhập", "Trang render ổn định theo dữ liệu tĩnh"),
                tc("Các card KPI hiển thị đủ dữ liệu tĩnh", "1. Quan sát các widget", "Trang đã tải", "Số liệu và tiêu đề hiển thị đúng"),
                tc("Biểu đồ/tables tĩnh không vỡ layout", "1. Quan sát chart/table", "Trang đã tải", "Layout ổn định, không tràn"),
                tc("Responsive của analytics admin giữ được khả năng đọc", "1. Thu nhỏ viewport", "Trang đã tải", "Card/chart vẫn đọc được"),
            ]),
            page("ProviderAnaly", "PROVIDER_ANALYTICS_PAGE", "Trang Provider Analytics", "Thành", "Khó", [
                tc("Trang analytics provider render bằng shadcn component", "1. Mở /provider/analytics", "Provider đã đăng nhập", "Render đúng component tách props"),
                tc("KPI/cards dùng dữ liệu tĩnh đúng", "1. Quan sát các card", "Trang đã tải", "Card hiển thị đúng số liệu tĩnh"),
                tc("Chart/tables provider hiển thị ổn định", "1. Quan sát chart/table", "Trang đã tải", "Không lỗi layout và hiển thị đúng"),
                tc("Responsive provider analytics ổn định", "1. Thu nhỏ màn hình", "Trang đã tải", "Các widget không chồng lấp"),
            ]),
            page("HeaderSearch", "HEADER_SEARCH_PAGE", "Header, notification và search", "Bảo", "Trung bình", [
                tc("Bell badge hiển thị đúng số request provider", "1. Publish vài AI request\n2. Mở header provider", "Provider đang online", "Badge hiển thị đúng số lượng"),
                tc("Click item notification mở đúng trang", "1. Bấm item trong bell dropdown", "Có notification", "Đi tới đúng request detail"),
                tc("Avatar menu mở đúng profile page", "1. Bấm avatar\n2. Chọn Profile", "Người dùng đã đăng nhập", "Đi tới đúng profile role hiện tại"),
                tc("Logout từ header xóa session", "1. Bấm Logout", "Người dùng đang đăng nhập", "Đăng xuất thành công"),
                tc("Protected route hiển thị thông báo phù hợp khi truy cập sai quyền", "1. Truy cập URL role khác", "Có session role không phù hợp", "Bị chặn và có thông báo cho người dùng"),
            ]),
            page("ChatBot", "CHATBOT_PAGE", "Trang Chat AI Assistant", "Thành", "Khó", [
                tc("Guest mở chatbot từ landing page", "1. Mở landing page\n2. Bấm mở chat widget", "Guest truy cập trang chủ", "Chat widget mở thành công và hiển thị lời chào"),
                tc("Traveler gửi câu hỏi chatbot thành công", "1. Đăng nhập traveler\n2. Gửi câu hỏi về tour/booking", "API chatbot hoạt động", "Chatbot trả lời nội dung phù hợp ngữ cảnh"),
                tc("Hiển thị nguồn dữ liệu khi chatbot trả lời", "1. Gửi câu hỏi có knowledge base", "Chatbot có source", "Khối SOURCES hiển thị đúng danh sách nguồn liên quan"),
                tc("Giới hạn lượt hỏi miễn phí cho guest", "1. Gửi liên tiếp đến hết lượt miễn phí", "Guest chưa đăng nhập", "Hiển thị thông báo đã hết lượt và gợi ý đăng nhập"),
                tc("Đăng nhập xong tiếp tục hỏi được", "1. Guest hết lượt\n2. Đăng nhập\n3. Gửi lại câu hỏi", "Tài khoản traveler hợp lệ", "Chat hoạt động lại bình thường"),
                tc("Hiển thị lỗi thân thiện khi chatbot lỗi", "1. Gây lỗi API chatbot", "API lỗi hoặc timeout", "Hiển thị thông báo lỗi rõ ràng, không làm vỡ widget"),
            ]),
        ],
    ),
]


CUSTOM_GUI_CASES = {
    "LOGIN_PAGE": [
        gui("Kiểm tra bố cục form login", "1. Mở /login", "Guest truy cập được trang login", "Form có đủ email, password, remember me, forgot password và nút Sign in; panel phụ hiển thị cân đối"),
        gui("Kiểm tra nút show/hide mật khẩu", "1. Nhập password\n2. Bấm icon show/hide", "Trang login đã mở", "Mật khẩu đổi đúng giữa dạng ẩn/hiện, icon phản hồi đúng trạng thái"),
        gui("Kiểm tra trạng thái disable/loading khi submit", "1. Nhập dữ liệu\n2. Bấm Sign in", "API login phản hồi chậm giả lập", "Nút submit hiển thị loading và ngăn bấm lặp"),
        gui("Kiểm tra thông báo lỗi hiển thị gần form login", "1. Submit dữ liệu sai", "Có lỗi đăng nhập", "Thông báo lỗi không đè layout, dễ đọc và ở gần vùng form"),
    ],
    "REGISTER_PAGE": [
        gui("Kiểm tra bố cục trang đăng ký", "1. Mở /signup", "Guest truy cập được trang", "Form đăng ký hiển thị đủ các trường, nút Register và liên kết quay lại login"),
        gui("Kiểm tra placeholder/label của các trường đăng ký", "1. Quan sát từng trường form", "Trang đăng ký đã mở", "Label và placeholder rõ nghĩa, đúng ngôn ngữ giao diện"),
        gui("Kiểm tra hiển thị lỗi validate inline", "1. Nhập sai vài trường\n2. Blur khỏi ô input", "Trang đăng ký đã mở", "Thông báo validate hiển thị ngay dưới field liên quan"),
        gui("Kiểm tra nút submit và trạng thái loading", "1. Gửi form hợp lệ", "Mạng/API có độ trễ", "Nút Register hiển thị loading, không cho submit liên tiếp"),
    ],
    "VERIFY_EMAIL_OTP": [
        gui("Kiểm tra giao diện ô nhập OTP", "1. Mở trang verify email OTP", "Có thể truy cập route verify", "Các ô OTP căn đều, focus tự chuyển và không vỡ layout"),
        gui("Kiểm tra nút resend OTP", "1. Quan sát và bấm Resend", "Có phiên xác thực đang chờ", "Nút resend hiển thị rõ và phản hồi loading/disabled hợp lý"),
        gui("Kiểm tra trạng thái submit khi OTP chưa đủ", "1. Nhập thiếu OTP", "Trang đã mở", "Nút xác nhận bị chặn hoặc UI cảnh báo ngay"),
    ],
    "FORGOT_PASSWORD": [
        gui("Kiểm tra bố cục trang quên mật khẩu", "1. Mở /forgot-password", "Guest truy cập được route", "Tiêu đề, mô tả, ô email và nút gửi yêu cầu hiển thị rõ"),
        gui("Kiểm tra điều hướng quay lại login", "1. Bấm Back to login", "Trang đã mở", "Điều hướng mượt và đúng route login"),
        gui("Kiểm tra hiển thị success state sau khi gửi mail", "1. Nhập email hợp lệ\n2. Submit", "API trả thành công", "Hiển thị toast hoặc thông báo thành công mà không vỡ layout"),
    ],
    "VERIFY_RESET_OTP": [
        gui("Kiểm tra giao diện OTP reset", "1. Mở /forgot-password/verify-otp", "Có flow reset đang chạy", "Các ô OTP, nút submit, resend hiển thị cân đối"),
        gui("Kiểm tra focus tự động giữa các ô OTP", "1. Nhập liên tiếp các số OTP", "Trang OTP reset đã mở", "Con trỏ chuyển sang ô kế tiếp tự động"),
        gui("Kiểm tra lỗi hiển thị khi OTP sai", "1. Submit OTP sai", "Có lỗi xác thực", "Thông báo lỗi hiển thị rõ và không che ô nhập"),
    ],
    "RESET_PASSWORD": [
        gui("Kiểm tra bố cục form reset password", "1. Mở /reset-password", "Có token hoặc route hợp lệ", "Form có password, confirm password, rule và nút submit rõ ràng"),
        gui("Kiểm tra icon show/hide mật khẩu ở cả 2 trường", "1. Nhập password và confirm\n2. Bấm icon mắt", "Trang đã mở", "Cả hai ô phản hồi đúng trạng thái ẩn/hiện"),
        gui("Kiểm tra hiển thị rule mật khẩu", "1. Focus vào ô mật khẩu", "Trang reset đã mở", "Rule mật khẩu hiển thị dễ đọc, không chồng lấp"),
    ],
    "PROVIDER_APPLY_PAGE": [
        gui("Kiểm tra bố cục form apply provider", "1. Mở /apply-provider", "Guest truy cập được form", "Các khối thông tin công ty, upload file, mô tả và nút submit hiển thị tách bạch"),
        gui("Kiểm tra upload file component", "1. Chọn tệp minh chứng", "Trang form đã mở", "Tên file, trạng thái upload và nút thay file hiển thị đúng"),
        gui("Kiểm tra waiting state sau submit", "1. Submit form thành công", "Form hợp lệ", "Màn hình chờ xét duyệt hiển thị rõ trạng thái và thông điệp tiếp theo"),
    ],
    "PROVIDER_APPROVAL": [
        gui("Kiểm tra card hồ sơ pending", "1. Mở trang provider approval", "Admin có dữ liệu pending", "Mỗi card hiển thị đủ tên công ty, liên hệ, file, trạng thái và action"),
        gui("Kiểm tra dialog/confirm khi reject", "1. Bấm Reject", "Có hồ sơ pending", "Dialog nhập lý do reject hiển thị đúng và có validate"),
        gui("Kiểm tra trạng thái nút Approve/Reject khi đang xử lý", "1. Bấm một action", "API có độ trễ", "Nút loading và khóa bấm lặp hợp lý"),
    ],
    "PROVIDER_APPROVAL_HISTORY": [
        gui("Kiểm tra bảng/list lịch sử duyệt", "1. Mở trang history", "Admin có dữ liệu processed", "Danh sách hiển thị trạng thái, thời gian, người xử lý và lý do nếu có"),
        gui("Kiểm tra badge trạng thái trong history", "1. Quan sát các hồ sơ approved/rejected", "Có đủ trạng thái", "Màu sắc badge phân biệt rõ approved và rejected"),
        gui("Kiểm tra empty state của history", "1. Mở khi chưa có dữ liệu", "Hệ thống chưa có hồ sơ processed", "Hiển thị empty state rõ ràng"),
    ],
    "TRAVELER_DASHBOARD": [
        gui("Kiểm tra hero/summary cards dashboard traveler", "1. Mở dashboard traveler", "Traveler đã đăng nhập", "Các card số liệu hiển thị cân đối, không lệch hàng"),
        gui("Kiểm tra section upcoming trip", "1. Quan sát khối trip sắp tới", "Có booking sắp tới", "Khối hiển thị ngày, tour, trạng thái và CTA rõ ràng"),
        gui("Kiểm tra danh sách recommended tour", "1. Cuộn tới recommended section", "Có dữ liệu tour", "Card tour đồng nhất, ảnh và giá không tràn"),
        gui("Kiểm tra responsive dashboard traveler", "1. Thu nhỏ viewport", "Dashboard đã tải", "Các card xếp lại hợp lý, không chồng chữ"),
    ],
    "TOUR_LIST_PAGE": [
        gui("Kiểm tra thanh search/filter/sort của Tour List", "1. Mở tour list", "Có dữ liệu tour", "Search box, filter và sort nằm đúng vị trí, dễ thao tác"),
        gui("Kiểm tra card tour trong danh sách", "1. Quan sát nhiều card tour", "Tour list đã tải", "Ảnh, tên, rating, giá và CTA hiển thị nhất quán"),
        gui("Kiểm tra skeleton/loading của Tour List", "1. Reload trang", "Mạng chậm giả lập", "Skeleton hiện đúng số khối và không nhấp nháy lỗi"),
        gui("Kiểm tra empty state khi không có kết quả", "1. Tìm kiếm từ khóa không khớp", "Tour list đã tải", "Hiển thị empty state rõ ràng và có gợi ý thao tác tiếp"),
    ],
    "TOUR_DETAIL_PAGE": [
        gui("Kiểm tra gallery ảnh và hero tour detail", "1. Mở tour detail", "Tour tồn tại", "Ảnh chính, thumbnail, tiêu đề, rating và price hiển thị đúng bố cục"),
        gui("Kiểm tra booking widget bên phải", "1. Quan sát khu vực booking", "Tour detail đã tải", "Traveler counters, schedule select, private state và nút confirm hiển thị rõ"),
        gui("Kiểm tra guide card và itinerary section", "1. Cuộn qua detail", "Tour có guide và itinerary", "Guide card, timeline itinerary và service blocks căn chỉnh đúng"),
        gui("Kiểm tra trạng thái disabled của CTA khi tour không khả dụng", "1. Mở tour proposal hết hạn", "Tour proposal inactive/rejected", "Nút Confirm Booking bị disable và có note giải thích"),
    ],
    "AI_PLANNER_PAGE": [
        gui("Kiểm tra sidebar nhập dữ liệu planner", "1. Mở AI planner", "Traveler đã đăng nhập", "Các control destination, ngày, quantity, budget hiển thị đủ và dễ nhập"),
        gui("Kiểm tra phần result header và itinerary render", "1. Generate kế hoạch", "Có dữ liệu generate thành công", "Header kết quả, chip trạng thái và các ngày itinerary render rõ ràng"),
        gui("Kiểm tra trạng thái loading khi generate", "1. Bấm Generate", "Mô phỏng API chậm", "Nút và vùng kết quả hiển thị loading, không cho bấm lặp"),
        gui("Kiểm tra hành động Save Trip / Send to Providers", "1. Generate xong", "Có itinerary thành công", "Các nút action hiển thị đúng ngữ cảnh trước/sau khi lưu"),
    ],
    "AI_HISTORY_PAGE": [
        gui("Kiểm tra layout list-detail của AI Tour History", "1. Mở trang history", "Traveler có lịch sử AI", "Panel trái danh sách và panel phải chi tiết hiển thị cân đối"),
        gui("Kiểm tra card trạng thái trong danh sách history", "1. Quan sát item DRAFT/PUBLISHED/APPROVED/EXPIRED", "Có nhiều trạng thái", "Badge trạng thái phân biệt rõ và không tràn"),
        gui("Kiểm tra panel proposal trong detail", "1. Chọn item có proposal", "Request đã có proposal", "Khối proposal hiển thị rõ tình trạng, CTA và ghi chú thời hạn"),
        gui("Kiểm tra empty state của AI History", "1. Mở bằng tài khoản chưa có trip", "Không có dữ liệu history", "Hiển thị empty state hợp lý cùng CTA quay lại planner"),
    ],
    "MY_BOOKING_PAGE": [
        gui("Kiểm tra bảng booking và header stats", "1. Mở My Booking", "Traveler có booking", "Header stats, bảng booking và action bar hiển thị rõ ràng"),
        gui("Kiểm tra badge trạng thái trong bảng booking", "1. Quan sát booking nhiều trạng thái", "Có dữ liệu đa trạng thái", "Badge payment/status phân biệt màu hợp lý"),
        gui("Kiểm tra nhóm nút Pay/Review/Cancel", "1. Quan sát từng dòng booking", "Có booking ở nhiều trạng thái", "Chỉ các action hợp lệ mới hiển thị và không vỡ cột"),
        gui("Kiểm tra empty state khi chưa có booking", "1. Mở bằng tài khoản chưa đặt tour", "Không có booking", "Hiển thị empty state và CTA phù hợp"),
    ],
    "PROVIDER_DASHBOARD": [
        gui("Kiểm tra các card KPI dashboard provider", "1. Mở dashboard provider", "Provider đã đăng nhập", "Card booking, revenue, AI request hiển thị đều và dễ đọc"),
        gui("Kiểm tra biểu đồ revenue", "1. Quan sát chart doanh thu", "Dashboard đã tải", "Biểu đồ không vỡ layout, có nhãn trục và tooltip/legend hợp lý"),
        gui("Kiểm tra khối recent activity", "1. Cuộn xuống phần activity", "Có dữ liệu hoạt động", "Danh sách gần đây căn chỉnh gọn, thông tin không tràn"),
    ],
    "MANAGE_TOURS_PAGE": [
        gui("Kiểm tra hero và stats của Manage Tours", "1. Mở manage tours", "Provider đã đăng nhập", "Hero, stats cards và action create tour hiển thị rõ"),
        gui("Kiểm tra bảng quản lý tour", "1. Quan sát table danh sách tour", "Có dữ liệu tour", "Cột tên tour, booking status, guide/schedule/action căn chỉnh đúng"),
        gui("Kiểm tra dialog create/edit tour", "1. Mở create hoặc edit dialog", "Trang có quyền mở dialog", "Form tour, editor itinerary và nút save hiển thị đầy đủ"),
        gui("Kiểm tra skeleton/loading của bảng tour", "1. Reload trang", "Mạng chậm giả lập", "Skeleton của bảng hiển thị đúng cấu trúc"),
    ],
    "TOUR_SCHEDULE_PAGE": [
        gui("Kiểm tra bảng schedule và badge trạng thái", "1. Mở trang tour schedule", "Tour đã có schedule", "Bảng hiển thị ngày, guide, slot, private status rõ ràng"),
        gui("Kiểm tra dialog add/edit schedule", "1. Mở dialog schedule", "Provider có quyền sửa", "Calendar, select guide, switch private và trường slot hiển thị đúng"),
        gui("Kiểm tra disabled state của ngày quá khứ", "1. Mở calendar", "Dialog schedule đã mở", "Ngày quá khứ bị disable trực quan"),
        gui("Kiểm tra lock state của private schedule proposal", "1. Mở schedule tour proposal", "Tour là private proposal", "Switch private bị khóa và có ghi chú"),
    ],
    "SERVICE_MGMT_PAGE": [
        gui("Kiểm tra lưới card service và filter", "1. Mở service management", "Provider có service", "Service cards, filter type/search và nút create hiển thị gọn"),
        gui("Kiểm tra dialog create/edit service", "1. Mở dialog", "Provider có quyền thao tác", "Các trường name, type, address, alias, price và upload ảnh hiển thị đủ"),
        gui("Kiểm tra preview ảnh / upload state", "1. Chọn ảnh cho service", "Dialog service đã mở", "Ảnh preview và trạng thái upload hiển thị đúng"),
        gui("Kiểm tra dialog delete service", "1. Bấm delete ở một service", "Service tồn tại", "Dialog confirm hiển thị rõ service mục tiêu"),
    ],
    "GUIDE_MGMT_PAGE": [
        gui("Kiểm tra bảng danh sách guide", "1. Mở guide management", "Provider có guide", "Bảng hiển thị avatar, tên, contact, specialty, trạng thái và action rõ ràng"),
        gui("Kiểm tra dialog create/edit guide", "1. Mở dialog guide", "Provider có quyền thao tác", "Trường thông tin, trạng thái và nút lưu hiển thị đầy đủ"),
        gui("Kiểm tra badge active/inactive của guide", "1. Quan sát danh sách guide", "Có guide ở nhiều trạng thái", "Badge trạng thái dễ phân biệt"),
        gui("Kiểm tra confirm delete guide", "1. Bấm delete guide", "Guide tồn tại", "Dialog xác nhận hiển thị đúng guide cần xóa"),
    ],
    "PROVIDER_BOOK_PAGE": [
        gui("Kiểm tra bảng booking của provider", "1. Mở bookings management", "Provider có booking", "Các cột traveler, tour, guide, ngày đi, payment và status hiển thị cân đối"),
        gui("Kiểm tra filter tabs/status chips", "1. Bấm các filter", "Danh sách đã tải", "Tabs/filter đổi trạng thái active rõ ràng"),
        gui("Kiểm tra badge payment và booking status", "1. Quan sát nhiều booking", "Có đủ trạng thái", "Badge màu và text nhất quán, không tràn ô"),
        gui("Kiểm tra empty state khi chưa có booking", "1. Mở bằng provider mới", "Chưa có booking", "Hiển thị empty state rõ ràng"),
    ],
    "AI_REQUEST_DETAIL": [
        gui("Kiểm tra header request detail và countdown", "1. Mở AI request detail", "Provider đã claim hoặc xem request", "Header hiển thị traveler info, trạng thái request và countdown rõ ràng"),
        gui("Kiểm tra danh sách required services", "1. Cuộn qua khối service", "Request có service cần xử lý", "Các item missing/match/price mismatch hiển thị riêng biệt, dễ nhìn"),
        gui("Kiểm tra nút Use existing / Create service / sync price", "1. Quan sát từng item service", "Có item ở nhiều trạng thái", "Nút hành động đúng từng case và không chồng lấp"),
        gui("Kiểm tra CTA Create Tour Proposal", "1. Quan sát cuối trang", "Request detail đã tải", "Nút proposal chỉ enable khi đủ điều kiện và có trạng thái loading khi bấm"),
    ],
    "TRACKING_MGMT_PAGE": [
        gui("Kiểm tra card/link tracking của traveler", "1. Mở tracking management", "Traveler có booking CONFIRMED", "Mỗi card có tracking code, link, QR/action rõ ràng"),
        gui("Kiểm tra badge trạng thái khả dụng của link", "1. Quan sát card tracking", "Có link còn hiệu lực", "Badge active/private/public hiển thị hợp lý"),
        gui("Kiểm tra khu vực copy/regenerate action", "1. Bấm các action trên card", "Card tracking đang hiển thị", "Nút thao tác phản hồi trực quan, không vỡ layout"),
    ],
    "TOUR_TRACKING_PAGE": [
        gui("Kiểm tra tổng quan tracking và start date", "1. Mở tour tracking", "Booking có tracking", "Header/overview hiển thị tour name, start date và status rõ ràng"),
        gui("Kiểm tra timeline itinerary section", "1. Cuộn timeline", "Có itinerary tracking", "Các mốc thời gian, trạng thái và note hiển thị đúng trật tự"),
        gui("Kiểm tra map section trong traveler tracking", "1. Quan sát map", "Có dữ liệu vị trí", "Map render đủ khung nhìn, không có control che nội dung"),
        gui("Kiểm tra style card theo trạng thái", "1. So sánh item pending/in progress/complete", "Timeline có đủ trạng thái", "Visual phân biệt rõ giữa các trạng thái"),
    ],
    "PUBLIC_TRACK_PAGE": [
        gui("Kiểm tra hero card public tracking", "1. Mở public tracking", "Có trackingCode hợp lệ", "Hero card hiển thị tên tour, trạng thái và update gần nhất rõ ràng"),
        gui("Kiểm tra latest update banner", "1. Quan sát banner đầu trang", "Có dữ liệu cập nhật", "Banner hiển thị gọn, không che phần map"),
        gui("Kiểm tra activity timeline public", "1. Cuộn timeline", "Public tracking đã tải", "Các mốc hoàn thành/chưa hoàn thành hiển thị dễ theo dõi"),
        gui("Kiểm tra trạng thái expired của guest page", "1. Mở tracking code hết hạn", "Code không còn hiệu lực", "Trang hiển thị expired state rõ ràng, không lộ dữ liệu thừa"),
    ],
    "BOOKING_SUCCESS_PAGE": [
        gui("Kiểm tra confirmation card của booking success", "1. Mở booking success", "Booking đã PAID", "Card xác nhận hiển thị icon, trạng thái thành công và thông tin chính rõ ràng"),
        gui("Kiểm tra details card và sidebar", "1. Quan sát bố cục trang", "Booking success đã tải", "Detail card, sidebar và tracking card sắp xếp cân đối"),
        gui("Kiểm tra khối QR + link chia sẻ", "1. Quan sát vùng tracking card", "Có tracking code", "QR, input link, nút copy/open hiển thị đầy đủ, dễ thao tác"),
    ],
    "GUIDE_LIVE_TRACK": [
        gui("Kiểm tra layout sidebar + timeline live tracking", "1. Mở guide live tracking", "Guide có tour đang diễn ra", "Sidebar, timeline và footer actions hiển thị rõ ràng"),
        gui("Kiểm tra visual state của nút Start/Mark done/Delay/Note", "1. Quan sát một item timeline", "Timeline đã tải", "Các nút action enable/disable đúng theo trạng thái điểm dừng"),
        gui("Kiểm tra card timeline đang in-progress", "1. Chọn item đang chạy", "Có item IN_PROGRESS", "Badge, màu nền và icon phản ánh đúng trạng thái"),
        gui("Kiểm tra item pending/complete bị làm mờ", "1. Quan sát nhiều item", "Timeline có pending và complete", "Hai trạng thái này mờ hơn item hiện tại nhưng vẫn đọc được"),
    ],
    "ASSIGNED_TOURS_PAGE": [
        gui("Kiểm tra card/list assigned tours", "1. Mở assigned tours", "Guide có dữ liệu tour", "Card hiển thị tour name, ngày đi, số khách, trạng thái và CTA rõ ràng"),
        gui("Kiểm tra phân biệt tour sắp tới/đang diễn ra", "1. Quan sát nhiều card", "Có nhiều trạng thái tour", "Badge trạng thái giúp nhận diện nhanh"),
        gui("Kiểm tra empty state của assigned tours", "1. Mở bằng guide chưa có tour", "Không có dữ liệu", "Hiển thị empty state phù hợp"),
    ],
    "REVIEW_PAGE": [
        gui("Kiểm tra form review và rating controls", "1. Mở trang review", "Booking đủ điều kiện review", "Star rating, textarea và card gợi ý hiển thị đủ"),
        gui("Kiểm tra tour summary card", "1. Quan sát phần summary", "Trang review đã tải", "Tên tour, guide, ngày đi và ảnh hiển thị đúng"),
        gui("Kiểm tra trạng thái submit form review", "1. Điền review\n2. Submit", "Form hợp lệ", "Nút submit loading đúng và không cho bấm lặp"),
        gui("Kiểm tra hiển thị validate khi thiếu rating/nội dung", "1. Submit form thiếu dữ liệu", "Trang review đã mở", "Validate hiển thị ở đúng vị trí"),
    ],
    "ADMIN_DASHBOARD_PAGE": [
        gui("Kiểm tra dàn card KPI admin", "1. Mở admin dashboard", "Admin đã đăng nhập", "Cards users/providers/bookings/revenue hiển thị ngay ngắn"),
        gui("Kiểm tra activity feed và system health", "1. Cuộn dashboard", "Có dữ liệu hoạt động", "Hai section hiển thị cân đối, dễ quét"),
        gui("Kiểm tra responsive admin dashboard", "1. Thu nhỏ viewport", "Trang đã tải", "Cards và list không vỡ bố cục"),
    ],
    "ADMIN_ANALYTICS_PAGE": [
        gui("Kiểm tra layout analytics admin theo component", "1. Mở admin analytics", "Admin có quyền truy cập", "Các widget, chart, table được chia component rõ và căn đều"),
        gui("Kiểm tra khối dữ liệu tĩnh của KPI cards", "1. Quan sát hàng KPI", "Trang đã tải", "Cards đồng nhất chiều cao, text không tràn"),
        gui("Kiểm tra chart/tables trong analytics admin", "1. Cuộn toàn trang", "Trang đã tải", "Chart, table, legend và empty slot hiển thị ổn định"),
    ],
    "PROVIDER_ANALYTICS_PAGE": [
        gui("Kiểm tra layout analytics provider theo shadcn", "1. Mở provider analytics", "Provider đã đăng nhập", "Cards, chart, table theo cùng hệ component, không lệch style"),
        gui("Kiểm tra khối KPI doanh thu/booking", "1. Quan sát hàng card đầu", "Trang đã tải", "Số liệu tĩnh hiển thị cân đối, dễ quét"),
        gui("Kiểm tra section chart/detail ở provider analytics", "1. Cuộn qua các section", "Trang đã tải", "Các khối dữ liệu không lặp layout cứng nhắc và không tràn nội dung"),
    ],
    "HEADER_SEARCH_PAGE": [
        gui("Kiểm tra bell dropdown trên header", "1. Bấm chuông thông báo", "User có notification", "Dropdown neo đúng vị trí, item không tràn và có trạng thái unread"),
        gui("Kiểm tra avatar dropdown", "1. Bấm avatar", "User đã đăng nhập", "Menu profile/logout hiển thị đúng role và đóng/mở mượt"),
        gui("Kiểm tra search input trên header", "1. Focus vào search", "Header có search", "Input, placeholder và icon search hiển thị đúng"),
        gui("Kiểm tra breadcrumb/title theo route", "1. Điều hướng qua nhiều trang", "App hoạt động bình thường", "Header đổi title/breadcrumb phù hợp từng page"),
    ],
    "CHATBOT_PAGE": [
        gui("Kiểm tra giao diện chat widget ở landing page", "1. Mở landing page\n2. Mở chat widget", "Trang chủ tải thành công", "Popup chat có header, vùng message, gợi ý câu hỏi và ô nhập hiển thị cân đối"),
        gui("Kiểm tra vùng message cuộn độc lập", "1. Gửi nhiều tin nhắn hoặc cuộn lịch sử", "Chat widget đã mở", "Chỉ vùng nội dung chat cuộn, input không bị đẩy khỏi khung"),
        gui("Kiểm tra quick suggestion chips", "1. Quan sát và bấm các câu gợi ý", "Chatbot hiển thị gợi ý ban đầu", "Chip gợi ý hiển thị rõ, bấm vào sẽ đổ câu hỏi đúng"),
        gui("Kiểm tra banner hết lượt hỏi miễn phí", "1. Dùng hết số lượt guest", "Guest chưa đăng nhập", "Banner cảnh báo màu sắc rõ ràng, có link đăng nhập và không che ô nhập"),
        gui("Kiểm tra trạng thái typing/loading của chatbot", "1. Gửi một câu hỏi", "API chatbot phản hồi chậm", "Bubble loading/typing hiển thị hợp lý và biến mất sau khi có trả lời"),
    ],
}


for sprint in SPRINTS:
    for module in sprint.modules:
        module.gui_cases = CUSTOM_GUI_CASES.get(module.module_code, [])


def main():
    for sprint in SPRINTS:
        write_workbook(sprint)


if __name__ == "__main__":
    main()

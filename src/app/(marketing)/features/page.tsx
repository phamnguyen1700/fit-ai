// # /features
export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật của Fit AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá những tính năng độc đáo giúp bạn đạt được mục tiêu fitness một cách hiệu quả nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              AI Tư vấn cá nhân
            </h3>
            <p className="text-gray-600 mb-4">
              Trí tuệ nhân tạo phân tích thể trạng và đưa ra chương trình tập luyện phù hợp với từng cá nhân.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Phân tích thể trạng chính xác</li>
              <li>• Chương trình cá nhân hóa</li>
              <li>• Theo dõi tiến độ thông minh</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Theo dõi thông minh
            </h3>
            <p className="text-gray-600 mb-4">
              Ghi nhận và phân tích mọi hoạt động tập luyện của bạn một cách chính xác và chi tiết.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Ghi nhận bài tập tự động</li>
              <li>• Phân tích hiệu quả tập luyện</li>
              <li>• Báo cáo chi tiết hàng tuần</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Cộng đồng động viên
            </h3>
            <p className="text-gray-600 mb-4">
              Kết nối với bạn bè và chia sẻ thành tích để cùng nhau tiến bộ và động viên lẫn nhau.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Chia sẻ thành tích</li>
              <li>• Thách thức bạn bè</li>
              <li>• Động viên lẫn nhau</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">🥗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Chế độ dinh dưỡng
            </h3>
            <p className="text-gray-600 mb-4">
              Tư vấn chế độ ăn uống khoa học và cân bằng để đạt được mục tiêu fitness của bạn.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Thực đơn cá nhân hóa</li>
              <li>• Tính toán calo chính xác</li>
              <li>• Lời khuyên dinh dưỡng</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Đa nền tảng
            </h3>
            <p className="text-gray-600 mb-4">
              Sử dụng Fit AI trên mọi thiết bị - điện thoại, tablet, máy tính để bàn.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Đồng bộ đa thiết bị</li>
              <li>• Giao diện thân thiện</li>
              <li>• Hoạt động offline</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Bảo mật cao
            </h3>
            <p className="text-gray-600 mb-4">
              Dữ liệu cá nhân của bạn được bảo vệ với công nghệ mã hóa tiên tiến nhất.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Mã hóa end-to-end</li>
              <li>• Tuân thủ GDPR</li>
              <li>• Bảo mật tuyệt đối</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

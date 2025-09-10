// # /download
export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tải xuống Fit AI ngay hôm nay
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trải nghiệm sức mạnh của AI trong fitness trên mọi thiết bị của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Download Options */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">iOS</h3>
                  <p className="text-gray-600">Tải cho iPhone và iPad</p>
                </div>
              </div>
              <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Tải từ App Store
              </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Android</h3>
                  <p className="text-gray-600">Tải cho điện thoại Android</p>
                </div>
              </div>
              <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                Tải từ Google Play
              </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2,3H22A1,1 0 0,1 23,4V20A1,1 0 0,1 22,21H2A1,1 0 0,1 1,20V4A1,1 0 0,1 2,3M3,5V19H21V5H3M5,7H19V9H5V7M5,11H19V13H5V11M5,15H19V17H5V15Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Web App</h3>
                  <p className="text-gray-600">Sử dụng trên trình duyệt</p>
                </div>
              </div>
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Mở Web App
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tại sao chọn Fit AI?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Thông minh
                  </h3>
                  <p className="text-gray-600">
                    Sử dụng trí tuệ nhân tạo để phân tích và đưa ra lời khuyên tập luyện phù hợp nhất với bạn.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Theo dõi chính xác
                  </h3>
                  <p className="text-gray-600">
                    Ghi nhận và phân tích mọi hoạt động tập luyện với độ chính xác cao.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cộng đồng tích cực
                  </h3>
                  <p className="text-gray-600">
                    Tham gia cộng đồng fitness lớn nhất Việt Nam và cùng nhau tiến bộ.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Đa nền tảng
                  </h3>
                  <p className="text-gray-600">
                    Sử dụng trên mọi thiết bị với đồng bộ dữ liệu tự động.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-20 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Yêu cầu hệ thống
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">iOS</h4>
              <ul className="text-gray-600 space-y-1">
                <li>iOS 14.0 trở lên</li>
                <li>iPhone 8 trở lên</li>
                <li>iPad Air 2 trở lên</li>
                <li>Dung lượng: 200MB</li>
              </ul>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Android</h4>
              <ul className="text-gray-600 space-y-1">
                <li>Android 8.0 trở lên</li>
                <li>RAM: 2GB trở lên</li>
                <li>Bộ nhớ: 200MB</li>
                <li>Kết nối Internet</li>
              </ul>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Web</h4>
              <ul className="text-gray-600 space-y-1">
                <li>Chrome 90+</li>
                <li>Firefox 88+</li>
                <li>Safari 14+</li>
                <li>Edge 90+</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFF7EF] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Nội dung chính của Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Hỗ trợ */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  Trung tâm hỗ trợ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Điều hướng */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Điều hướng
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  Tính năng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  Bảng giá
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  Tải xuống
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Kết nối */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Kết nối
            </h3>
            <ul className="space-y-3 text-gray-800">
              <li>
                Website:{" "}
                <a
                  href="mailto:support@fitai.vn"
                  className="text-gray-800 font-normal"
                >
                  support@fitai.vn
                </a>
              </li>
              <li>
                Liên hệ:{" "}
                <a href="tel:0123456789" className="text-gray-800 font-normal">
                  0123 456 789
                </a>
              </li>
              <li>
                Địa chỉ: 123 Lê Lợi, Quận 1, thành phố Hồ Chí Minh
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:fitaik18@gmail.com"
                  className="text-gray-800 font-normal"
                >
                  fitaik18@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Gạch ngang */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo */}
            <div className="flex flex-col leading-tight">
  <span
    className="text-xl font-bold"
    style={{ color: 'var(--text)' }}
  >
    AI Planning
  </span>
  <span
    className="text-2xl font-bold -mt-1"
    style={{ color: 'var(--primary)' }}
  >
    FIT
  </span>
</div>


            {/* Copyright */}
            <div className="text-gray-500 text-sm text-center md:text-right">
              Copyright © 2025 Fit AI Planning. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

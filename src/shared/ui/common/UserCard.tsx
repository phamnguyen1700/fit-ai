import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "../core/Card";
import { Avatar } from "../core/Avatar";
import { Flex } from "../core/Flex";
import { Dropdown, Tag, App } from "antd";
import type { MenuProps } from "antd";
import { Icon } from "../../ui/icon";
import { useUpdateUserStatusMutation } from "@/tanstack/hooks/users";

export interface UserCardProps {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  datetime: string;
  planLabel: string;
  amountLabel: string;
  statusLabel: string;
  isActive?: boolean;
  onMenuClick?: (key: string, userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  email,
  avatarUrl,
  datetime,
  planLabel,
  amountLabel,
  statusLabel,
  isActive,
  onMenuClick,
}) => {
  const router = useRouter();
  const updateUserStatusMutation = useUpdateUserStatusMutation();
  const { modal } = App.useApp();

  const handleToggleUserStatus = (userId: string) => {
    console.log("Toggling user status for ID:", userId);
    console.log("Modal function available:", typeof modal.confirm);
    const action = isActive ? "vô hiệu hóa" : "kích hoạt";
    
    console.log("About to show modal confirm...");
    modal.confirm({
      title: `Xác nhận ${action} người dùng`,
      content: `Bạn có chắc chắn muốn ${action} người dùng "${name}"?`,
      okText: action === "vô hiệu hóa" ? "Vô hiệu hóa" : "Kích hoạt",
      cancelText: "Hủy",
      okButtonProps: {
        danger: action === "vô hiệu hóa",
        loading: updateUserStatusMutation.isPending,
        type: action === "vô hiệu hóa" ? "primary" : "primary",
        style:
          action === "kích hoạt"
            ? {
                backgroundColor: "var(--primary)",
                borderColor: "var(--primary)",
                color: "white",
              }
            : undefined,
      },
      onOk: () => {
        console.log("Modal OK clicked");
        updateUserStatusMutation.mutate(userId);
      },
      onCancel: () => {
        console.log("Modal cancelled");
      },
    });
    console.log("Modal.confirm() called");
  };

  const handleMenuClick = (key: string) => {
    const userId = id || "1"; // fallback nếu không có id

    switch (key) {
      case "detail":
        router.push(`/admin/users/${userId}`);
        break;
      case "edit":
        // TODO: Implement edit functionality
        console.log("Edit user:", userId);
        break;
      case "toggle-status":
        handleToggleUserStatus(userId);
        console.log("Toggle user status:", userId);
        break;
      case "pin":
        // TODO: Implement pin functionality
        console.log("Pin user:", userId);
        break;
      default:
        break;
    }

    // Gọi callback nếu có
    onMenuClick?.(key, userId);
  };

  const items: MenuProps["items"] = [
    { key: "pin", label: "Ghim" },
    {
      key: "toggle-status",
      label: isActive ? "Vô hiệu hóa người dùng" : "Kích hoạt người dùng",
    },
    { key: "detail", label: "Xem chi tiết" },
    { key: "edit", label: "Chỉnh sửa" },
  ];

  return (
    <Card className="user-card" style={{ borderRadius: 12 }}>
      <div className="flex flex-col gap-4">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={12}>
            <Avatar size={48} src={avatarUrl}>
              {name?.[0]}
            </Avatar>
            <div>
              <div style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                <Flex align="center" gap={8}>
                  {name}
                  {isActive !== undefined && (
                    <Tag
                      color={isActive ? "success" : "default"}
                      style={{ fontSize: "12px" }}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </Tag>
                  )}
                </Flex>
              </div>
              <div style={{ color: "var(--text-secondary)" }}>{email}</div>
            </div>
          </Flex>
          <Flex align="center" gap={8}>
            <div style={{ color: "var(--text-secondary)" }}>{datetime}</div>
            <Dropdown
              trigger={["click"]}
              menu={{ items, onClick: (info) => handleMenuClick(info.key) }}
            >
              <button className="user-filter-more h-6 w-6 grid place-items-center rounded-md border border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
                <Icon name="mdi:dots-vertical" />
              </button>
            </Dropdown>
          </Flex>
        </Flex>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
          <div style={{ color: "var(--text-secondary)" }}>Ngày/Giờ:</div>
          <div
            className="md:col-span-3 text-right"
            style={{ color: "var(--text-secondary)" }}
          >
            {datetime}
          </div>

          <div style={{ color: "var(--text-secondary)" }}>Gói dịch vụ:</div>
          <div
            className="md:col-span-3 text-right"
            style={{ color: "#fa8c16", fontWeight: 600 }}
          >
            {planLabel}
          </div>

          <div style={{ color: "var(--text-secondary)" }}>Số tiền:</div>
          <div
            className="md:col-span-3 text-right"
            style={{ color: "var( --success)", fontWeight: 600 }}
          >
            {amountLabel}
          </div>

          <div style={{ color: "var(--text-secondary)" }}>Trạng thái:</div>
          <div
            className="md:col-span-3 text-right"
            style={{ color: "var(--success)", fontWeight: 600 }}
          >
            {statusLabel}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;

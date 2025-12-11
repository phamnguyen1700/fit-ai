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
  name?: string;
  email: string;
  avatarUrl?: string;
  datetime?: string;
  planLabel?: string;
  amountLabel?: string;
  statusLabel?: string;
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
    <Card 
      className="user-card" 
      style={{ 
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid var(--border)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex flex-col gap-5" style={{ padding: '20px' }}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={16}>
            <Avatar 
              size={56} 
              src={avatarUrl}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '2px solid var(--border)',
              }}
            >
              {name?.[0] || email?.[0]?.toUpperCase()}
            </Avatar>
            <div className="flex flex-col gap-1">
              {name && (
                <div style={{ 
                  color: "var(--text)", 
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}>
                  <Flex align="center" gap={8}>
                    {name}
                    {isActive !== undefined && (
                      <Tag
                        color={isActive ? "success" : "default"}
                        style={{ 
                          fontSize: "11px",
                          padding: '2px 8px',
                          borderRadius: '4px',
                          margin: 0,
                          border: 'none'
                        }}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Tag>
                    )}
                  </Flex>
                </div>
              )}
              <div style={{ 
                color: "var(--text-secondary)", 
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {email}
              </div>
              {!name && isActive !== undefined && (
                <Tag
                  color={isActive ? "success" : "default"}
                  style={{ 
                    fontSize: "11px",
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginTop: "4px",
                    width: 'fit-content',
                    border: 'none'
                  }}
                >
                  {isActive ? "Active" : "Inactive"}
                </Tag>
              )}
            </div>
          </Flex>
          <Flex align="center" gap={12}>
            {datetime && (
              <div style={{ 
                color: "var(--text-tertiary)", 
                fontSize: '13px'
              }}>
                {datetime}
              </div>
            )}
            <Dropdown
              trigger={["click"]}
              menu={{ items, onClick: (info) => handleMenuClick(info.key) }}
            >
              <button 
                className="user-filter-more h-8 w-8 grid place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
                style={{
                  cursor: 'pointer',
                }}
              >
                <Icon name="mdi:dots-vertical" />
              </button>
            </Dropdown>
          </Flex>
        </Flex>

        {(datetime || planLabel || amountLabel || statusLabel) && (
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3"
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--border)'
            }}
          >
            {datetime && (
              <>
                <div style={{ 
                  color: "var(--text-tertiary)", 
                  fontSize: '13px'
                }}>
                  Ngày/Giờ:
                </div>
                <div
                  className="md:col-span-3 text-right"
                  style={{ 
                    color: "var(--text-secondary)",
                    fontSize: '13px'
                  }}
                >
                  {datetime}
                </div>
              </>
            )}

            {planLabel && (
              <>
                <div style={{ 
                  color: "var(--text-tertiary)", 
                  fontSize: '13px'
                }}>
                  Gói dịch vụ:
                </div>
                <div
                  className="md:col-span-3 text-right"
                  style={{ 
                    color: "#fa8c16", 
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  {planLabel}
                </div>
              </>
            )}

            {amountLabel && (
              <>
                <div style={{ 
                  color: "var(--text-tertiary)", 
                  fontSize: '13px'
                }}>
                  Số tiền:
                </div>
                <div
                  className="md:col-span-3 text-right"
                  style={{ 
                    color: "var(--success)", 
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  {amountLabel}
                </div>
              </>
            )}

            {statusLabel && (
              <>
                <div style={{ 
                  color: "var(--text-tertiary)", 
                  fontSize: '13px'
                }}>
                  Trạng thái:
                </div>
                <div
                  className="md:col-span-3 text-right"
                  style={{ 
                    color: "var(--success)", 
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  {statusLabel}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserCard;

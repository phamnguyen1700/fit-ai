'use client';

import React from 'react';
import { Card, Input, Button, Flex } from '@/shared/ui';
import { Icon, icons } from '@/shared/ui/icon';
import { Form, Divider } from 'antd';
import { useChangeAdvisorPassword } from '@/tanstack/hooks/advisor';
import { useAuthStore } from '@/stores/stores';
import toast from 'react-hot-toast';

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const ChangePasswordForm: React.FC = () => {
    const { user } = useAuthStore();
    const advisorId = user?.id;
    const [passwordForm] = Form.useForm();
    const changePassword = useChangeAdvisorPassword();

    const handlePasswordChange = async (values: PasswordFormData) => {
        if (!advisorId) {
            toast.error('Không tìm thấy thông tin advisor');
            return;
        }

        if (values.newPassword !== values.confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        if (values.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        changePassword.mutate(
            {
                advisorId,
                data: {
                    oldPassword: values.currentPassword,
                    newPassword: values.newPassword,
                },
            },
            {
                onSuccess: () => {
                    passwordForm.resetFields();
                },
            }
        );
    };

    return (
        <div className="h-full">
            <div className="mb-4">
                <Flex align="center" gap={8}>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                        <Icon name={icons.password} size={18} className="text-[var(--primary)]" />
                    </div>
                    <span className="text-lg font-semibold">Đổi mật khẩu</span>
                </Flex>
            </div>
            <Card className="h-full shadow-sm">
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                >
                <Form.Item
                    name="currentPassword"
                    label={<span className="text-sm font-medium">Mật khẩu hiện tại</span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
                    ]}
                    className="mb-6"
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu hiện tại"
                        prefix={<Icon name={icons.password} size={16} className="text-[var(--text-secondary)]" />}
                        size="large"
                        className="h-11"
                    />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={<span className="text-sm font-medium">Mật khẩu mới</span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                    ]}
                    className="mb-6"
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu mới"
                        prefix={<Icon name={icons.password} size={16} className="text-[var(--text-secondary)]" />}
                        size="large"
                        className="h-11"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label={<span className="text-sm font-medium">Xác nhận mật khẩu mới</span>}
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                            },
                        }),
                    ]}
                    className="mb-6"
                >
                    <Input.Password
                        placeholder="Nhập lại mật khẩu mới"
                        prefix={<Icon name={icons.password} size={16} className="text-[var(--text-secondary)]" />}
                        size="large"
                        className="h-11"
                    />
                </Form.Item>

                <Divider className="my-5" />

                <Form.Item className="mb-0">
                    <Button
                        variant="primary"
                        htmlType="submit"
                        loading={changePassword.isPending}
                        size="lg"
                        block
                        className="font-semibold h-11 shadow-sm hover:shadow-md transition-shadow"
                    >
                        {changePassword.isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </Button>
                </Form.Item>

                <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)] text-center mt-5 pt-4 border-t border-[var(--border)]">
                    <Icon name="mdi:information-outline" size={14} />
                    <span>Mật khẩu phải có ít nhất 6 ký tự</span>
                </div>
                </Form>
            </Card>
        </div>
    );
};

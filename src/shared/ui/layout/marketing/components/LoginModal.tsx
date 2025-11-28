import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/core/Modal';
import { Tabs } from '@/shared/ui/core/Tabs';
import { Carousel } from 'antd';
import { Form, Checkbox, Radio } from 'antd';
import { Input } from '@/shared/ui/core/Input';
import { Button } from '@/shared/ui/core/Button';
import { useLoginMutation, useAdvisorLoginMutation } from '@/tanstack/hooks/auth';
import { useRegisterMutation } from '@/tanstack/hooks/users';
import { Icon } from '@/shared/ui/icon';
import { Row, Col } from '@/shared/ui/core/Grid';
import { useRouter } from 'next/navigation';
import { APIError } from '@/types/utils/APIError';

const carouselSlides = [
  {
    id: 1,
    title: 'AI Planing',
    accent: '—',
    bigTitle: 'FIT',
    subtitle: '',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 2,
    title: 'Smart Training',
    accent: '—',
    bigTitle: 'PERFOM',
    subtitle: '',
    description:
      'Plan and track workouts smartly with adaptive AI suggestions tailored to your progress and goals.',
  },
  {
    id: 3,
    title: 'Nutrition Guide',
    accent: '—',
    bigTitle: 'EAT',
    subtitle: '',
    description:
      'Personalized meal planning that adapts to your activity level and preferences — simple, healthy and effective.',
  },
];

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role?: 'admin' | 'advisor';
};

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeKey, setActiveKey] = useState<'login' | 'register'>('login');
  const [loginError, setLoginError] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');
  const { mutate: adminLoginMutate, isPending: isAdminLoginPending } = useLoginMutation();
  const { mutate: advisorLoginMutate, isPending: isAdvisorLoginPending } = useAdvisorLoginMutation();
  const { mutate: registerMutate, isPending: isRegisterPending } = useRegisterMutation();
  const router = useRouter()
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const isLoginPending = isAdminLoginPending || isAdvisorLoginPending;

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      loginForm.resetFields();
    }
  }, [isOpen, loginForm]);

  const handleLoginFinish = (values: { email: string; password: string; userRole?: 'admin' | 'advisor' }) => {
    setLoginError('');
    
    console.log('=== Login Submit ===');
    console.log('All form values:', values);
    console.log('userRole value:', values.userRole);
    console.log('userRole type:', typeof values.userRole);
    
    // Kiểm tra nếu người dùng chưa chọn role
    if (!values.userRole) {
      console.log('ERROR: No role selected');
      setLoginError('Vui lòng chọn vai trò');
      return;
    }
    
    const selectedRole = values.userRole;
    
    console.log('Selected role:', selectedRole);
    console.log('Is advisor?', selectedRole === 'advisor');
    
    if (selectedRole === 'advisor') {
      console.log('Calling advisor login API...');
      advisorLoginMutate({ email: values.email, password: values.password }, {
        onSuccess: (response) => {
          if (response.success && response.data) {
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token);
            }
            onClose()
            router.push('/advisor/customers')
          } else if (response.success === false && response.data === undefined && response.message) {
            setLoginError(response.message);
          }
        },
        onError: (error: unknown) => {
          const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Đăng nhập thất bại';
          setLoginError(errorMessage);
        }
      })
    } else {
      // Admin login
      console.log('Calling admin login API...');
      adminLoginMutate({ email: values.email, password: values.password }, {
        onSuccess: (response) => {
          if (response.success && response.data) {
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token);
            }
            onClose()
            router.push('/admin/home')
          } else if (response.success === false && response.data === undefined && response.message) {
            setLoginError(response.message);
          }
        },
        onError: (error: unknown) => {
          const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Đăng nhập thất bại';
          setLoginError(errorMessage);
        }
      })
    }
  }

  const handleLoginFormChange = () => {
    if (loginError) {
      setLoginError('');
    }
  }

  const handleRegisterFormChange = () => {
    if (registerError) {
      setRegisterError('');
    }
  }

  const handleRegisterFinish = (values: { email: string; password: string; confirmPassword: string }) => {
    setRegisterError('');
    
    // Chỉ gửi email và password, không gửi confirmPassword
    const registerData = {
      email: values.email,
      password: values.password
    };
    
    registerMutate(registerData, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          registerForm.resetFields();
          setActiveKey('login');
        } else if (response.success === false && response.data === undefined && response.message) {
          setRegisterError(response.message);
        }
      }
    })
  };

  const slideContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'white',
    textAlign: 'center',
    padding: '0 20px',
  };

  return (
    <Modal className="login-modal" isOpen={isOpen} onClose={onClose} variant="centered" size="2xl">
      <Row style={{ height: '100%' }}>
        <Col span={18} style={{ height: '100%' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundImage:
                'url(https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                maxHeight: '70vh',
              }}
            >
              <Carousel
                dotPosition="bottom"
                autoplay
                dots
                style={{ width: '100%', maxWidth: '600px', padding: '50px' }}
              >
                {carouselSlides.map((s) => (
                  <div key={s.id} style={{ height: '100%' }}>
                    <div style={slideContentStyle}>
                      <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
                        {s.title} <span style={{ color: 'var(--primary)' }}>{s.accent}</span>
                      </h2>
                      <h1 style={{ fontSize: 64, fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>
                        {s.bigTitle}
                      </h1>
                      {s.subtitle ? <h3 style={{ fontSize: 16, margin: 0 }}>{s.subtitle}</h3> : null}
                      <p style={{ fontSize: 14, fontWeight: 500, maxWidth: 520, marginTop: 12 }}>{s.description}</p>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </Col>

        <Col
          span={6}
          style={{
            padding: 20,
            display: 'flex',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, var(--bg), var(--bg))',
          }}
        >
          <div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>AI Planing</div>
              <div style={{ fontSize: 20, color: 'var(--primary)', fontWeight: 800, marginTop: 3 }}>FIT</div>
            </div>

            <Tabs
              className="themed-tabs"
              activeKey={activeKey}
              onChange={(k: string) => setActiveKey(k as 'login' | 'register')}
              items={[
                {
                  key: 'login',
                  label: 'Đăng nhập',
                  children: (
                    <div>
                      <Form
                        form={loginForm}
                        layout="vertical"
                        name="login"
                        onFinish={handleLoginFinish}
                        onValuesChange={handleLoginFormChange}
                        initialValues={{ email: '', password: '', remember: false, userRole: undefined }}
                      >
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            {
                              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Email không hợp lệ',
                            },
                          ]}
                        >
                          <Input prefix={<Icon name="mdi:email" />} placeholder="Nhập email" />
                        </Form.Item>

                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                          <Input.Password prefix={<Icon name="mdi:lock" />} placeholder="Nhập mật khẩu" visibilityToggle />
                        </Form.Item>

                        <Form.Item
                          name="userRole"
                          label="Vai trò"
                          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                          getValueFromEvent={(e) => {
                            console.log('Radio onChange event:', e.target.value);
                            return e.target.value;
                          }}
                        >
                          <Radio.Group
                            className="role-radio-group"
                            style={{
                              width: '100%',
                            }}
                            onChange={(e) => {
                              console.log('Radio.Group onChange:', e.target.value);
                              loginForm.setFieldsValue({ userRole: e.target.value });
                            }}
                          >
                            <Radio 
                              value="admin" 
                              style={{ 
                                color: 'var(--text)',
                                fontWeight: 500
                              }}
                            >
                              Admin
                            </Radio>
                            <Radio 
                              value="advisor" 
                              style={{ 
                                color: 'var(--text)',
                                fontWeight: 500
                              }}
                            >
                              Advisor
                            </Radio>
                          </Radio.Group>
                          <style dangerouslySetInnerHTML={{
                            __html: `
                              .role-radio-group .ant-radio-checked .ant-radio-inner {
                                border-color: var(--primary) !important;
                              }
                              .role-radio-group .ant-radio-checked .ant-radio-inner::after {
                                background-color: var(--primary) !important;
                                transform: scale(0.875);
                              }
                              .role-radio-group .ant-radio:hover .ant-radio-inner {
                                border-color: var(--primary) !important;
                              }
                              .role-radio-group .ant-radio-wrapper {
                                color: var(--text) !important;
                              }
                            `
                          }} />
                        </Form.Item>

                        <Form.Item>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                            </Form.Item>
                            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                              Quên mật khẩu?
                            </a>
                          </div>
                        </Form.Item>

                        <Form.Item>
                          {loginError && (
                            <div style={{ 
                              color: 'var(--error)', 
                              fontSize: '12px',
                              textAlign: 'center'
                            }}>
                              {loginError}
                            </div>
                          )}
                          
                          <Button
                            variant="primary"
                            htmlType="submit"
                            loading={isLoginPending}
                            disabled={!!loginError} 
                            style={{ width: '100%', height: '34px', fontSize: '14px', fontWeight: '600' }}
                          >
                            Đăng nhập
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  ),
                },
                {
                  key: 'register',
                  label: 'Đăng ký',
                  children: (
                    <div>
                      <Form
                        form={registerForm}
                        layout="vertical"
                        name="register"
                        onFinish={handleRegisterFinish}
                        onValuesChange={handleRegisterFormChange}
                        initialValues={{ email: '', password: '', confirmPassword: '' }}
                      >
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            {
                              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Email không hợp lệ',
                            },
                          ]}
                        >
                          <Input prefix={<Icon name="mdi:email" />} placeholder="Nhập email" />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          label="Mật khẩu"
                          rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            { min: 6, message: 'Mật khẩu không hợp lệ' },
                          ]}
                          hasFeedback
                        >
                          <Input.Password prefix={<Icon name="mdi:lock" />} placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                          name="confirmPassword"
                          label="Nhập lại mật khẩu"
                          dependencies={['password']}
                          hasFeedback
                          rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp'));
                              },
                            }),
                          ]}
                        >
                          <Input.Password prefix={<Icon name="mdi:lock" />} placeholder="Nhập lại mật khẩu" />
                        </Form.Item>

                        <Form.Item>
                          {registerError && (
                            <div style={{ 
                              color: 'var(--error)', 
                              fontSize: '12px',
                              textAlign: 'center',
                              marginBottom: '8px'
                            }}>
                              {registerError}
                            </div>
                          )}
                          
                          <Button
                            variant="primary"
                            htmlType="submit"
                            loading={isRegisterPending}
                            disabled={!!registerError}
                            style={{
                              width: '100%',
                              height: '34px',
                              fontSize: '14px',
                              fontWeight: '600',
                              marginTop: 6,
                            }}
                          >
                            Đăng ký
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div style={{ textAlign: 'center', fontSize: 10, color: '#bfbfbf', marginTop: 10 }}>
            Điều khoản sử dụng &nbsp; | &nbsp; Chính sách bảo mật
            <div style={{ marginTop: 4 }}>Copyright © FitAI Planing. All rights reserved.</div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default LoginModal;

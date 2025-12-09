import React, { useEffect } from 'react';
import { Switch as AntSwitch, type SwitchProps as AntSwitchProps } from 'antd';

export interface ToggleProps extends Omit<AntSwitchProps, 'size'> {
  size?: 'small' | 'default';
  className?: string;
  showLabel?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  size = 'default',
  className,
  showLabel = false,
  activeLabel = 'Hoạt động',
  inactiveLabel = 'Tắt',
  checked,
  ...props
}) => {
  // Inject CSS styles
  useEffect(() => {
    const styleId = 'custom-toggle-switch-styles';
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .custom-toggle-switch.ant-switch-checked {
        background-color: #5ab544 !important;
      }

      .custom-toggle-switch.ant-switch-checked:hover:not(.ant-switch-disabled) {
        background-color: #5ab544 !important;
      }

      .custom-toggle-switch .ant-switch-handle::before {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      <AntSwitch
        size={size}
        checked={checked}
        className="custom-toggle-switch"
        {...props}
      />
      {showLabel && (
        <div
          className={`mt-2 text-xs font-medium ${
            checked ? '' : 'text-gray-500'
          }`}
          style={{
            color: checked ? '#5ab544' : undefined,
          }}
        >
          {checked ? activeLabel : inactiveLabel}
        </div>
      )}
    </div>
  );
};

export default Toggle;


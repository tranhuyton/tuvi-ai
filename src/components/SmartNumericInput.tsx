'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SmartNumericInputProps {
  value: number | undefined;
  onChangeValue: (val: number | undefined) => void;
  fallbackOnEmpty?: number;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Ô nhập số tối ưu cho điện thoại (iOS Safari & Android):
 * - Bật bàn phím số thuần túy (inputMode="numeric" pattern="[0-9]*").
 * - Khi chạm vào ô (onFocus): Tự động xóa rỗng ('') để người dùng gõ số mới ngay, tuyệt đối không bị dính số 0 ở đầu/cuối.
 * - Khi chạm ra ngoài (onBlur): Nếu người dùng chưa gõ gì thì tự khôi phục giá trị cũ (với ô bắt buộc) hoặc để trống (với ô tùy chọn).
 */
export default function SmartNumericInput({
  value,
  onChangeValue,
  fallbackOnEmpty,
  maxLength = 4,
  placeholder,
  className = '',
  required = false,
  disabled = false,
  ariaLabel,
}: SmartNumericInputProps) {
  const formatVal = (v: number | undefined) =>
    v !== undefined && v !== null && !Number.isNaN(v) && v > 0 ? String(v) : '';

  const [display, setDisplay] = useState<string>(() => formatVal(value));
  const isFocusedRef = useRef<boolean>(false);
  const savedBeforeFocusRef = useRef<string>(formatVal(value));

  useEffect(() => {
    if (!isFocusedRef.current) {
      const nextStr = formatVal(value);
      setDisplay(nextStr);
      if (nextStr) {
        savedBeforeFocusRef.current = nextStr;
      }
    }
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    if (display) {
      savedBeforeFocusRef.current = display;
    }
    // Bôi đen toàn bộ giá trị hiện tại để khách gõ số mới đè lên ngay mà không bị mất số đang xem
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      try {
        target.select();
      } catch {
        // ignore
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    setDisplay(digits);

    if (digits !== '') {
      const parsed = Number(digits);
      if (!Number.isNaN(parsed)) {
        onChangeValue(parsed);
      }
    } else if (fallbackOnEmpty === undefined) {
      onChangeValue(undefined);
    }
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    const trimmed = display.trim();

    if (trimmed === '') {
      if (fallbackOnEmpty !== undefined) {
        const restoredStr = savedBeforeFocusRef.current || String(fallbackOnEmpty);
        const restoredNum = Number(restoredStr) || fallbackOnEmpty;
        setDisplay(String(restoredNum));
        onChangeValue(restoredNum);
      } else {
        setDisplay('');
        onChangeValue(undefined);
      }
      return;
    }

    const cleanNum = Number(trimmed);
    if (!Number.isNaN(cleanNum) && cleanNum > 0) {
      const normalized = String(cleanNum);
      setDisplay(normalized);
      savedBeforeFocusRef.current = normalized;
      onChangeValue(cleanNum);
    } else if (fallbackOnEmpty !== undefined) {
      const restoredNum = Number(savedBeforeFocusRef.current) || fallbackOnEmpty;
      setDisplay(String(restoredNum));
      onChangeValue(restoredNum);
    } else {
      setDisplay('');
      onChangeValue(undefined);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      required={required && !disabled && !display && !savedBeforeFocusRef.current}
      disabled={disabled}
      value={display}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={isFocusedRef.current && savedBeforeFocusRef.current ? savedBeforeFocusRef.current : placeholder}
      aria-label={ariaLabel || placeholder}
      className={className}
    />
  );
}

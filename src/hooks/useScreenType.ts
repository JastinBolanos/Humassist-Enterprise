import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ScreenOrientation = 'portrait' | 'landscape';

export interface ScreenState {
  /**
   * Categorized device category:
   * - 'mobile': < 768px
   * - 'tablet': 768px - 1023px
   * - 'desktop': >= 1024px
   */
  deviceType: DeviceType;
  /** True if viewport width < 768px */
  isMobile: boolean;
  /** True if viewport width between 768px and 1023px */
  isTablet: boolean;
  /** True if viewport width >= 1024px */
  isDesktop: boolean;
  /** True if viewport is a narrow mobile device (< 400px, e.g. iPhone SE, compact Androids) */
  isSmallMobile: boolean;
  /** Viewport innerWidth in pixels */
  width: number;
  /** Viewport innerHeight in pixels */
  height: number;
  /** 'portrait' if height >= width, else 'landscape' */
  orientation: ScreenOrientation;
  /** Whether the device supports touch interaction */
  isTouch: boolean;
}

/**
 * Pure function to detect device category from viewport width.
 * Breakpoints aligned with Tailwind CSS responsive design:
 * - Mobile: < 768px (phones, phablets)
 * - Tablet: 768px - 1023px (iPads, tablets)
 * - Desktop: >= 1024px (laptops, monitors)
 */
export function detectScreenType(width: number): DeviceType {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Reads the current window dimensions and builds the ScreenState snapshot.
 * Safe for server or headless test environments.
 */
export function getScreenState(): ScreenState {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isSmallMobile: false,
      width: 1280,
      height: 800,
      orientation: 'landscape',
      isTouch: false,
    };
  }

  const width = window.innerWidth || document.documentElement.clientWidth || 360;
  const height = window.innerHeight || document.documentElement.clientHeight || 640;
  const deviceType = detectScreenType(width);
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isSmallMobile: width < 400,
    width,
    height,
    orientation: height >= width ? 'portrait' : 'landscape',
    isTouch,
  };
}

/**
 * React hook that actively listens to viewport resize and orientation changes
 * and returns the responsive ScreenState.
 */
export function useScreenType(): ScreenState {
  const [screen, setScreen] = useState<ScreenState>(getScreenState);

  useEffect(() => {
    let timeoutId: number;

    const updateScreen = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setScreen(getScreenState());
      }, 40);
    };

    // Initial sync
    setScreen(getScreenState());

    window.addEventListener('resize', updateScreen, { passive: true });
    window.addEventListener('orientationchange', updateScreen, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateScreen);
      window.removeEventListener('orientationchange', updateScreen);
    };
  }, []);

  return screen;
}

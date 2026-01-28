import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// Debounce utility for scroll/resize events
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Custom hook for managing dropdown functionality
 * @param {Object} options - Configuration options
 * @param {boolean} options.disabled - Whether the dropdown is disabled
 * @param {function} options.onOpen - Callback when dropdown opens
 * @param {function} options.onClose - Callback when dropdown closes
 * @param {number} options.gap - Gap between trigger and dropdown (default: 4px)
 * @param {number} options.debounceMs - Debounce time for scroll/resize (default: 16ms)
 * @returns {Object} Dropdown state and handlers
 */
export const useDropdown = ({
  disabled = false,
  onOpen,
  onClose,
  gap = 4,
  debounceMs = 16,
} = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const initialScrollRef = useRef(0);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const newPosition = {
      top: rect.bottom + gap,
      left: rect.left,
      width: rect.width,
    };

    setPosition((prevPosition) => {
      // Only update if position actually changed to prevent unnecessary re-renders
      if (
        prevPosition.top !== newPosition.top ||
        prevPosition.left !== newPosition.left ||
        prevPosition.width !== newPosition.width
      ) {
        return newPosition;
      }
      return prevPosition;
    });
  }, [gap]);

  // Memoize debounced handlers to prevent recreation on every render
  const debouncedCalculatePosition = useMemo(
    () => debounce(calculatePosition, debounceMs),
    [calculatePosition, debounceMs],
  );

  const toggle = useCallback(() => {
    if (disabled) return;

    setIsOpen((prevIsOpen) => {
      const newIsOpen = !prevIsOpen;
      if (newIsOpen) {
        // Capture initial scroll position when dropdown opens
        initialScrollRef.current =
          window.pageYOffset || document.documentElement.scrollTop;
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(calculatePosition);
      }
      return newIsOpen;
    });
  }, [disabled, calculatePosition]);

  const open = useCallback(() => {
    if (disabled) return;

    // Capture initial scroll position when dropdown opens
    initialScrollRef.current =
      window.pageYOffset || document.documentElement.scrollTop;
    requestAnimationFrame(calculatePosition);
    setIsOpen(true);
  }, [disabled, calculatePosition]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoize event handlers to prevent recreation
  const handleClickOutside = useCallback((event) => {
    if (
      triggerRef.current &&
      !triggerRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (isOpen) {
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollDifference = Math.abs(
        currentScroll - initialScrollRef.current,
      );

      // Close dropdown if scrolled more than 100px from initial position
      if (scrollDifference > 100) {
        setIsOpen(false);
      } else {
        debouncedCalculatePosition();
      }
    }
  }, [isOpen, debouncedCalculatePosition]);

  const handleResize = useCallback(() => {
    if (isOpen) {
      debouncedCalculatePosition();
    }
  }, [isOpen, debouncedCalculatePosition]);

  // Handle event listeners with proper cleanup
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("mousedown", handleClickOutside, {
      passive: true,
    });
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, {
        passive: true,
      });
      window.removeEventListener("scroll", handleScroll, {
        passive: true,
        capture: true,
      });
      window.removeEventListener("resize", handleResize, { passive: true });
    };
  }, [isOpen, handleClickOutside, handleScroll, handleResize]);

  // Handle open/close callbacks with stable references
  const stableOnOpen = useCallback(() => {
    if (onOpen) onOpen();
  }, [onOpen]);

  const stableOnClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      stableOnOpen();
    } else {
      stableOnClose();
    }
  }, [isOpen, stableOnOpen, stableOnClose]);

  // Close dropdown when sidebar opens

  // Cleanup timeout on unmount
  useEffect(() => {
    const currentTimeout = timeoutRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  // Memoize return object to prevent unnecessary re-renders in consuming components
  return useMemo(
    () => ({
      isOpen,
      position,
      triggerRef,
      dropdownRef,
      toggle,
      open,
      close,
    }),
    [isOpen, position, toggle, open, close],
  );
};

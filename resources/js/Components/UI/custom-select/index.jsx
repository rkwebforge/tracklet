import { useCallback, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import { useDropdown } from "@/hooks/useDropdown";

/**
 * CustomSelectInput component
 * This component renders a custom select input with a dropdown menu.
 * @param {string} label - The label text for the input.
 * @param {array} options - The options to display in the dropdown menu.
 * @param {object|string} value - The current value of the input.
 * @param {function} onChange - The function to call when the value changes.
 * @param {string} placeholder - The placeholder text for the input.
 * @param {string} errorMessage - The error message to display if input is invalid.
 * @param {function} t - The translation function.
 * @param {boolean} translateOptions - Whether to translate the options or not.
 * @param {function} onMenuOpen - The function to call when the menu opens.
 * @param {function} onMenuClose - The function to call when the menu closes.
 * @returns {JSX.Element} The CustomSelectInput component.
 */
const CustomSelectInput = ({
  label,
  maxWidth = "max-w-full",
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  errorMessage,
  t,
  translateOptions = true,
  onMenuOpen,
  onMenuClose,
  disabled = false,
}) => {
  const {
    isOpen,
    position: dropdownPosition,
    triggerRef,
    dropdownRef,
    toggle: toggleMenu,
    close,
  } = useDropdown({
    disabled,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  });

  const scrollContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollIntervalRef = useRef(null);
  const canScrollUpRef = useRef(false);
  const canScrollDownRef = useRef(false);

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const up = scrollTop > 0;
    const down = scrollTop + clientHeight < scrollHeight - 1;
    setCanScrollUp(up);
    setCanScrollDown(down);
    canScrollUpRef.current = up;
    canScrollDownRef.current = down;
  }, []);

  const startScrolling = useCallback(
    (direction) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollStep = 30; // pixels per scroll step
      const scrollInterval = 100; // milliseconds between scroll steps

      scrollIntervalRef.current = setInterval(() => {
        if (direction === "up") {
          if (!canScrollUpRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
            return;
          }
          container.scrollTop -= scrollStep;
        } else if (direction === "down") {
          if (!canScrollDownRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
            return;
          }
          container.scrollTop += scrollStep;
        }
        checkScrollPosition();
      }, scrollInterval);
    },
    [checkScrollPosition],
  );

  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Check scroll position after dropdown opens
      setTimeout(checkScrollPosition, 0);
    }
  }, [isOpen, checkScrollPosition]);

  const handleOptionClick = useCallback(
    (option) => {
      if (onChange) {
        onChange(option);
      }
      close();
    },
    [onChange, close],
  );

  const getDisplayValue = () => {
    if (!value) return null;
    let displayName = "";
    if (typeof value === "string") {
      displayName = value;
    } else if (value?.id) {
      displayName = options.find((option) => option.id === value.id)?.name;
    } else {
      displayName = value?.name || "";
    }
    return displayName;
  };

  const displayValue = getDisplayValue();
  const safeTranslate = useCallback(
    (option) => {
      if (typeof option === "object" && option !== null) {
        return option.name;
      }
      if (translateOptions && typeof t === "function") {
        return t(option);
      }
      return option;
    },
    [translateOptions, t],
  );

  return (
    <div className={clsx("w-full min-w-44", maxWidth)}>
      <h6 className={clsx("text-sm font-medium ")}>{label}</h6>
      <div
        ref={triggerRef}
        className={clsx(
          "relative mt-1 mb-0.5 w-full rounded-3xl border border-gray-300 whitespace-nowrap select-none transition-colors",
          isOpen && "border-primary-500 bg-white",
          disabled
            ? "cursor-not-allowed bg-gray-100 hover:border-gray-300"
            : "cursor-pointer hover:bg-white hover:border-gray-400 focus-within:border-primary-500 focus-within:bg-white",
        )}
        onClick={!disabled ? toggleMenu : undefined}
      >
        <div className="flex items-center justify-between gap-2.5 py-2 pr-10 pl-5">
          {displayValue ? (
            <div
              title={safeTranslate(displayValue)}
              className={clsx(
                "truncate",
                disabled ? "text-gray-400" : "text-gray-900",
              )}
            >
              {safeTranslate(displayValue)}
            </div>
          ) : (
            <div
              className={clsx(
                "truncate",
                disabled ? "text-gray-400" : "text-gray-400",
              )}
            >
              {placeholder}
            </div>
          )}
          <ChevronDown
            className={clsx(
              "absolute right-5 mt-0.5 h-5 w-5 shrink-0 text-gray-600",
              disabled && "opacity-60",
            )}
          />
        </div>
      </div>

      {isOpen &&
        !disabled &&
        createPortal(
          <div
            ref={dropdownRef}
            className="dropDownFade fixed z-[9999] overflow-hidden rounded-md border bg-white shadow-[0_0_20px_0_rgba(255,255,255,0.5)]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
            onMouseLeave={stopScrolling} // Stop scrolling when leaving dropdown
          >
            <div className="relative">
              {/* Scroll Up Indicator */}
              {canScrollUp && (
                <button
                  className="pointer-events-auto absolute top-0 right-0 left-0 z-10 flex h-5 w-full items-center justify-center bg-gray-50/95 pt-1 backdrop-blur-sm transition-colors duration-150"
                  onMouseEnter={() => startScrolling("up")}
                  onMouseLeave={stopScrolling}
                  onMouseDown={(e) => e.preventDefault()}
                  type="button"
                  aria-label="Scroll up"
                >
                  <ChevronUp className="h-5 w-5 text-gray-600 transition-transform" />
                </button>
              )}
              {/* Scrollable Options */}
              <div
                ref={scrollContainerRef}
                className="scrollbar-hide relative flex max-h-60 flex-col overflow-y-auto"
                style={{
                  paddingTop: canScrollUp ? "32px" : "0px",
                  paddingBottom: canScrollDown ? "32px" : "0px",
                }}
                onScroll={checkScrollPosition}
                onWheel={(e) => e.preventDefault()}
              >
                {options.map((option) => (
                  <div
                    title={safeTranslate(option)}
                    key={typeof option === "object" ? option.id : option}
                    className="hover:text- flex-shrink-0 cursor-pointer truncate px-3 py-1.5 text-base select-none hover:bg-green-300 hover:font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionClick(option);
                    }}
                  >
                    {safeTranslate(option)}
                  </div>
                ))}
              </div>
              {/* Scroll Down Indicator */}
              {canScrollDown && (
                <button
                  className="pointer-events-auto absolute right-0 bottom-0 left-0 z-10 flex h-5 w-full items-center justify-center bg-gray-50/95 pb-1 backdrop-blur-sm transition-colors duration-150"
                  onMouseEnter={() => startScrolling("down")}
                  onMouseLeave={stopScrolling}
                  onMouseDown={(e) => e.preventDefault()}
                  type="button"
                  aria-label="Scroll down"
                >
                  <ChevronDown className="h-5 w-5 text-gray-600 transition-transform" />
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}
      {errorMessage && <p className="text-xs text-red-600">*{errorMessage}</p>}
    </div>
  );
};

CustomSelectInput.displayName = "CustomSelectInput";

CustomSelectInput.propTypes = {
  maxWidth: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        name: PropTypes.string.isRequired,
      }),
    ]),
  ),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    }),
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  t: PropTypes.func,
  translateOptions: PropTypes.bool,
  onMenuOpen: PropTypes.func,
  onMenuClose: PropTypes.func,
  disabled: PropTypes.bool,
};

export default CustomSelectInput;

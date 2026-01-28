import { useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";

/**
 * CustomPasswordInput component
 *  This component renders a custom password input with a toggle button to show/hide the password.
 * @param {string} label - The label text for the input.
 * @param {string} errorMessage - The error message to display if input is invalid.
 * @param {string} inputId - The id for the input element.
 * @param {string} placeholder - The placeholder text for the input.
 * @param {boolean} disabled - Whether the input is disabled or not.
 * @param {string} autoComplete - The autocomplete attribute for the input.
 * @param {string} value - The controlled value of the input.
 * @param {string} defaultValue - The default value for uncontrolled usage.
 * @param {function} onChange - The callback function to call when the input value changes.
 * @returns {JSX.Element} The CustomPasswordInput component.
 */
const CustomPasswordInput = ({
  autoComplete = "on",
  label,
  errorMessage,
  inputId,
  placeholder,
  disabled,
  value,
  defaultValue,
  onChange,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative w-full min-w-44">
      <h6 className="text-sm text-gray-600">{label}</h6>
      <div
        className={`${disabled ? "bg-gray-100" : "focus-within:bg-white hover:border-gray-400 hover:bg-white"} mt-1 mb-0.5 flex items-center gap-2.5 overflow-hidden rounded-3xl border border-gray-300 pr-5 pl-2 focus-within:border-primary-500 transition-colors`}
      >
        <input
          id={inputId}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          type={isPasswordVisible ? "text" : "password"}
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={onChange}
          className="w-full rounded-md border-none bg-transparent ring-0 outline-none placeholder:text-gray-400 focus:border-none focus:ring-0 h-10 disabled:cursor-not-allowed disabled:text-gray-400"
          {...props}
        />
        <button
          type="button"
          aria-label="Toggle password visibility"
          onClick={togglePasswordVisibility}
          className="rounded-full text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isPasswordVisible ? (
            <Eye className="h-5 w-5 flex-shrink-0" />
          ) : (
            <EyeOff className="h-5 w-5 flex-shrink-0" />
          )}
        </button>
      </div>
      {errorMessage && <p className="text-xs text-red-600">*{errorMessage}</p>}
    </div>
  );
};

CustomPasswordInput.displayName = "CustomPasswordInput";

CustomPasswordInput.propTypes = {
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};

export default CustomPasswordInput;

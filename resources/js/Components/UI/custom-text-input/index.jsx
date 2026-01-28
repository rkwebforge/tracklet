import PropTypes from "prop-types";

/**
 * CustomTextInput component
 *  This component renders a custom text input with validation and formatting capabilities.
 * @param {string} label - The label text for the input.
 * @param {string} errorMessage - The error message to display if input is invalid.
 * @param {string} inputId - The unique identifier for the input.
 * @param {string} placeholder - The placeholder text for the input.
 * @param {boolean} disabled - Whether the input should be disabled or not.
 * @param {string} defaultValue - The default value for the input.
 * @param {object} props - Additional props to be passed to the input element.
 * @returns {JSX.Element} The rendered CustomTextInput component.
 */
const CustomTextInput = ({
  label,
  errorMessage,
  inputId,
  placeholder,
  disabled,
  defaultValue,
  onChange,
  value,
  ...props
}) => {
  return (
    <div className="relative w-full min-w-44">
      <h6 className="text-sm text-gray-600">{label}</h6>
      <div
        className={`${disabled ? "bg-gray-100" : "focus-within:bg-white hover:border-gray-400 hover:bg-white"} mt-1 mb-0.5 flex items-center overflow-hidden rounded-3xl border border-gray-300 px-2 focus-within:border-primary-500 transition-colors`}
      >
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          {...(value !== undefined ? { value } : { defaultValue })}
          autoComplete="off"
          onChange={onChange}
          className="w-full rounded-md border-none bg-transparent ring-0 h-10 outline-none placeholder:text-gray-400 focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400"
          {...props}
        />
      </div>
      {errorMessage && <p className="text-xs text-red-600">*{errorMessage}</p>}
    </div>
  );
};
CustomTextInput.displayName = "CustomTextInput";

CustomTextInput.propTypes = {
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default CustomTextInput;

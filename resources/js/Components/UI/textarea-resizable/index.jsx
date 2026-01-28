import PropTypes from "prop-types";
import ReactTextareaAutosize from "react-textarea-autosize";

const CustomTextAreaAutoResize = ({
  label,
  errorMessage,
  inputId,
  placeholder,
  disabled,
  defaultValue,
  onChange,
  value,
  minRows = 3,
  maxRows = 5,
  className = "",
  ...props
}) => {
  return (
    <div className="relative w-full">
      <h6 className="text-sm text-gray-600">{label}</h6>
      <div
        className={`${disabled ? "bg-gray-100" : "focus-within:bg-white hover:border-gray-400 hover:bg-white"} mt-1 mb-0.5 flex items-center rounded-3xl border border-gray-300 px-5 py-2 focus-within:border-primary-500 transition-colors`}
      >
        <ReactTextareaAutosize
          id={inputId}
          className={`w-full resize-none rounded-md border-none bg-transparent ring-0 outline-none placeholder:text-gray-400 focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400 ${className}`}
          minRows={minRows}
          maxRows={maxRows}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={onChange}
          value={value}
          {...props}
        />
      </div>
      {errorMessage && <p className="text-xs text-red-600">*{errorMessage}</p>}
    </div>
  );
};

CustomTextAreaAutoResize.propTypes = {
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  inputId: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  className: PropTypes.string,
};

CustomTextAreaAutoResize.displayName = "CustomTextAreaAutoResize";

export default CustomTextAreaAutoResize;

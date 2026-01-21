import clsx from "clsx";
import { forwardRef } from "react";

const Input = forwardRef(function Input({
  type = "text",
  className = "",
  error = null,
  label = null,
  id,
  ...props
}, ref) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={clsx(
          "input",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Input;

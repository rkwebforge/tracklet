import clsx from 'clsx';

export default function Button({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    disabled = false,
    className = '',
    ...props 
}) {
    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={clsx(
                baseClasses,
                variantClasses[variant],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

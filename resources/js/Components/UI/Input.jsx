import clsx from 'clsx';

export default function Input({ 
    type = 'text', 
    className = '', 
    error = null,
    label = null,
    id,
    ...props 
}) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="label">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={clsx(
                    'input',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

import { Form } from "react-bootstrap";

function Input({ className = '', type = 'text', options = [], ...props }) {
    if (type === 'select') {
        return (
            <Form.Select className={className} {...props}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Form.Select>
        );
    }

    const componentProps = {
        className,
        ...(type === 'textarea' ? { as: 'textarea' } : { type }),
        ...props,
    };
    return <Form.Control {...componentProps} />;
}

export { Input };
import { Input } from "../atoms/Input"
import { Form } from 'react-bootstrap';

function DynamicForm({ inputs = [], onSubmit, children }) {
    return (
        <Form onSubmit={onSubmit}>
            {inputs.map((input, index) => {
                const { id, ...inputProps } = input;
                const inputId = id || index;

                return (
                    <Form.Group key={inputId} controlId={`input-${inputId}`}>
                        {input.label && <Form.Label>{input.label}</Form.Label>}
                        <Input {...inputProps} />
                        {input.error && <Form.Text className="text-danger">{input.error}</Form.Text>}
                    </Form.Group>
                );
            })}
            {children}
        </Form>
    )
}

export default DynamicForm;
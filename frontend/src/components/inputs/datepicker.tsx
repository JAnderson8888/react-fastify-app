import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerInputProps {
  selectedDate: Date | null;
  label: string;
  onChange: (date: Date | null) => void;
}

function DatePickerInput({ selectedDate, label, onChange }: DatePickerInputProps) {
  return (
    <Form.Group className="d-flex flex-column gap-2">
      <Form.Label>{label}</Form.Label>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        className="form-control"
        placeholderText="Click to select a date"
      />
    </Form.Group>
  );
}

export default DatePickerInput;
